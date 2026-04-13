import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ReportsPage.css';
import illustrationImg from '../assets/reports_bg.jpg';

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reports');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        setReports(data);

        // Safety check: only select if data actually exists
        if (data && data.length > 0) {
          setSelectedReport(data[0]);
        }
      } catch (err) {
        console.error("Database connection error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);
  console.log("State - showImage:", showImage);
  console.log("State - selectedReport:", selectedReport?.testName);

  return (
    <div className="reports-page" style={{ backgroundImage: `url(${illustrationImg})` }}>
      <nav className="reports-navbar">
        <div className="navbar-logo">MediLink</div>
        <div className="navbar-links">
          <Link to="/dashboard">Home</Link>
          <Link to="/services">Our Services</Link>
          <Link to="/about">About Us</Link>
          <Link to="/locations">Locations</Link>
        </div>
      </nav>

      <div className="reports-main-container">
        <div className="reports-oval-frame">
          <div className="reports-bottom-overlay"></div>

          <div className="reports-content-grid">
            <div className="side-section left-title">
              <h3 className="section-title">Medical Timeline</h3>
            </div>

            <div className="center-section">
              <div className="report-selector-container">
                <p className="selector-label">Select Report to view</p>

                <div className="reports-list">
                  {loading ? (
                    <div className="report-item">Loading tests...</div>
                  ) : reports && reports.length > 0 ? (
                    reports.map((report, index) => (
                      <div
                        // FIXED: Using _id or index as fallback to prevent rendering crash
                        key={report._id || report.id || index}
                        className={`report-item ${(selectedReport?._id === report._id || selectedReport?.id === report.id)
                          ? 'active' : ''
                          }`}
                        onClick={() => setSelectedReport(report)}
                      >
                        {/* Safety: Use optional chaining to prevent crash if testName is missing */}
                        {report?.testName || "Unknown Test"}
                      </div>
                    ))
                  ) : (
                    <div className="report-item">No reports found</div>
                  )}
                </div>

                <button
                  className="view-report-submit-btn"
                  onClick={() => selectedReport && setShowImage(true)}
                  disabled={!selectedReport}
                  style={{
                    opacity: selectedReport ? 1 : 0.5,
                    cursor: selectedReport ? 'pointer' : 'not-allowed'
                  }}
                >
                  View Report
                </button>
              </div>
            </div>

            <div className="side-section right-title">
              <h3 className="section-title">Prescription</h3>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL SECTION */}
      {showImage && selectedReport && (
        <div className="image-modal-overlay" onClick={() => setShowImage(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{selectedReport?.testName}</span>
              <button className="close-image-btn" onClick={() => setShowImage(false)}>×</button>
            </div>
            <div className="image-scroll-wrapper">
              {/* Safety: Check if imageUrl exists before rendering img tag */}
              {selectedReport?.imageUrl ? (
                <img src={selectedReport.imageUrl} alt="Report Result" />
              ) : (
                <div style={{ padding: '20px', textAlign: 'center' }}>No image available for this report.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportsPage;