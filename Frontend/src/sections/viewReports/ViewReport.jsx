import React, { useEffect, useState } from 'react';
import './ViewReports.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  
  const [viewMode, setViewMode] = useState('list'); 

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/reports');
        const json = await response.json();
        if (response.ok) {
          setReports(json);
        }
      } catch (error) {
        console.error("error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // --- Filter & Sort Logic ---
  const filteredAndSortedReports = [...reports]
    .filter((report) => {
      // FIX 1: Search by 'description' because 'locationName' does not exist in DB
      const address = report.address || "";
      const text = report.description || "";
      return text.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      // FIX 2: Use 'dateandtime' (from DB schema) instead of 'dateTime'
      const dateA = new Date(a.dateandtime);
      const dateB = new Date(b.dateandtime);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const formatDate = (isoString) => {
    if (!isoString) return "Date not available";
    const date = new Date(isoString);
    if (isNaN(date)) return isoString; 
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleCardClick = (report) => {
    setSelectedReport(report);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedReport(null);
    document.body.style.overflow = 'auto';
  };

  // Helper function to create a title since we don't have location names
  const getTitle = (report) => {
    if (report.location && report.location.lat) {
      return `Incident at ${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`;
    }
    return "Incident Report";
  };

  return (
    <div className="view-reports-container">
      
      <div className="reports-header">
        <h2 className="page-title">Recent Reports</h2>
        
        <div className="controls-wrapper">
          <input 
            type="text" 
            placeholder="Search description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />

          <div className="sort-wrapper">
            <select 
              id="sort" 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="sort-dropdown"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              ≣ List
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              ⊞ Grid
            </button>
          </div>
        </div>
      </div>

      {/* --- ADDED LOADING INDICATOR --- */}
      {loading ? (
         <div className="loading-container" style={{textAlign:'center', marginTop:'50px', fontSize:'1.2rem', color:'#d90429'}}>
            Loading Reports...
         </div>
      ) : (
        <div className={`reports-container ${viewMode === 'grid' ? 'grid-layout' : 'list-layout'}`}>
          {filteredAndSortedReports.length > 0 ? (
            filteredAndSortedReports.map((report) => (
              <div 
                key={report._id} 
                className="report-card"
                onClick={() => handleCardClick(report)}
              >
                <div className="card-content">
                  {/* FIX 3: Use helper function for Title */}
                  <h3 className="card-location">{report.address ? report.address : "Unknown Location"}</h3>
                  {/* FIX 4: Use 'dateandtime' */}
                  <p className="card-date">{formatDate(report.dateandtime)}</p>
                  <span className="click-hint">Click to view details</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No reports found matching "{searchQuery}"</p>
          )}
        </div>
      )}

      {selectedReport && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>&times;</button>
            {/* FIX 5: Update Modal Title */}
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
                <div className="mini-map-container">
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
    </div>
  );
};

export default ViewReports;