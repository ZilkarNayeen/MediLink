import { useState } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../config.js'

function LoginPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Login failed')
      }

      // Store token for later authenticated requests
      if (data.token) {
        window.localStorage.setItem('medilink_token', data.token)
      }

      setSuccess('Logged in successfully.')
      // TODO: navigate to dashboard when it exists
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1 className="auth-title">MediLink</h1>
        <p className="auth-subtitle">Sign in to continue to your account</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}
        <div className="auth-field">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="auth-button" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="auth-footer-text">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="auth-link">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default LoginPage

