// frontend/src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container
} from '@mui/material';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    teacherId: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        teacherId: credentials.teacherId.trim(),
        password: credentials.password.trim(),
      });

      if (response.data.success) {
        const { Id, Name } = response.data.teacher;
        onLogin(true);
        navigate('/dashboard', { state: { name: Name, id: Id } });
      } else {
        alert(response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '0', // Remove extra padding
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: 'auto', // Center the component within the container
        }}
      >
        <Card
          sx={{
            minWidth: 275,
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: 3,
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              component="div"
              gutterBottom
              align="center"
              sx={{ color: '#6200ea', fontWeight: 'bold' }}
            >
              Teacher Login
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="teacherId"
                label="Teacher ID"
                name="teacherId"
                autoComplete="username"
                autoFocus
                value={credentials.teacherId}
                onChange={handleChange}
                sx={{
                  '& .MuiInputLabel-root': { color: '#6200ea' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#6200ea' },
                    '&:hover fieldset': { borderColor: '#3700b3' },
                  },
                  '& .MuiInputBase-input': { borderRadius: '8px' },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
                sx={{
                  '& .MuiInputLabel-root': { color: '#6200ea' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#6200ea' },
                    '&:hover fieldset': { borderColor: '#3700b3' },
                  },
                  '& .MuiInputBase-input': { borderRadius: '8px' },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: '#6200ea',
                  '&:hover': { backgroundColor: '#3700b3' },
                  borderRadius: '8px',
                  transition: '0.3s ease-in-out',
                }}
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
