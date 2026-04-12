import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PiLeafFill } from 'react-icons/pi'
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { authAPI } from '../services/api'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin() {
    setError('')
    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    setLoading(true)
    try {
      const data = await authAPI.login(email, password)

      if (data.user.role !== 'admin') {
        authAPI.logout()
        setError('Access denied — admin accounts only')
        return
      }

      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="login-page">

      {/* Left Panel */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-logo">
            <div className="login-logo-icon">
              <PiLeafFill size={22} color="white" />
            </div>
            <span className="login-logo-text">
              AgroFlow<span>+</span>
            </span>
          </div>
          <h1 className="login-left-title">
            Admin<br />Dashboard
          </h1>
          <p className="login-left-sub">
            Manage farmers, fields, alerts and<br />
            platform content from one place.
          </p>
          <div className="login-left-stats">
            <div className="login-stat">
              <p className="login-stat-val">248</p>
              <p className="login-stat-label">Farmers</p>
            </div>
            <div className="login-stat">
              <p className="login-stat-val">430</p>
              <p className="login-stat-label">Fields</p>
            </div>
            <div className="login-stat">
              <p className="login-stat-val">12</p>
              <p className="login-stat-label">Locations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="login-form-wrap">

          <div className="login-form-header">
            <h2 className="login-form-title">Welcome Back</h2>
            <p className="login-form-sub">Sign in to your admin account</p>
          </div>

          <div className="login-form">

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="login-input-wrap">
                <MdEmail size={17} className="login-input-icon" />
                <input
                  className="login-input"
                  type="email"
                  placeholder="admin@agroflow.io"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="login-input-wrap">
                <MdLock size={17} className="login-input-icon" />
                <input
                  className="login-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="login-input-toggle"
                  onClick={() => setShowPass(p => !p)}
                >
                  {showPass
                    ? <MdVisibilityOff size={17} />
                    : <MdVisibility size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error">{error}</div>
            )}

            <button
              className="login-btn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </div>
        </div>
      </div>

    </div>
  )
}