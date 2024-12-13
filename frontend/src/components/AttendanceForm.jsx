import React, { useState } from 'react';
import LocationTracker from './LocationTracker2';
import axios from 'axios';

const AttendanceForm = () => {
  const [isLocationVerified, setIsLocationVerified] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const { id } = location.state || {};
  const Id = id;
  // College location for Sreenidhi Institute of Science and Technology
  const collegeLocation = {
    latitude: 13.068185,
    longitude: 77.50754474895987
  };

  const handleLocationVerification = (verified, location) => {
    setIsLocationVerified(verified);
    setCurrentLocation(location);
  };

  const handleAttendanceSubmit = async () => {
    if (!isLocationVerified) {
      alert("You must be within 500 meters of the college to mark attendance!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/attendance/mark', {
        userId: Id                                    ,
        timestamp: new Date().toISOString(),
        location: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
        }
      });

      if (response.status === 200) {
        setAttendanceMarked(true);
        alert("Attendance marked successfully within college premises!");
      }
    } catch (error) {
      console.error("Error marking attendance", error);
      alert("Failed to mark attendance. Please try again.");
    }
  };

  return (
    <div>
      <h2>Attendance Marking</h2>
      <LocationTracker 
        collegeLocation={collegeLocation}
        onLocationVerified={handleLocationVerification}
      />
      
      <button 
        onClick={handleAttendanceSubmit}
        disabled={!isLocationVerified}
      >
        Mark Attendance
      </button>

      {attendanceMarked && (
        <p>Attendance marked for today!</p>
      )}
    </div>
  );
};

export default AttendanceForm;
