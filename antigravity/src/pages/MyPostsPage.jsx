import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { notifications } from '@mantine/notifications'

export default function MyPostsPage() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    const emojis = {
        '💼 Wallet / Purse': '👛', '🔑 Keys': '🔑', '📱 Electronics': '📱',
        '🎒 Bags / Backpacks': '🎒', '👓 Glasses': '👓', '📚 Textbooks / Notes': '📚',
        '🆔 ID / Student Card': '🪪', '💧 Water Bottle': '💧', '🧥 Clothing': '🧥'
    }

    useEffect(() => {
        fetchMyItems()
    }, [])

    async function fetchMyItems() {
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            notifications.show({ message: error.message, color: 'red' })
        } else {
            setItems(data)
        }
        setLoading(false)
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure?')) return
        const { error } = await supabase.from('items').delete().eq('id', id)
        if (error) {
            notifications.show({ message: error.message, color: 'red' })
        } else {
            notifications.show({ message: 'Item deleted ✅', color: 'green' })
            setItems(items.filter(i => i.id !== id))
        }
    }

    return (
        <div style={{ background: '#f0f4ff', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                    <div>
                        <h2 style={{ fontSize: '26px', fontWeight: 800 }}>📋 My Posts</h2>
                        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Your published items</p>
                    </div>
                    <button onClick={() => navigate('/post')}
                        style={{ padding: '9px 20px', borderRadius: '50px', background: '#2563eb', color: 'white', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                        + New Post
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>⏳ Loading...</div>
                ) : items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px', color: '#64748b' }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
                        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>No posts yet</h3>
                        <p style={{ marginBottom: '24px' }}>Share a lost or found item with your campus!</p>
                        <button onClick={() => navigate('/post')}
                            style={{ padding: '10px 24px', borderRadius: '50px', background: '#2563eb', color: 'white', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                            + Post an Item
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '18px' }}>
                        {items.map(item => (
                            <div key={item.id}
                                style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                onClick={() => navigate(`/item/${item.id}`)}
                            >
                                <div style={{ height: '160px', background: '#f8faff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '52px', position: 'relative' }}>
                                    {emojis[item.category] || '📦'}
                                    <span style={{
                                        position: 'absolute', top: '10px', right: '10px',
                                        padding: '3px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 700,
                                        background: item.status === 'lost' ? '#fee2e2' : '#d1fae5',
                                        color: item.status === 'lost' ? '#ef4444' : '#10b981'
                                    }}>
                                        {item.status.toUpperCase()}
                                    </span>
                                </div>
                                <div style={{ padding: '14px 16px' }}>
                                    <div style={{ fontWeight: 700, marginBottom: '4px' }}>{item.title}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>📍 {item.location}</div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={e => { e.stopPropagation(); navigate(`/item/${item.id}`) }}
                                            style={{ padding: '6px 14px', borderRadius: '50px', background: '#2563eb', color: 'white', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                                            View
                                        </button>
                                        <button onClick={e => { e.stopPropagation(); handleDelete(item.id) }}
                                            style={{ padding: '6px 14px', borderRadius: '50px', background: '#fee2e2', color: '#ef4444', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}