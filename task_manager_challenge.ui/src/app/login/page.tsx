"use client"

import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { API_ROUTES } from '@/constants/api';
import { User } from '@/types/User';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post(API_ROUTES.LOGIN, {
        email,
        password,
      });

      if (response.status === 200) {
        const user: User = {
          email: email,
          token: response.data.token,
          id: 0,
          name: 'Admin'
        }
        login(user);
        router.push("/");
      }
    } catch {
      console.log(error)
      setError('Invalid credentials.');
    }
  };

  return (
    <CenteredBox>
      <FormContainer>
      <Typography variant="h4">Login</Typography>
      <form onSubmit={handleSubmit}>
        <FormItem>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </FormItem>

        <FormItem>
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </FormItem>

        <FormItem>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!email || !password}
          >
            Login
          </Button>
        </FormItem>
      </form>

      {error && <Typography color="error" variant="body2">{error}</Typography>}

      </FormContainer>
    </CenteredBox>
  );
};

const CenteredBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(2),
  backgroundColor: 'white',
}));

const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
  padding: theme.spacing(3),
  backgroundColor: 'white',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  borderRadius: '8px',
}));

const FormItem = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

export default LoginPage;
