import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function Register() {
  const location = useLocation();
  const { id } = location.state || {};

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`http://localhost:5000/api/attendance/${id}`);
        const { attendanceDetails } = response.data;

        setAttendanceData(attendanceDetails || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError('Failed to fetch attendance data.');
        setLoading(false);
      }
    };

    if (id) {
      fetchAttendanceData();
    } else {
      setError('No teacher ID provided.');
      setLoading(false);
    }
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (loading) return <div>Loading attendance data...</div>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#e3f2fd' }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: '20px' }}>
        Attendance Register
      </h2>
      <TableContainer
        component={Paper}
        style={{
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="attendance table">
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                style={{
                  fontWeight: 'bold',
                  backgroundColor: '#1976d2',
                  color: 'white',
                }}
              >
                Date
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: 'bold',
                  backgroundColor: '#1976d2',
                  color: 'white',
                }}
              >
                Time_in
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: 'bold',
                  backgroundColor: '#1976d2',
                  color: 'white',
                }}
              >
                Time_out
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.length > 0 ? (
              attendanceData.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:hover': { backgroundColor: '#e1f5fe' } }}
                >
                  <TableCell align="center">{row.Date || 'N/A'}</TableCell>
                  <TableCell align="center">{row.Time_In || 'N/A'}</TableCell>
                  <TableCell align="center">{row.Time_Out || 'N/A'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No attendance data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Register;
