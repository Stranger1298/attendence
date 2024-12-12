import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Schedule() {
  const location = useLocation();
  const { id } = location.state || {};
  const navigate = useNavigate();
  const ii = 1;
  
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('FRONTEND: Received Teacher ID:', id);
  console.log('FRONTEND: Location State:', location.state);

  useEffect(() => {
    const fetchTeacherSchedule = async () => {
      try {
        // Reset state before fetching
        setLoading(true);
        setError(null);

        console.log('FRONTEND: Attempting to fetch schedule for ID:', id);

        // Make API request using the ID from location state
        const response = await axios.get(`http://localhost:5000/api/teacher-schedule/${id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('FRONTEND: Fetched schedule:', response.data);
        
        // Update schedule state with fetched data
        setSchedule(response.data);
        setLoading(false);
      } catch (err) {
        console.error('FRONTEND: Full error object:', err);
        console.error('FRONTEND: Error response:', err.response);
        console.error('FRONTEND: Error message:', err.message);
        
        setError({
          message: err.response?.data?.message || 'Failed to fetch schedule',
          status: err.response?.status,
          fullError: err
        });
        setLoading(false);
      }
    };

    // Only fetch if id exists
    if (id) {
      fetchTeacherSchedule();
    } else {
      console.warn('FRONTEND: No ID provided');
      setError({ message: 'No teacher ID provided' });
      setLoading(false);
    }
  }, [id]);

  // Error rendering
  if (error) {
    return (
      <div>
        <h2>Error Occurred</h2>
        <p>Message: {error.message}</p>
        {error.status && <p>Status: {error.status}</p>}
        <pre>{JSON.stringify(error.fullError, null, 2)}</pre>
      </div>
    );
  }

  // Render loading state
  if (loading) {
    return <div>Loading schedule...</div>;
  }

  // Additional safety check
  if (!schedule) {
    return <div>No schedule data available</div>;
  }

  // Render schedule
  return (
    <div>
      <h2>Teacher Schedule (ID: {id})</h2>
      {!schedule.Periods || schedule.Periods.length === 0 ? (
        <p>No periods found</p>
      ) : (
        <div>
          <h3>Periods: {schedule.Periods.join(', ')}</h3>
          <h3>Timings:</h3>
          <ul>
            {schedule.Timings && schedule.Timings.map((timing, index) => (
              <li key={index}>{timing}</li>
            ))}
          </ul>
          
          <h3>Daily Schedule:</h3>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                {schedule.Periods.map((period, index) => (
                  <th key={index}>Period {period}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.Schedule && schedule.Schedule.map((daySchedule, dayIndex) => (
                <tr key={dayIndex}>
                  <td>{daySchedule.Day}</td>
                  {daySchedule.Periods.map((subject, periodIndex) => (
                    <td key={periodIndex}>{subject || 'N/A'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Schedule;
