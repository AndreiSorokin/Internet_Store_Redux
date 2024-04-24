import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { useAppDispatch } from '../../redux/store';
import { forgotPassword, setUser, userLogin } from '../../redux/slices/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../components/contextAPI/ThemeContext';
import useErrorMessage from '../../hooks/ErrorMessage';
import useInput  from '../../hooks/UseInput';
import axios from 'axios';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import useSuccsessMessage from '../../hooks/SuccsessMessage';

export default function LoginPage() {
  const { theme } = useTheme();
  const { succsessMessage, showSuccessMessage, succsessMessageStyle } = useSuccsessMessage();
  const { errorMessage, showError, errorMessageStyle } = useErrorMessage();

  const emailInput = useInput();
  const passwordInput = useInput();
  const forgotEmailInput = useInput();

  const [openForgotPassword, setOpenForgotPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await dispatch(userLogin({
        email: emailInput.value,
        password: passwordInput.value
      }));
  
      if (response.meta.requestStatus === 'fulfilled') {
        navigate('/auth/profile');
      } else {
        showError('Incorrect email or password');
      }
  
    } catch (error) {
      showError('An unexpected error occurred');
    }
  };

  const handleGoogleLogin = async (credentialResponse: import("@react-oauth/google").CredentialResponse) => {
    const token = credentialResponse.credential; 
    if (!token) {
      console.error('No credential token received from Google login');
      return; 
    }
    try {
      const response = await axios.post('http://localhost:8080/api/v1/users/auth/google', { id_token: token });
      localStorage.setItem('token', response.data.token);
      dispatch(setUser(response.data)); 
      console.log('response.data', response.data);
    } catch (error) {
      console.error('Error processing Google login', error);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await dispatch(forgotPassword(forgotEmailInput.value));
      if (forgotPassword.fulfilled.match(response)) {
        showSuccessMessage('Please check your email to reset your password.');
        setOpenForgotPassword(false);
      } else {
        showError('Failed to send reset password email.');
      }
    } catch (error) {
      showError('An unexpected error occurred');
    }
  };

  return (
    <div
      style={{
        backgroundColor: theme === 'bright' ? 'white' : 'black',
        color: theme === 'bright' ? 'black' : 'white',
        height: '120vh',
        paddingTop: '20vh',
        transition: '0.5s ease'
      }}
    >
      <GoogleOAuthProvider clientId="856209738432-ct140b6kuui6cov1cg2c2g8na5fpi3r4.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={credentialResponse => {
            handleGoogleLogin(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </GoogleOAuthProvider>
      {succsessMessage && <p style={succsessMessageStyle}>{succsessMessage}</p>}
      {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={emailInput.value}
              onChange={emailInput.onChange}
              autoFocus
              InputProps={{
                style: {
                  color: theme === 'bright' ? 'black' : 'white',
                },
              }}
              sx={{
                borderRadius: '5px',
                border: theme === 'bright' ? 'none' : '1px solid white',
                'label': {
                  color: theme === 'bright' ? 'black' : 'white',
                },
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
              value={passwordInput.value}
              onChange={passwordInput.onChange}
              autoComplete="current-password"
              InputProps={{
                style: {
                  color: theme === 'bright' ? 'black' : 'white',
                },
              }}
              sx={{
                borderRadius: '5px',
                border: theme === 'bright' ? 'none' : '1px solid white',
                'label': {
                  color: theme === 'bright' ? 'black' : 'white',
                },
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              sx={{ 'svg': { color: theme === 'bright' ? 'black' : 'white' } }}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Button onClick={() => setOpenForgotPassword(true)} color="primary">
              Forgot Password?
            </Button>
              <Dialog open={openForgotPassword} onClose={() => setOpenForgotPassword(false)}>
              <DialogTitle  sx={{backgroundColor: theme === 'bright' ? 'white' : 'black', color: theme === 'bright' ? 'black' : 'white'}}>Forgot Password</DialogTitle>
              <DialogContent sx={{backgroundColor: theme === 'bright' ? 'white' : 'black'}}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="forgotEmail"
                  label="Email Address"
                  type="email"
                  fullWidth
                  value={forgotEmailInput.value}
                  onChange={forgotEmailInput.onChange}
                  sx={{border: '1px solid white'}}
                  InputProps={{
                    style: {
                        color: theme === 'bright' ? 'black' : 'white',
                    },
                  }}
                />
              </DialogContent>
              <DialogActions sx={{backgroundColor: theme === 'bright' ? 'white' : 'black'}}>
                <Button onClick={() => setOpenForgotPassword(false)} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleForgotPassword} color="primary">
                  Send Email
                </Button>
              </DialogActions>
            </Dialog>
            <Grid container>
              <Grid item>
                <Link to="/registration">Don't have an account? Sign Up</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
}