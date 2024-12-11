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
import axios from 'axios'; // Import axios for making HTTP requests

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
        password: parseInt(credentials.password.trim(), 10),
      });

      if (response.data.success) {
        const { Id, Name, Password } = response.data.teacher; // Destructure the teacher data
        console.log('Teacher ID:', Id);
        console.log('Teacher Name:', Name);
        console.log('Teacher Password:', Password);
        onLogin(true);
        navigate('/dashboard', { state: { name: Name } });
      } else {
        alert(response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  };



  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card sx={{ minWidth: 275, width: '100%' }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom align="center">
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
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
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