import React, { useState, useEffect } from 'react';
import './MySubmissions.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleError } from '../../Toast'; 
import { useNavigate } from 'react-router-dom';
// 1. Import Leaflet for the modal map
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MySubmissions = () => {
  const userName = localStorage.getItem('loggedInUser') || "User";
  
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 2. Add the selected report state for the modal
  const [selectedReport, setSelectedReport] = useState(null);

const navigate = useNavigate();

useEffect(() => {
  const fetchMyReports = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleError("Please log in to view your submissions.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/my-reports`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token 
        }
      });

      // --- THE AUTO-LOGOUT FIX IS HERE ---
      if (response.status === 403) {
        // 1. Clear the dead token from storage
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('userEmail');
        
        // 2. Show a helpful message
        handleError("Your session has expired. Please log in again.");
        
        // 3. Kick them back to the login page
        navigate('/login'); 
        return; // Stop running the rest of the code
      }
      // -----------------------------------

      const result = await response.json();

      if (response.ok) {
        setMyReports(result.data || result); 
      } else {
        handleError(result.message || "Failed to fetch your reports.");
      }
    } catch (error) {
      console.error(error);
      handleError("An error occurred while communicating with the server.");
    } finally {
      setLoading(false);
    }
  };

  fetchMyReports();
}, [navigate]); // Add navigate to dependency array

  // 3. Modal open/close handlers
  const handleViewDetails = (report) => {
    setSelectedReport(report);
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  };

  const closeModal = () => {
    setSelectedReport(null);
    document.body.style.overflow = 'auto'; // Restore background scrolling
  };

  // Helper for formatting the date in the modal
  const formatDate = (isoString) => {
    if (!isoString) return "Date not available";
    const date = new Date(isoString);
    if (isNaN(date)) return isoString; 
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="submissions-page-bg">
      <div className="submissions-container">
        <div className="submissions-header">
          <h1>{userName}'s Submissions</h1>
          <p>Track the status of the reports you have submitted.</p>
        </div>

        <div className="reports-list">
          {loading ? (
            <p className="no-reports">Loading your submissions...</p>
          ) : myReports.length === 0 ? (
            <p className="no-reports">You haven't submitted any reports yet.</p>
          ) : (
            myReports.map((report) => (
              <div className="report-card" key={report._id}>
                <h3 className="report-address">{report.address}</h3>
                <p className="report-date">
                  {formatDate(report.dateandtime)}
                </p>
                <p className="report-description">{report.description}</p>
                
                <div className="report-footer">
                  {/* 4. Pass the whole report object to the handler */}
                  <span 
                    className="details-btn" 
                    onClick={() => handleViewDetails(report)}
                  >
                    CLICK TO VIEW DETAILS
                  </span>
                  <span className={`status-badge ${report.status || 'pending'}`}>
                    {report.status || 'Pending'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 5. Paste your exact Modal JSX here */}
      {selectedReport && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>&times;</button>
            <h2 className="modal-title">{selectedReport.address ? selectedReport.address : "Unknown Location"}</h2>
            <p className="modal-date">{formatDate(selectedReport.dateandtime)}</p>
            <div className="modal-body">
              <div className="modal-text-section">
                <h4>Description:</h4>
                <p>{selectedReport.description}</p>
                {selectedReport.evidence && (
                  <div className="evidence-section">
                    <h4>Evidence:</h4>
                    <img src={selectedReport.evidence} alt="Evidence" className="evidence-img" />
                  </div>
                )}
              </div>
              <div className="modal-map-section">
                <h4>Incident Location:</h4>
                <div className="mini-map-container" style={{ height: '300px', width: '100%', marginTop: '10px' }}>
                  <MapContainer 
                    center={selectedReport.location} 
                    zoom={15} 
                    style={{ height: '100%', width: '100%' }}
                    dragging={true}
                    scrollWheelZoom={true}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={selectedReport.location} />
                  </MapContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default MySubmissions;