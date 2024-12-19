import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Avatar,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from '@mui/material';
import {
  AssessmentOutlined as AssessmentIcon,
  HowToRegOutlined as HowToRegIcon,
  AccessTimeOutlined as AccessTimeIcon,
  CalendarTodayOutlined as CalendarIcon,
  ExitToAppOutlined as LogoutIcon,
  LocationOnOutlined as LocationIcon,
  CheckCircleOutlined as CheckCircleIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Todo from './Todo'; // Import the Todo component

const COLLEGE_LOCATION = {
  latitude: 13.068185,
  longitude: 77.50754474895987,
  radius: 500 // meters
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, id } = location.state || {};
  const teacherId = location.state?.teacherId;

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLocationVerified, setIsLocationVerified] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isWithinRange, setIsWithinRange] = useState(false);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleLocationVerification = (verified, location) => {
    setIsLocationVerified(verified);
    setCurrentLocation(location);
    setIsWithinRange(verified);
  };

  const handleAttendanceSubmit = async () => {
    if (!isLocationVerified) {
      setAttendanceStatus('location-error');
      return;
    }

    setIsMarkingAttendance(true);
    setAttendanceStatus(null);

    try {
      const response = await axios.post('http://localhost:5000/api/attendance/mark', {
        userId: id,
        timestamp: new Date().toISOString(),
        location: currentLocation
      });

      if (response.status === 200) {
        setAttendanceMarked(true);
        setAttendanceStatus('success');
        setShowSuccessDialog(true);
        setTimeout(() => {
          setShowSuccessDialog(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error marking attendance", error);
      setAttendanceStatus('error');
    } finally {
      setIsMarkingAttendance(false);
    }
  };
   

  const getLocation = () => {
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // Calculate distance from college
        const distance = calculateDistance(
          userLat,
          userLng,
          COLLEGE_LOCATION.latitude,
          COLLEGE_LOCATION.longitude
        );

        // Check if within range (500 meters)
        const withinRange = distance <= COLLEGE_LOCATION.radius;

        handleLocationVerification(withinRange, {
          latitude: userLat,
          longitude: userLng
        });
      },
      (error) => {
        setLocationError(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        {/* Header Section */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
            color: 'white',
            borderRadius: 2
          }}
        >
          <Grid container alignItems="center" spacing={3}>
            <Grid item>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'white',
                  color: '#1976d2'
                }}
              >
                {name ? name.charAt(0) : 'T'}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" sx={{ fontWeight: 500 }}>
                {getGreeting()}, {name || 'Professor'}
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                {currentTime.toLocaleTimeString()}
                <CalendarIcon sx={{ fontSize: 16, ml: 2, mr: 1, verticalAlign: 'text-bottom' }} />
                {currentTime.toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton
                color="inherit"
                onClick={() => navigate('/')}
                sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
              >
                <LogoutIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={4}>
          {/* Two cards in a row */}
          <Grid container item spacing={4}>
            {/* Location Verification Card */}
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  background: '#f5f5f5',
                  borderRadius: 2,
                  height: '100%' // Make cards same height
                }}
              >
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Location Verification
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={getLocation}
                    startIcon={<LocationIcon />}
                    sx={{ mb: 2 }}
                  >
                    Verify Location
                  </Button>

                  {locationError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {locationError}
                    </Alert>
                  )}

                  {currentLocation && (
                    <Alert 
                      severity={isWithinRange ? "success" : "error"}
                      sx={{ mb: 2 }}
                    >
                      {isWithinRange 
                        ? "You are within the college premises"
                        : "You must be within 500 meters of the college to mark attendance"
                      }
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Mark Attendance Card */}
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease-in-out',
                  height: '100%', // Make cards same height
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  py: 3 
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 3, 
                      color: '#1b5e20',
                      fontWeight: 600 
                    }}
                  >
                    Ready to Mark Your Attendance?
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleAttendanceSubmit}
                    disabled={!isLocationVerified || isMarkingAttendance || attendanceMarked}
                    startIcon={
                      isMarkingAttendance ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <HowToRegIcon sx={{ fontSize: 24 }} />
                      )
                    }
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                      boxShadow: '0 4px 15px 0 rgba(46,125,50,0.3)',
                      maxWidth: '400px',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                        boxShadow: '0 6px 20px 0 rgba(46,125,50,0.4)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {isMarkingAttendance ? 'Marking Attendance...' : 'Mark Attendance'}
                  </Button>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 2, 
                      color: '#2e7d32',
                      opacity: 0.8,
                      textAlign: 'center' 
                    }}
                  >
                    {!isLocationVerified 
                      ? 'Please verify your location first'
                      : attendanceMarked 
                        ? 'Attendance marked for today!'
                        : 'Click to record your attendance for today'
                    }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Todo Component Card */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Card sx={{ bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
                  Your Tasks
                </Typography>
                <Todo />
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Card sx={{ bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
                  Quick Actions
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate('/statistics', { state: { id } })}
                      startIcon={<AssessmentIcon />}
                      fullWidth
                      sx={{
                        py: 2,
                        borderRadius: 2,
                        '&:hover': { bgcolor: '#1976d2' }
                      }}
                    >
                      View Statistics
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      onClick={() => navigate('/schedule', { state: { id } })}
                      sx={{
                        py: 2,
                        borderRadius: 2,
                        '&:hover': { borderWidth: 2 }
                      }}
                    >
                      View Schedule
                    </Button>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      onClick={() => navigate('/register', { state: { id } })}
                      sx={{
                        py: 2,
                        borderRadius: 2,
                        '&:hover': { borderWidth: 2 }
                      }}
                    >
                      Attendance Log
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Success Dialog */}
        <Dialog
          open={showSuccessDialog}
          onClose={() => setShowSuccessDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: '300px'
            }
          }}
        >
          <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: '#2e7d32', mb: 2 }} />
            <Typography variant="h6" component="div">
              Attendance Marked Successfully!
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pb: 3 }}>
            <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
              Your attendance has been recorded for today
            </Typography>
          </DialogContent>
        </Dialog>

        {/* Error Alerts */}
        {attendanceStatus === 'error' && (
          <Alert 
            severity="error" 
            sx={{ 
              position: 'fixed', 
              bottom: 24, 
              right: 24, 
              boxShadow: 3 
            }}
            onClose={() => setAttendanceStatus(null)}
          >
            Failed to mark attendance. Please try again.
          </Alert>
        )}

        {attendanceStatus === 'location-error' && (
          <Alert 
            severity="error" 
            sx={{ 
              position: 'fixed', 
              bottom: 24, 
              right: 24, 
              boxShadow: 3 
            }}
            onClose={() => setAttendanceStatus(null)}
          >
            You must be within 500 meters of the college to mark attendance!
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;