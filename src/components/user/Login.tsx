import React, { useCallback } from 'react';
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

import { AppState, useAppDispatch, useAppSelector } from '../../redux/store';
import { userLogin } from '../../redux/slices/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contextAPI/ThemeContext';
import useErrorMessage from '../../hooks/ErrorMessage';
import useInput  from '../../hooks/UseInput';

export default function Login() {
  const { theme } = useTheme();
  const { errorMessage, showError, errorMessageStyle } = useErrorMessage();

  const user = useAppSelector((state: AppState) => state.userRegister.user);

  const emailInput = useInput();
  const passwordInput = useInput();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const response = await dispatch(userLogin({ email: emailInput.value, password: passwordInput.value }));

        if (response.payload && response.payload.access_token) {
          const { role, name, avatar } = response.payload;
          localStorage.setItem('userInformation', JSON.stringify({ ...response.payload, role, name, avatar }));
          navigate('/');
        } else {
          showError('Incorrect email or password');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    [emailInput.value, passwordInput.value, dispatch, navigate, showError]
  );

  function Copyright(props: any) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" to="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  return (
    <div
      style={{
        backgroundColor: theme === 'bright' ? 'white' : 'black',
        color: theme === 'bright' ? 'black' : 'white',
        height: '120vh',
        paddingTop: '20vh',
      }}
    >
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
              {...emailInput}
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
              {...passwordInput}
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
            <Grid container>
              <Grid item xs>
                <Link to="#">Forgot password?</Link>
              </Grid>
              <Grid item>
                <Link to="/registration">Don't have an account? Sign Up</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </div>
  );
}