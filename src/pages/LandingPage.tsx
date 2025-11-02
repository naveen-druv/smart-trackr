import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth='lg' sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant='h2' gutterBottom>
        Welcome to SmartTrackr
      </Typography>
      <Typography variant='h5' color='text.secondary' gutterBottom>
        Manage your finances effortlessly with secure and seamless tracking.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
          variant='contained'
          color='primary'
          size='large'
          sx={{ mx: 2 }}
          onClick={() => navigate('/signin')}>
          Sign In
        </Button>
        <Button
          variant='outlined'
          color='primary'
          size='large'
          sx={{ mx: 2 }}
          onClick={() => navigate('/signup')}>
          Sign Up
        </Button>
      </Box>
    </Container>
  );
};

export default LandingPage;
