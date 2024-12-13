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
} from '@mui/material';
import {
  AssessmentOutlined as AssessmentIcon,
  HowToRegOutlined as HowToRegIcon,
  AccessTimeOutlined as AccessTimeIcon,
  CalendarTodayOutlined as CalendarIcon,
  ExitToAppOutlined as LogoutIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, id } = location.state || {};
  const teacherId = location.state?.teacherId;

  const [currentTime, setCurrentTime] = useState(new Date());

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
          {/* Mark Attendance Card */}
          <Grid item xs={12}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                borderRadius: 2,
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography 
                  variant="h5" 
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
                  onClick={() => navigate('/attendance', { state: { id } })}
                  startIcon={
                    <HowToRegIcon sx={{ fontSize: 28 }} />
                  }
                  sx={{
                    py: 2.5,
                    px: 6,
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                    boxShadow: '0 4px 15px 0 rgba(46,125,50,0.3)',
                    maxWidth: '600px',
                    margin: '0 auto',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                      boxShadow: '0 6px 20px 0 rgba(46,125,50,0.4)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Mark Attendance
                </Button>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mt: 2, 
                    color: '#2e7d32',
                    opacity: 0.8 
                  }}
                >
                  Click to record your attendance for today
                </Typography>
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