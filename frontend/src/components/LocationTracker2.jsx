import React, { useState, useEffect } from 'react';
import { calculateDistance } from '../utils/distanceCalculator';

const LocationTracker = ({ collegeLocation, onLocationVerified }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isWithinRange, setIsWithinRange] = useState(false);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });

          // Calculate distance and check range
          const { distanceInMeters, isWithinRange } = calculateDistance(
            latitude, 
            longitude, 
            collegeLocation.latitude, 
            collegeLocation.longitude
          );

          console.log(`Current Location: (${latitude}, ${longitude})`);
          console.log(`College Location: (${collegeLocation.latitude}, ${collegeLocation.longitude})`);
          console.log(`Distance from College: ${distanceInMeters.toFixed(2)} meters`);
          console.log(`Within 500m Range: ${isWithinRange}`);

          setIsWithinRange(isWithinRange);
          onLocationVerified(isWithinRange, { latitude, longitude });
        },
        (error) => {
          console.error("Geolocation Error:", error.message);
          switch(error.code) {
            case error.PERMISSION_DENIED:
              alert("Please enable location permissions to mark attendance.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              alert("Location request timed out.");
              break;
            default:
              alert("An unknown error occurred while retrieving location.");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      alert("Your browser does not support location tracking.");
    }
  }, [collegeLocation]);

  return (
    <div>
      {currentLocation && (
        <div>
          <p>Current Location: {currentLocation.latitude}, {currentLocation.longitude}</p>
          <p>Within College Range: {isWithinRange ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default LocationTracker;
