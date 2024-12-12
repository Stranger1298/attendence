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
    <div style={{ padding: '20px', backgroundColor: '#e3f2fd' }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: '20px' }}>Teacher Schedule (ID: {id})</h2>
      <TableContainer component={Paper} style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', borderRadius: '12px' }}>
        <Table sx={{ minWidth: 650 }} aria-label="teacher schedule table">
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', borderRadius: '8px 0 0 8px' }}>Day</TableCell>
              <TableCell align="center">8:30 AM - 9:30 AM</TableCell>
              <TableCell align="center">9:30 AM - 10:30 AM</TableCell>
              <TableCell align="center">10:30 AM - 10:50 AM (Short Break)</TableCell>
              <TableCell align="center">10:50 AM - 11:50 AM</TableCell>
              <TableCell align="center">11:50 AM - 12:50 PM</TableCell>
              <TableCell align="center">12:50 PM - 1:45 PM (Lunch Break)</TableCell>
              <TableCell align="center">1:45 PM - 2:40 PM</TableCell>
              <TableCell align="center">2:40 PM - 3:35 PM</TableCell>
              <TableCell align="center">3:35 PM - 4:30 PM</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedule.Schedule.map((daySchedule, dayIndex) => (
              <TableRow key={dayIndex} style={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' }, '&:hover': { backgroundColor: '#e1f5fe' } }}>
                <TableCell align="center" style={{ fontWeight: 'bold' }}>{daySchedule.Day}</TableCell>
                {daySchedule.Periods.map((subject, periodIndex) => (
                  <TableCell key={periodIndex} align="center" style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px' }}>{subject || 'N/A'}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Schedule;