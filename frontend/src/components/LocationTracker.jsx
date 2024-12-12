import React, { useState } from 'react';
import { Box, Typography, Button, Alert, Switch, FormControlLabel } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';

const isDevelopment = true; // Set to true for development/testing

// Mock location for testing (Mumbai coordinates)
const MOCK_LOCATION = {
  latitude: 19.0760,
  longitude: 72.8777
};

const LocationTracker = ({ collegeLocation, onLocationVerified }) => {
  const [status, setStatus] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [useMockLocation, setUseMockLocation] = useState(isDevelopment);

  const getLocation = () => {
    setIsLocating(true);
    setStatus('Requesting location access...');

    // Use mock location in development mode if selected
    if (useMockLocation) {
      setTimeout(() => {
        console.log('Using mock location:', MOCK_LOCATION);
        const isNearCollege = true; // Always true for testing
        setStatus('Location verified (Development Mode)');
        onLocationVerified(isNearCollege, MOCK_LOCATION);
        setIsLocating(false);
      }, 1000);
      return;
    }

    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const success = (position) => {
      const { latitude, longitude } = position.coords;
      const isNearCollege = true; // For testing, always allow
      
      console.log('Current position:', { latitude, longitude });
      console.log('College position:', collegeLocation);
      
      setStatus('Location verified successfully');
      onLocationVerified(isNearCollege, { latitude, longitude });
      setIsLocating(false);
    };

    const error = (err) => {
      console.warn('Location Error:', err);
      let message = '';
      switch (err.code) {
        case 1:
          message = 'Please allow location access in your browser settings.';
          break;
        case 2:
          message = 'Location not available. Using development mode is recommended for testing.';
          break;
        case 3:
          message = 'Location request timed out. Please try again.';
          break;
        default:
          message = 'Unable to get location. Please try again.';
      }
      setStatus(message);
      setIsLocating(false);
    };

    try {
      navigator.geolocation.getCurrentPosition(success, error, options);
    } catch (e) {
      console.error('Geolocation error:', e);
      setStatus('Failed to get location. Please check browser permissions.');
      setIsLocating(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {isDevelopment && (
        <FormControlLabel
          control={
            <Switch
              checked={useMockLocation}
              onChange={(e) => setUseMockLocation(e.target.checked)}
              name="useMockLocation"
            />
          }
          label="Use Development Mode (Mock Location)"
          sx={{ mb: 2, display: 'block' }}
        />
      )}

      <Button
        variant="contained"
        color="primary"
        startIcon={<MyLocationIcon />}
        onClick={getLocation}
        disabled={isLocating}
        fullWidth
        sx={{ mb: 2 }}
      >
        {isLocating ? 'Getting Location...' : 'Get My Location'}
      </Button>

      {status && (
        <Alert 
          severity={status.includes('verified') ? 'success' : 'info'}
          icon={<LocationOnIcon />}
          sx={{ mt: 1 }}
        >
          {status}
          {useMockLocation && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Development Mode: Using mock location at {MOCK_LOCATION.latitude}, {MOCK_LOCATION.longitude}
            </Typography>
          )}
        </Alert>
      )}
    </Box>
  );
};

export default LocationTracker;
