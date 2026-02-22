import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { notifications } from '@mantine/notifications'

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) {
                notifications.show({ message: error.message, color: 'red' })
            } else {
                notifications.show({ message: 'Welcome back! 🎉', color: 'green' })
                navigate('/')
            }
        } else {
            const { error } = await supabase.auth.signUp({
                email, password,
                options: { data: { full_name: name },
                emailRedirectTo: 'https://your-public-site.com/'
             }
            })
            if (error) {
                notifications.show({ message: error.message, color: 'red' })
            } else {
                notifications.show({ message: 'Account created! Welcome 🎓', color: 'green' })
                navigate('/')
            }
        }
        setLoading(false)
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4ff', padding: '40px 20px' }}>
            <div style={{ background: 'white', borderRadius: '24px', padding: '44px', width: '100%', maxWidth: '420px', boxShadow: '0 12px 40px rgba(37,99,235,0.15)' }}>
                <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
                    {isLogin ? '👋 Welcome back' : '🎓 Join Campus'}
                </h2>
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', marginBottom: '32px' }}>
                    {isLogin ? 'Login to your campus account' : 'Create your free account'}
                </p>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Full Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} required
                                placeholder="Your name"
                                style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        </div>
                    )}

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                            placeholder="your@university.edu"
                            style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                            placeholder="••••••••" minLength={6}
                            style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                    </div>

                    <button type="submit" disabled={loading}
                        style={{ width: '100%', padding: '13px', borderRadius: '50px', background: '#2563eb', color: 'white', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
                        {loading ? '⏳ Please wait...' : isLogin ? '🔐 Login' : '✨ Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <span onClick={() => setIsLogin(!isLogin)}
                        style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>
                        {isLogin ? 'Register Now' : 'Login'}
                    </span>
                </p>
            </div>
        </div>
    )
}