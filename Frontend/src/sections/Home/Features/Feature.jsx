import React from 'react';
import './Feature.css'; 
import anonymousIcon from '../../../assets/anonymous.png'; 
import mapIcon from '../../../assets/map.png';
import Authorities from '../../../assets/Authorities.png';

const Feature = () => {
  return (
    <div className="features-section-light">
      <h2 className="features-title-light">Key Features</h2>
      <div className="features-container-light">
        
        {/* Card 1: Anonymous Reporting */}
        <div className="feature-card-light">
          <img src={anonymousIcon} alt="Anonymous Reporting Icon" className="card-icon-light" />
          <h3 className="card-title-light">Anonymous Reporting</h3>
          <p className="card-description-light">
            Submit critical information about illegal drug activity without compromising your identity. Advanced security protocols ensure your privacy is paramount, empowering safe and fearless reporting.
          </p>
        </div>

        {/* Card 2: Real-time Map View */}
        <div className="feature-card-light">
          <img src={mapIcon} alt="Real-time Map View Icon" className="card-icon-light" />
          <h3 className="card-title-light">Real-time Map View</h3>
          <p className="card-description-light">
            Access an interactive map displaying live, verified reports of drug hotspots and incidents within your local area. Enhance your awareness and contribute to a safer environment.
          </p>
        </div>

        {/* Card 3: Direct Authority Liaison */}
        <div className="feature-card-light">
          <img src={Authorities} alt="Direct Authority Liaison Icon" className="card-icon-light" />
          <h3 className="card-title-light">Direct Authority Liaison</h3>
          <p className="card-description-light">
            Seamlessly connect vital intelligence to relevant law enforcement agencies. Reports are securely transmitted, providing officials with the precise data needed for swift and effective intervention.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Feature;