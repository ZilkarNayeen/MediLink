import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../config.js'
import './AdminPages.css'
import './Dashboard.css'

function DoctorDashboard() {
  const doctorName = window.localStorage.getItem('medilink_doctor_name') || 'Doctor'
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = window.localStorage.getItem('medilink_doctor_token')
        const response = await fetch(`${API_BASE_URL}/appointments/doctor/all`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.message || 'Failed to load appointments')
        }

        setAppointments(data.appointments)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  return (
    <div className="doctor-dashboard-page">
      {/* ── Navbar ── */}
      <nav className="doctor-navbar">
        <span className="navbar-logo">MediLink Doctor</span>
        <ul className="navbar-links">
          <li><Link to="/doctor/dashboard">Dashboard</Link></li>
          <li><Link to="/doctor/">Logout</Link></li>
        </ul>
      </nav>

      {/* ── Content ── */}
      <div className="doctor-content" style={{ justifyContent: 'flex-start' }}>
        <h1 className="doctor-welcome">Welcome, {doctorName}</h1>
        <p className="doctor-welcome-sub" style={{ marginBottom: '2rem' }}>
          Patient Appointments
        </p>

        {loading && <p style={{ color: '#047857' }}>Loading appointments...</p>}
        {error && <p className="doctor-signup-error" style={{ maxWidth: 600 }}>{error}</p>}

        {!loading && !error && appointments.length === 0 && (
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>No appointments yet.</p>
        )}

        {!loading && appointments.length > 0 && (
          <div className="appointments-table-wrapper">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Request For</th>
                  <th>Doctor / Service</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt, i) => (
                  <tr key={apt.id}>
                    <td>{i + 1}</td>
                    <td>{apt.patientName}</td>
                    <td>{apt.email}</td>
                    <td>{apt.contactNumber}</td>
                    <td>{apt.appointmentDate}</td>
                    <td>{apt.appointmentTime}</td>
                    <td>{apt.requestFor || '—'}</td>
                    <td>{apt.doctorOrService || '—'}</td>
                    <td>
                      <span className={`status-badge status-${apt.status}`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorDashboard
