import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/users/userSlice';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../app/store';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  console.log('user: ', user);
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='h4' gutterBottom>
        Dashboard
      </Typography>
      <Typography variant='h6'>Welcome, {user.name || 'User'}!</Typography>
      <Button variant='outlined' sx={{ mt: 3 }} onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default Dashboard;
