import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/users/userSlice';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (email && password) {
        const useCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log('useCredentials: ', useCredentials);
        // dispatch(setUser(useCredentials.user));
      }
    } catch (error) {}
    // Simplified example, replace with real auth
    if (email && password) {
      console.info('email: ', email, 'password: ', password);
      dispatch(setUser({ id: 1, name: 'Demo User', email, password }));
      navigate('/dashboard');
    }
  };

  return (
    <Container maxWidth='sm' sx={{ mt: 8 }}>
      <Typography variant='h4' align='center' gutterBottom>
        Sign In
      </Typography>
      <Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          label='Email'
          fullWidth
          margin='normal'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label='Password'
          type='password'
          fullWidth
          margin='normal'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type='submit' variant='contained' fullWidth sx={{ mt: 3 }}>
          Sign In
        </Button>
      </Box>
    </Container>
  );
};

export default SignIn;
