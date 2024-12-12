import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function Schedule() {
  const location = useLocation();
  const { id } = location.state || {};
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('FRONTEND: Received Teacher ID:', id);
  console.log('FRONTEND: Location State:', location.state);

  useEffect(() => {
    const fetchTeacherSchedule = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('FRONTEND: Attempting to fetch schedule for ID:', id);

        const response = await axios.get(`http://localhost:5000/api/teacher-schedule/${id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('FRONTEND: Fetched schedule:', response.data);
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

    if (id) {
      fetchTeacherSchedule();
    } else {
      console.warn('FRONTEND: No ID provided');
      setError({ message: 'No teacher ID provided' });
      setLoading(false);
    }
  }, [id]);

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

  if (loading) {
    return <div>Loading schedule...</div>;
  }

  if (!schedule) {
    return <div>No schedule data available</div>;
  }

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
