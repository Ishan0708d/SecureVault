import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) { setError('Please enter a valid email address'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (password !== confirmPassword) { setError('Passwords do not match'); return }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      const token = await user.getIdToken()

      await axios.post('import.meta.env.VITE_API_URL/auth/register', { email }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      navigate('/dashboard')
    } catch (err) {
      switch (err.code) {
        case 'auth/email-already-in-use': setError('An account with this email already exists'); break
        case 'auth/invalid-email': setError('Please enter a valid email address'); break
        case 'auth/weak-password': setError('Password must be at least 6 characters'); break
        default: setError('Something went wrong. Please try again')
      }
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0f1a 0%, #0d1528 40%, #111827 70%, #0a0f1a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: '600px', height: '600px',borderRadius: '50%', background: 'radial-gradient(circle, rgba(100,140,200,0.35) 0%, rgba(70,100,160,0.15) 40%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ background: '#fff', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '560px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', background: '#1a1a1a', borderRadius: '12px', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Create Account</h1>
          <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '6px' }}>Sign up for your SecureVault account</p>
        </div>

        <form onSubmit={handleSignup}>
          {/* Email */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Email Address</label>
            <input
              type="email" placeholder="your.email@company.com"
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'} placeholder="Create a password"
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 40px 12px 14px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
              />
              <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '1rem', color: '#aaa' }}>
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'} placeholder="Confirm your password"
                onChange={e => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 40px 12px 14px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
              />
              <span onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '1rem', color: '#aaa' }}>
                {showConfirm ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          {error && <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}

          {/* Sign Up Button */}
          <button type="submit" style={{ width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', marginBottom: '1.5rem' }}>
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#eee' }} />
          <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Or continue with</span>
          <div style={{ flex: 1, height: '1px', background: '#eee' }} />
        </div>

        {/* Social Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button style={{ flex: 1, padding: '11px', border: '1px solid #e0e0e0', borderRadius: '8px', background: '#fff', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
            G Google
          </button>
          <button style={{ flex: 1, padding: '11px', border: '1px solid #e0e0e0', borderRadius: '8px', background: '#fff', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
            ⊞ Microsoft
          </button>
        </div>

        {/* Login link */}
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem' }}>
          Already have an account? <span onClick={() => navigate('/login')} style={{ fontWeight: 700, cursor: 'pointer', color: '#1a1a1a' }}>Sign in</span>
        </p>

        {/* Secure connection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f9f9f9', borderRadius: '10px', padding: '12px 14px', border: '1px solid #eee' }}>
          <span></span>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Secure Connection</div>
            <div style={{ fontSize: '0.78rem', color: '#888' }}>Your connection is encrypted with 256-bit SSL</div>
          </div>
        </div>

      </div>
    </div>
  )
}