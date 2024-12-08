import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LocationTracker from './LocationTracker';

// College location coordinates (you should replace these with your actual college coordinates)
const COLLEGE_LOCATION = {
  latitude: 19.0760,
  longitude: 72.8777
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [isMarked, setIsMarked] = useState(false);
  const [canMarkAttendance, setCanMarkAttendance] = useState(false);

  const handleLocationVerified = (isWithinRange, location) => {
    console.log('Location verified:', { isWithinRange, location });
    setCanMarkAttendance(isWithinRange);
  };

  const markAttendance = () => {
    if (canMarkAttendance) {
      setIsMarked(true);
      // Here you would typically make an API call to record attendance
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Teacher Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Today's Attendance
                </Typography>
                <LocationTracker 
                  collegeLocation={COLLEGE_LOCATION}
                  onLocationVerified={handleLocationVerified}
                />
                {canMarkAttendance && !isMarked && (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={markAttendance}
                    startIcon={<HowToRegIcon />}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Mark Attendance
                  </Button>
                )}
                {isMarked && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Attendance marked successfully for today
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/statistics')}
                  startIcon={<AssessmentIcon />}
                  sx={{ width: '100%' }}
                >
                  View Attendance Statistics
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
