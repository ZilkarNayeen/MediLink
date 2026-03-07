import { useState } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../config.js'

function SignupPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      }

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Signup failed')
      }

      if (data.token) {
        window.localStorage.setItem('medilink_token', data.token)
      }

      setSuccess('Account created successfully. You can now sign in.')
      // Optionally reset form
      // setForm({ fullName: '', email: '', password: '', confirmPassword: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">
          Join MediLink to manage appointments and medical records
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}
        <div className="auth-field">
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            placeholder="Your full name"
            value={form.fullName}
            onChange={handleChange}
          />
        </div>

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
            autoComplete="new-password"
            required
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="auth-button" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create account'}
        </button>
      </form>

      <p className="auth-footer-text">
        Already have an account?{' '}
        <Link to="/login" className="auth-link">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default SignupPage

