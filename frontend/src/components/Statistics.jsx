import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const Statistics = () => {
  const attendanceData = {
    present: 15,
    absent: 3,
    leaveLeft: 12,
    totalWorkingDays: 240, // Total working days in a year
    totalLeaves: 15 // Total leaves allowed
  };

  const chartData = {
    labels: ['Present Days', 'Absent Days', 'Leave Left'],
    datasets: [
      {
        data: [attendanceData.present, attendanceData.absent, attendanceData.leaveLeft],
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
                  Present Days: {attendanceData.present}
                </Typography>
                <Typography variant="body1">
                  Absent Days: {attendanceData.absent}
                </Typography>
                <Typography variant="body1">
                  Remaining Leaves: {attendanceData.leaveLeft}
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
