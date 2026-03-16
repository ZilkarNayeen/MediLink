import { useState } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../config.js'
import './BookAppointment.css'
import '../pages/Dashboard.css'          /* reuse navbar styles */

function BookAppointment() {
  const [form, setForm] = useState({
    patientName: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    email: '',
    requestFor: '',
    doctorOrService: '',
    appointmentDate: '',
    appointmentTime: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const token = window.localStorage.getItem('medilink_token')

      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to submit appointment')
      }

      setSuccess('Appointment request submitted successfully!')
      setForm({
        patientName: '',
        dateOfBirth: '',
        gender: '',
        contactNumber: '',
        email: '',
        requestFor: '',
        doctorOrService: '',
        appointmentDate: '',
        appointmentTime: '',
      })
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="appointment-page">
      {/* ── Navbar (shared style) ── */}
      <nav className="dashboard-navbar">
        <span className="navbar-logo">MediLink</span>
        <ul className="navbar-links">
          <li><Link to="/dashboard">Home</Link></li>
          <li><Link to="/services">Our Services</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/locations">Locations</Link></li>
        </ul>
      </nav>

      {/* ── Form ── */}
      <div className="appointment-wrapper">
        <div className="appointment-card">
          <h1>Appointment Request Form</h1>

          <form className="appointment-form" onSubmit={handleSubmit}>
            {success && <p className="appointment-success">{success}</p>}
            {error && <p className="appointment-error">{error}</p>}

            {/* Row 1 */}
            <div className="form-group">
              <label htmlFor="patientName">Patient Name</label>
              <input
                id="patientName"
                name="patientName"
                type="text"
                placeholder="Full name"
                required
                value={form.patientName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                value={form.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            {/* Row 2 */}
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                required
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number</label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                placeholder="e.g. 01XXXXXXXXX"
                required
                value={form.contactNumber}
                onChange={handleChange}
              />
            </div>

            {/* Row 3 */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="requestFor">Request For</label>
              <input
                id="requestFor"
                name="requestFor"
                type="text"
                placeholder="e.g. Consultation, Follow-up"
                value={form.requestFor}
                onChange={handleChange}
              />
            </div>

            {/* Row 4 */}
            <div className="form-group">
              <label htmlFor="doctorOrService">Doctor or Service</label>
              <input
                id="doctorOrService"
                name="doctorOrService"
                type="text"
                placeholder="e.g. Dr. Smith / Cardiology"
                value={form.doctorOrService}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="appointmentDate">Appointment Date</label>
              <input
                id="appointmentDate"
                name="appointmentDate"
                type="date"
                required
                value={form.appointmentDate}
                onChange={handleChange}
              />
            </div>

            {/* Row 5 – single column */}
            <div className="form-group">
              <label htmlFor="appointmentTime">Appointment Time</label>
              <input
                id="appointmentTime"
                name="appointmentTime"
                type="time"
                required
                value={form.appointmentTime}
                onChange={handleChange}
              />
            </div>

            {/* Submit */}
            <div className="appointment-submit-row">
              <button
                type="submit"
                className="appointment-submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookAppointment
