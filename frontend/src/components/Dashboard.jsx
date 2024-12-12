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
  Alert,
  Paper,
  Avatar,
  Divider,
  IconButton,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  AssessmentOutlined as AssessmentIcon,
  HowToRegOutlined as HowToRegIcon,
  AccessTimeOutlined as AccessTimeIcon,
  CalendarTodayOutlined as CalendarIcon,
  ExitToAppOutlined as LogoutIcon,
  TrendingUpOutlined as TrendingUpIcon,
  CheckCircleOutline as CheckCircleIcon,
  LocationOnOutlined as LocationIcon
} from '@mui/icons-material';
import LocationTracker from './LocationTracker';

// College location coordinates
const COLLEGE_LOCATION = {
  latitude: 19.0760,
  longitude: 72.8777
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name,id } = location.state || {};
  const teacherId = location.state?.teacherId;

  // Debugging: Log the teacherId
  console.log('Teacher ID:', teacherId);
  console.log(id)

  const [isMarked, setIsMarked] = useState(false);
  const [canMarkAttendance, setCanMarkAttendance] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceStats, setAttendanceStats] = useState({
    present: 85,
    total: 100,
    streak: 7
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
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
          {/* Stats Cards */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', bgcolor: '#e3f2fd', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Attendance Rate
                </Typography>
                <Box sx={{ mt: 2, mb: 1 }}>
                  <Typography variant="h3" component="div" color="text.primary">
                    {Math.round((attendanceStats.present / attendanceStats.total) * 100)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(attendanceStats.present / attendanceStats.total) * 100}
                  sx={{ height: 8, borderRadius: 4, bgcolor: '#90caf9' }}
                />
                <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                  {attendanceStats.present} days present out of {attendanceStats.total} working days
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', bgcolor: '#f8fafc' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Current Streak
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <TrendingUpIcon sx={{ fontSize: 40, color: '#4caf50', mr: 2 }} />
                  <Typography variant="h3" component="div" color="text.primary">
                    {attendanceStats.streak}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ ml: 1 }}>
                    days
                  </Typography>
                </Box>
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Keep it up!"
                  color="success"
                  variant="outlined"
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', bgcolor: '#f8fafc' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Location Status
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
                    sx={{
                      mt: 2,
                      py: 1.5,
                      boxShadow: 2,
                      '&:hover': { boxShadow: 4 }
                    }}
                  >
                    Mark Attendance
                  </Button>
                )}
                {isMarked && (
                  <Alert
                    severity="success"
                    sx={{
                      mt: 2,
                      borderRadius: 2,
                      '& .MuiAlert-icon': { fontSize: '1.5rem' }
                    }}
                  >
                    Attendance marked successfully for today
                  </Alert>
                )}
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
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate('/statistics')}
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
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<LocationIcon />}
                      fullWidth
                      sx={{
                        py: 2,
                        borderRadius: 2,
                        '&:hover': { borderWidth: 2 }
                      }}
                    >
                      Update Location
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
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
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;