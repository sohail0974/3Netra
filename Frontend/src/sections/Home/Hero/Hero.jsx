import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';
import { Link } from 'react-router-dom';
import Reportform from '../../submitReport/Reportform/Reportform';
const Hero = () => {
  
  const phrases = [
    "A citizen-powered reporting platform to build safer neighborhoods.",
    "Pinpoint exact locations and upload evidence in seconds.",
    "Instantly alert authorities and keep your community informed."
  ];
  const typingSpeed = 80;
  const deletingSpeed = 40;
  const pauseDuration = 1500;

 
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const lastUpdateTime = useRef(0);
  const pauseUntil = useRef(0);
  const animationFrameId = useRef(0);

  useEffect(() => {
    const animate = (timestamp) => {
     
      animationFrameId.current = requestAnimationFrame(animate);

  
      if (timestamp < pauseUntil.current) {
        return;
      }

      if (!lastUpdateTime.current) {
        lastUpdateTime.current = timestamp;
      }
      
      const deltaTime = timestamp - lastUpdateTime.current;
      const currentPhrase = phrases[phraseIndex];
      const speed = isDeleting ? deletingSpeed : typingSpeed;

      if (deltaTime > speed) {
        
        if (isDeleting) {
          
          if (displayedText.length > 0) {
            setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
          } else {
           
            setIsDeleting(false);
            setPhraseIndex((prev) => (prev + 1) % phrases.length);
          }
        } else {
        
          if (displayedText.length < currentPhrase.length) {
            setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
          } else {
           
            pauseUntil.current = timestamp + pauseDuration;
            setIsDeleting(true);
          }
        }
        lastUpdateTime.current = timestamp;
      }
    };
    
    
    animationFrameId.current = requestAnimationFrame(animate);

   
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };

  }, [displayedText, isDeleting, phraseIndex, phrases, pauseDuration]);

  return (
    <div className='Hero'>
      <div className='hero-content'>
        <h1>
          {displayedText}
          <span className="typing-cursor">|</span>
        </h1>
        <p>
             This platform facilitates the secure and anonymous reporting of illegal drug activity. Submitting evidence and specific locations empowers authorities to address safety concerns effectively, allowing for community-driven intervention without compromising individual privacy.
        </p>
        <div className='hero-buttons'>
          <Link to='/submit_report'><button className='hero-btn btn-primary' >Submit Report</button></Link>
          <Link to='/map-overview'><button className='hero-btn btn-secondary'>View Map</button></Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;