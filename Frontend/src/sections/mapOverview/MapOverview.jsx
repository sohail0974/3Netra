import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapOverview.css';

// Fix for default marker icons (prevents missing pin images)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

const MapOverview = () => {
  
  const defaultCenter = [17.3850, 78.4867];

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        // This should match the route you use for ViewReports
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reports`);
        const json = await response.json();
        
        if (response.ok) {
          setReports(json); 
        }
      } catch (error) {
        console.error("Error fetching map reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllReports();
  }, []);

  return (
    <div className="page-container map-page-bg">
      <div className="map-header">
        <h1>Incident Map Overview</h1>
        <p>Viewing all anonymously reported incidents across the city.</p>
      </div>
      
      {/* The wrapper handles the sizing and theme styling */}
      <div className="map-wrapper" style={{ position: 'relative' }}>
        
        {/* Optional: Show a small loading text over the map while fetching */}
        {loading && (
          <div style={{ position: 'absolute', zIndex: 1000, top: '10px', right: '20px', backgroundColor: 'white', padding: '5px 15px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', color: '#cc0000', fontWeight: 'bold' }}>
            Loading live data...
          </div>
        )}

        <MapContainer 
          center={defaultCenter} 
          zoom={12} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* 3. Dynamically map over the fetched database reports */}
          {reports.map((report) => {
            // Safeguard: Ensure the report actually has valid lat/lng before rendering a pin
            if (!report.location || !report.location.lat || !report.location.lng) {
              return null; 
            }

            return (
              <Marker 
                key={report._id} 
                position={[report.location.lat, report.location.lng]}
              >
                <Popup className="custom-popup">
                  <strong>Address:</strong> {report.address || "Location unavailable"} <br />
                  <strong>Status:</strong> <span className={`status ${report.status || 'pending'}`}>{report.status || 'Pending'}</span> <br /><br />
                  <strong>Details:</strong> {report.description} <br />
                  <small><strong>Reported:</strong> {new Date(report.dateandtime).toLocaleString()}</small>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapOverview;