import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ReportsPage.css';
import illustrationImg from '../assets/reports_bg.jpg';

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [loading, setLoading] = useState(true);

  // Upload States
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [testName, setTestName] = useState("");

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports');
      setReports(res.data);
      if (res.data.length > 0) setSelectedReport(res.data[0]);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('reportImage', file);
    formData.append('testName', testName);

    try {
      await axios.post('http://localhost:5000/api/upload-report', formData);
      setShowUpload(false);
      setTestName("");
      fetchReports(); // Refresh list from DB
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div className="reports-page" style={{ backgroundImage: `url(${illustrationImg})` }}>
      <nav className="reports-navbar">
        <div className="navbar-logo">MediLink</div>
        <div className="navbar-links">
          <Link to="/dashboard">Home</Link>
        </div>
      </nav>

      <div className="reports-main-container">
        <div className="reports-oval-frame">
          <div className="reports-content-grid">
            <div className="side-section left-title"><h3 className="section-title">Timeline</h3></div>

            <div className="center-section">
              <div className="report-selector-container">
                <div className="reports-list">
                  {loading ? <div>Loading...</div> : reports.map((report) => (
                    <div 
                      key={report._id} 
                      className={`report-item ${selectedReport?._id === report._id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedReport(report);
                        setShowImage(true); // Open image when name is clicked
                      }}
                    >
                      {report.testName}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button className="view-report-submit-btn" style={{backgroundColor: '#28a745'}} onClick={() => setShowUpload(true)}>
                    + Add New Report
                  </button>
                </div>
              </div>
            </div>
            
            <div className="side-section right-title"><h3 className="section-title">Prescription</h3></div>
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}
      {showImage && selectedReport && (
        <div className="image-modal-overlay" onClick={() => setShowImage(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span>{selectedReport.testName}</span>
              <button className="close-image-btn" onClick={() => setShowImage(false)}>×</button>
            </div>
            <div className="image-scroll-wrapper">
              <img src={selectedReport.imageUrl} alt="Result" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUpload && (
        <div className="image-modal-overlay">
          <div className="image-modal-content" style={{ maxWidth: '400px' }}>
            <h3>Upload New Report</h3>
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px' }}>
              <input type="text" placeholder="Test Name" value={testName} onChange={(e) => setTestName(e.target.value)} required />
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
              <button type="submit" className="view-report-submit-btn">Save to DB</button>
              <button type="button" onClick={() => setShowUpload(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportsPage;