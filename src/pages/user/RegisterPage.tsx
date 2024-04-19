import * as React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'

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

import { useState } from 'react'
import { Credentials, User } from '../../misc/type';
import { useAppDispatch } from '../../redux/store';
import { userRegistration, uploadAvatar, setUser } from '../../redux/slices/userSlice'
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../components/contextAPI/ThemeContext';
import useErrorMessage from '../../hooks/ErrorMessage';
import axios from 'axios';

export default function RegisterPage() {
  const { theme } = useTheme()
  const { errorMessage, showError, errorMessageStyle } = useErrorMessage();

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)

const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files[0]) {
    setAvatar(event.target.files[0]);
  }
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if(!firstName || !lastName || !username || !email || !password || !avatar) {
    return showError('Ensure that fill out att the fields')
  } else if(password.length < 4) {
    return showError('Ensure that your password as least 4 characters long')
  } else if(!/\S+@\S+\.\S+/.test(email)) {
    return showError('Incorrect email format')
  }

  const formData = new FormData();
  formData.append('avatar', avatar);

  try {
    let avatarUrl = '';
    if (avatar) {
      const uploadedFileResponse = await dispatch(uploadAvatar(avatar)).unwrap();
      console.log("uploadedFileResponse:", uploadedFileResponse);
      avatarUrl = uploadedFileResponse;
    }

    const newUser: User = { firstName, lastName, username, email, password, avatar: avatarUrl };
    dispatch(userRegistration(newUser));
    alert('Your account has been created successfully')
    navigate('/auth/profile');
  } catch (error) {
    return showError('Something went wrong')
  }
};

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


  interface CredentialResponse {
    credential: string;
  }
  
  const handleGoogleLogin = async (credentialResponse: import("@react-oauth/google").CredentialResponse) => {
    const token = credentialResponse.credential; 
    if (!token) {
      console.error('No credential token received from Google login');
      return; 
    }
    try {
      const response = await axios.post('http://localhost:8080/api/v1/users/auth/google', { token });
      localStorage.setItem('userInformation', JSON.stringify(response.data));
      dispatch(setUser(response.data)); 
      navigate('/auth/profile'); 
    } catch (error) {
      console.error('Error processing Google login', error);
    }
  };

  // const handleGoogleLogin = () => {
  //   window.location.href = "http://localhost:8080/auth/google";
  // };

  return (
    <div style={{
      backgroundColor: theme === "bright" ? "white" : "black",
      color: theme === "bright" ? "black" : "white",
      height: '120vh',
      paddingTop: '20vh',
      transition: '0.5s ease'
    }} >
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
          <Avatar src={avatar ? URL.createObjectURL(avatar) : ''} sx={{ m: 1, bgcolor: 'secondary.main' }} />
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  InputProps={{
                    style: {
                      color: theme === 'bright' ? 'black' : 'white',
                    },
                  }}
                  sx={{ borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                    color: theme === 'bright' ? 'black' : 'white',
                  } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  autoComplete="second-name"
                  name="lastName"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  autoFocus
                  InputProps={{
                    style: {
                      color: theme === 'bright' ? 'black' : 'white',
                    },
                  }}
                  sx={{ borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                    color: theme === 'bright' ? 'black' : 'white',
                  } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  autoComplete="username"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  InputProps={{
                    style: {
                      color: theme === 'bright' ? 'black' : 'white',
                    },
                  }}
                  sx={{ borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                    color: theme === 'bright' ? 'black' : 'white',
                  } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  InputProps={{
                    style: {
                      color: theme === 'bright' ? 'black' : 'white',
                    },
                  }}
                  sx={{ borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                    color: theme === 'bright' ? 'black' : 'white',
                  } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  InputProps={{
                    style: {
                      color: theme === 'bright' ? 'black' : 'white',
                    },
                  }}
                  sx={{ borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                    color: theme === 'bright' ? 'black' : 'white',
                  } }}
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                  sx={{'svg': {
                    color: theme === 'bright' ? 'black' : 'white',
                  }}}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/auth/login">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </div>
  );
}