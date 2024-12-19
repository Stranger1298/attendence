import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Statistics = () => {
  const [attendanceData, setAttendanceData] = useState({
    presentDays: 0,
    absentDays: 0,
    totalLeaves: 15, // Default value
    remainingLeaves: 0,
    totalWorkingDays: 250, // Fixed total working days
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};

  useEffect(() => {
    if (!id) {
      console.error('Teacher ID is missing.');
      navigate('/error', { state: { message: 'Teacher ID is missing.' } });
      return;
    }

    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/attendance/${id}`);
        const { presentDays, absentDays, totalLeaves, remainingLeaves } = response.data;

        setAttendanceData({
          presentDays,
          absentDays,
          totalLeaves,
          remainingLeaves,
          totalWorkingDays: 250, // Fixed value
        });
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    fetchAttendanceData();
  }, [id, navigate]);

  const chartData = {
    labels: ['Present Days', 'Absent Days', 'Remaining Leaves'],
    datasets: [
      {
        data: [attendanceData.presentDays, attendanceData.absentDays, attendanceData.remainingLeaves],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Attendance Statistics
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Overview
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  Total Working Days: {attendanceData.totalWorkingDays}
                </Typography>
                <Typography variant="body1">
                  Total Leaves Allowed: {attendanceData.totalLeaves}
                </Typography>
                <Typography variant="body1">
                  Present Days: {attendanceData.presentDays}
                </Typography>
                <Typography variant="body1">
                  Absent Days: {attendanceData.absentDays}
                </Typography>
                <Typography variant="body1">
                  Remaining Leaves: {attendanceData.remainingLeaves}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom align="center">
                Attendance Distribution
              </Typography>
              <Box sx={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
                <Pie data={chartData} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Statistics;
