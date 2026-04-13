import { Link } from 'react-router-dom'

/**
 * Shared navigation bar used across patient-facing pages.
 * Pass `variant="admin"` or `variant="doctor"` for portal-specific navbars.
 */
function Navbar({ variant = 'patient' }) {
  if (variant === 'admin') {
    return (
      <nav className="admin-navbar">
        <span className="navbar-logo">MediLink Admin</span>
        <ul className="navbar-links">
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/">Logout</Link></li>
        </ul>
      </nav>
    )
  }

  if (variant === 'doctor') {
    return (
      <nav className="doctor-navbar">
        <span className="navbar-logo">MediLink Doctor</span>
        <ul className="navbar-links">
          <li><Link to="/doctor/dashboard">Dashboard</Link></li>
          <li><Link to="/doctor/">Logout</Link></li>
        </ul>
      </nav>
    )
  }

  // Default: patient navbar
  return (
    <nav className="dashboard-navbar">
      <span className="navbar-logo">MediLink</span>
      <ul className="navbar-links">
        <li><Link to="/dashboard">Home</Link></li>
        <li><Link to="/services">Our Services</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/locations">Locations</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar
