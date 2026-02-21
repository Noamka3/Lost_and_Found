import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { notifications } from '@mantine/notifications'

export default function Navbar() {
    const { user } = useAuth()
    const navigate = useNavigate()

    async function handleLogout() {
        await supabase.auth.signOut()
        notifications.show({ message: 'Logged out successfully', color: 'blue' })
        navigate('/')
    }

    return (
        <nav style={{
            background: 'white',
            borderBottom: '1px solid #e2e8f0',
            padding: '0 24px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🔍</span>
                <div>
                    <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '16px' }}>Lost & Found</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>Campus Platform</div>
                </div>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/" style={{ padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
                    🏠 All Items
                </Link>

                {user ? (
                    <>
                        <Link to="/my-posts" style={{ padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
                            📋 My Posts
                        </Link>
                        <Link to="/post" style={{ padding: '10px 20px', borderRadius: '50px', textDecoration: 'none', background: '#2563eb', color: 'white', fontSize: '14px', fontWeight: 600 }}>
                         + Post Item
                        </Link>
                        <button onClick={handleLogout} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#64748b', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
                            👤 Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" style={{ padding: '9px 20px', borderRadius: '50px', textDecoration: 'none', background: '#2563eb', color: 'white', fontSize: '14px', fontWeight: 600 }}>
                        Login / Register
                    </Link>
                )}
            </div>
        </nav>
    )
}