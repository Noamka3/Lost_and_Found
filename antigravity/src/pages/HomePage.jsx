import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { notifications } from '@mantine/notifications'

export default function HomePage() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        fetchItems()
    }, [])

    async function fetchItems() {
        setLoading(true)
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            notifications.show({ message: 'Error loading items', color: 'red' })
        } else {
            setItems(data)
        }
        setLoading(false)
    }

    const filtered = items.filter(item => {
        const matchFilter = filter === 'all' || item.status === filter
        const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.location.toLowerCase().includes(search.toLowerCase())
        return matchFilter && matchSearch
    })

    const emojis = {
        '💼 Wallet / Purse': '👛', '🔑 Keys': '🔑', '📱 Electronics': '📱',
        '🎒 Bags / Backpacks': '🎒', '👓 Glasses': '👓', '📚 Textbooks / Notes': '📚',
        '🆔 ID / Student Card': '🪪', '💧 Water Bottle': '💧', '🧥 Clothing': '🧥'
    }

    return (
        <div style={{ background: '#f0f4ff', minHeight: '100vh' }}>
            {/* Hero */}
            <div style={{ textAlign: 'center', padding: '56px 24px 40px', maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '12px' }}>
                    Found something? Lost something? ✨
                </h1>
                <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '28px' }}>
                    A community platform for campus
                </p>

                {/* Search */}
                <div style={{ display: 'flex', background: 'white', borderRadius: '50px', border: '2px solid #e2e8f0', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by keyword or location..."
                        style={{ flex: 1, border: 'none', outline: 'none', padding: '13px 20px', fontSize: '14px', background: 'transparent' }}
                    />
                    <button style={{ padding: '13px 20px', background: '#2563eb', border: 'none', cursor: 'pointer', fontSize: '16px' }}>🔍</button>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {['all', 'lost', 'found'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            padding: '8px 20px', borderRadius: '50px', border: '2px solid',
                            borderColor: filter === f ? (f === 'lost' ? '#ef4444' : f === 'found' ? '#10b981' : '#2563eb') : '#e2e8f0',
                            background: filter === f ? (f === 'lost' ? '#ef4444' : f === 'found' ? '#10b981' : '#2563eb') : 'white',
                            color: filter === f ? 'white' : '#64748b',
                            fontWeight: 600, fontSize: '13px', cursor: 'pointer'
                        }}>
                            {f === 'all' ? '🔎 All' : f === 'lost' ? '❌ Lost' : '✅ Found'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 60px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                        ⏳ Loading items...
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px', color: '#64748b' }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
                        <h3>No items found</h3>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '18px' }}>
                        {filtered.map(item => (
                            <div key={item.id} onClick={() => navigate(`/item/${item.id}`)}
                                style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
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
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>📍 {item.location}</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '12px' }}>📁 {item.category}</div>
                                    <button style={{ padding: '6px 16px', borderRadius: '50px', background: '#2563eb', color: 'white', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}