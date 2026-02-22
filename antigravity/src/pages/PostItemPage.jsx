import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { notifications } from '@mantine/notifications'

import {
  Anchor,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  FileInput,
} from '@mantine/core'

const CATEGORIES = [
  '💼 Wallet',
  '🔑 Keys',
  '📱 Electronics',
  '🎒 Bags / Backpacks',
  '👓 Glasses',
  '📚 Textbooks / Notes',
  '🆔 ID / Student Card',
  '💧 Water Bottle',
  '🧥 Clothing',
  '🎧 Accessories',
]

const INITIAL_FORM = {
  title: '',
  category: '',
  location: '',
  description: '',
  contact_method: '',
  status: 'lost',
}

export default function PostItemPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [imageFile,setImageFile] = useState(null);

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    // מנקה שגיאה לשדה ברגע שמשנים אותו
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function validate() {
    const e = {}

    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.category) e.category = 'Category is required'
    if (!form.location.trim()) e.location = 'Location is required'
    if (!form.contact_method.trim()) e.contact_method = 'Contact method is required'


    // ולידציה לתמונה
  if (!imageFile) {
    e.image = 'Image is required'
  } else {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 

    if (!allowedTypes.includes(imageFile.type)) {
      e.image = 'Only JPG / PNG / WEBP are allowed'
    } else if (imageFile.size > maxSize) {
      e.image = 'Image must be up to 5MB'
    }
  }


    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function uploadItemImage(file, userId) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const fileName = `${userId}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`

  const { error: uploadError } = await supabase.storage
   
  .from('item-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage.from('item-images').getPublicUrl(fileName)
  return data.publicUrl
}



  async function handleSubmit(event) {
    event.preventDefault()

    if (!user) {
      notifications.show({
        message: 'Please login first',
        color: 'red',
      })
      navigate('/login')
      return
    }

    if (!validate()) return

    setLoading(true)

    let imageUrl = null

try {
  imageUrl = await uploadItemImage(imageFile, user.id)
} catch (uploadErr) {
  notifications.show({
    message: uploadErr.message || 'Failed to upload image',
    color: 'red',
  })
  setLoading(false)
  return
}

    const payload = {
      title: form.title.trim(),
      category: form.category,
      location: form.location.trim(),
      description: form.description.trim(),
      contact_method: form.contact_method.trim(),
      status: form.status,
      item_img_url: imageUrl,
      user_id: user.id,
      user_name: user.user_metadata?.full_name || user.email,
    }

    const { error } = await supabase.from('items').insert(payload)

    if (error) {
      notifications.show({
        message: error.message || 'Failed to post item',
        color: 'red',
      })
      setLoading(false)
      return
    }

    notifications.show({
      message: 'Item posted successfully! 🎉',
      color: 'green',
    })

    setForm(INITIAL_FORM)
    setImageFile(null)
    setLoading(false)
    navigate('/')
  }

  const breadcrumbsItems = [
    <Anchor key="home" component={Link} to="/" c="dimmed" size="sm">
      🏠 Home
    </Anchor>,
    <Text key="post" c="dimmed" size="sm">
      Post Item
    </Text>,
  ]

  return (
    <Box bg="#f0f4ff" mih="100vh" py={40} px={20}>
      <Container size={600}>
        <Breadcrumbs mb="md">{breadcrumbsItems}</Breadcrumbs>

        <Paper radius="xl" p="xl" shadow="md">
          <Stack gap="xs" mb="lg" align="center">
            <Title order={2} ta="center">
              📋 Post a Lost or Found Item
            </Title>
            <Text c="dimmed" size="sm" ta="center">
              Help your campus community
            </Text>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Title"
                placeholder="e.g. Brown Wallet, Blue Water Bottle..."
                value={form.title}
                onChange={(e) => setField('title', e.currentTarget.value)}
                error={errors.title}
                required
                radius="md"
              />

              <Select
                label="Category"
                placeholder="Select category"
                data={CATEGORIES}
                value={form.category || null}
                onChange={(value) => setField('category', value || '')}
                error={errors.category}
                required
                radius="md"
                searchable
                nothingFoundMessage="No category found"
              />

              <FileInput
  label="Item Image"
  placeholder="Upload item image (JPG / PNG / WEBP)"
  accept="image/png,image/jpeg,image/webp"
  value={imageFile}
  onChange={(file) => {
    setImageFile(file)
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: undefined }))
    }
  }}
  error={errors.image}
  required
  radius="md"
  clearable
/>
{imageFile && (
  <Text size="xs" c="dimmed">
    Selected: {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
  </Text>
)}


              <TextInput
                label="Location"
                placeholder="e.g. Main Library, Campus Gym..."
                value={form.location}
                onChange={(e) => setField('location', e.currentTarget.value)}
                error={errors.location}
                required
                radius="md"
              />

              <Textarea
                label="Description"
                placeholder="Color, size, identifying features..."
                value={form.description}
                onChange={(e) => setField('description', e.currentTarget.value)}
                autosize
                minRows={4}
                radius="md"
              />

              <TextInput
                label="Contact Method"
                placeholder="Email, phone, WhatsApp..."
                value={form.contact_method}
                onChange={(e) => setField('contact_method', e.currentTarget.value)}
                error={errors.contact_method}
                required
                radius="md"
              />

              {/* Status Toggle */}
              <Stack gap={6}>
                <Text size="sm" fw={500}>
                  Status <Text span c="red">*</Text>
                </Text>

                <Group grow>
                  <Button
                    type="button"
                    variant={form.status === 'lost' ? 'filled' : 'light'}
                    color="red"
                    radius="xl"
                    onClick={() => setField('status', 'lost')}
                  >
                    ❌ Lost
                  </Button>

                  <Button
                    type="button"
                    variant={form.status === 'found' ? 'filled' : 'light'}
                    color="green"
                    radius="xl"
                    onClick={() => setField('status', 'found')}
                  >
                    ✅ Found
                  </Button>
                </Group>
              </Stack>

              <Button
                type="submit"
                loading={loading}
                radius="xl"
                size="md"
                mt="xs"
              >
                {loading ? 'Submitting...' : '🚀 Submit Item'}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}