import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';
const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simplified, could add API call here
    if (email && password && userName) {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(user, { displayName: userName });
      console.log('signup - user: ', user);
      // navigate('/signin');
      await auth.updateCurrentUser(user);
      console.log('signup - user: ', user);
    }
  };

  return (
    <Container maxWidth='sm' sx={{ mt: 8 }}>
      <Typography variant='h4' align='center' gutterBottom>
        Create Account
      </Typography>
      <Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          label='Name'
          fullWidth
          margin='normal'
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <TextField
          label='Email'
          type='email'
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
          Sign Up
        </Button>
      </Box>
    </Container>
  );
};

export default SignUp;
