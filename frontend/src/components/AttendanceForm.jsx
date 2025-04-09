  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { useLocation } from 'react-router-dom';

  const AttendanceForm = () => {
    const [isLocationVerified, setIsLocationVerified] = useState(false);
    const [attendanceMarked, setAttendanceMarked] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [error, setError] = useState(null);
    const location = useLocation();
    const { id } = location.state || {};

    // Check if attendance is already marked for today
    useEffect(() => {
      const checkTodayAttendance = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/attendance/check/${id}`);
          if (response.data.isMarked) {
            setAttendanceMarked(true);
            setError("Attendance already marked for today");
          }
        } catch (err) {
          console.error("Error checking attendance:", err);
        }
      };

      if (id) {
        checkTodayAttendance();
      }
    }, [id]);

    const handleAttendanceSubmit = async () => {
      if (!isLocationVerified) {
        setError("You must be within 500 meters of the college to mark attendance!");
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/attendance/mark', {
          userId: id,
          timestamp: new Date().toISOString(),
          location: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude
          }
        });

        if (response.data.success) {
          setAttendanceMarked(true);
          setError(null);
          alert("Attendance marked successfully!");
        }
      } catch (error) {
        if (error.response?.status === 400) {
          setError(error.response.data.message);
        } else {
          setError("Failed to mark attendance. Please try again.");
        }
        console.error("Error marking attendance:", error);
      }
    };

    return (
      <div className="attendance-form">
        <h2>Mark Attendance</h2>
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </div>
        )}
        
        <LocationTracker
          collegeLocation={collegeLocation}
          onLocationVerified={handleLocationVerification}
        />

        <button 
          onClick={handleAttendanceSubmit}
          disabled={!isLocationVerified || attendanceMarked}
          style={{
            backgroundColor: !isLocationVerified || attendanceMarked ? '#cccccc' : '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: !isLocationVerified || attendanceMarked ? 'not-allowed' : 'pointer'
          }}
        >
          {attendanceMarked ? 'Attendance Marked for Today' : 'Mark Attendance'}
        </button>

        {attendanceMarked && (
          <div className="success-message" style={{ color: 'green', marginTop: '10px' }}>
            Your attendance has been marked for today
          </div>
        )}
      </div>
    );
  };

  export default AttendanceForm;