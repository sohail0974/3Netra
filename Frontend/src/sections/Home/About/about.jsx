import React from 'react'
import './about.css';
import play_icon from '../../../assets/play_button.png';
import video_icon from '../../../assets/video_bg.png';

const About = () => {
  return (
    <div className="About_bg">
      <h2 className='About_head'>About Us</h2>
    <div className="about">
        <div className="left-about">
            <img src={video_icon} alt="temporary bg" className='temp-bg' />
           <img src={play_icon} alt="Play icon" className='play-icon' /> 
        </div>    
        <div className="right-about">
            
            <h3>Empowering Communities, Ensuring Safety.</h3>
            <p>
              Citizen safety is the highest priority. 3Netra serves the vigilant individual—the concerned resident, the watchful student, the everyday person who sees what is wrong but needs a secure and trustworthy way to act. Too often, the fear of reprisal or complex procedures creates a wall of silence around illicit drug activities that harm our neighborhoods.This platform was built to dismantle that wall. By offering a direct and protected channel, we empower users to anonymously report illegal drug activity, providing law enforcement with the critical, location-specific intelligence needed for effective intervention.
            </p>
           
        </div>
    </div>
    </div>
  )
}

export default About;
