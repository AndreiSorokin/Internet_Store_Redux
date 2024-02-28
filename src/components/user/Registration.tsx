import * as React from 'react';
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
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useState } from 'react'
import { User } from '../../misc/type';
import { useAppDispatch } from '../../redux/store';
import { userRegistration, uploadAvatar } from '../../redux/slices/userSlice'
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contextAPI/ThemeContext';

export default function Registration() {
  const { theme } = useTheme()

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)


const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    const selectedFile = e.target.files[0];
    setAvatar(selectedFile);
  }
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if(!name || !email || !password || !avatar) {
    return alert('Ensure that fill out att the fields')
  }

  try {
    let avatarUrl = '';
    if (avatar) {
      const uploadedFileResponse = await dispatch(uploadAvatar(avatar));
      avatarUrl = uploadedFileResponse.payload;
    }

    const newUser: User = { name, email, password, avatar: avatarUrl };
    dispatch(userRegistration(newUser));
    alert('Your account has been created successfully')
    navigate('/');
  } catch (error) {
    console.error('Error:', error);
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


  return (
    <div style={{
      backgroundColor: theme === "bright" ? "white" : "black",
      color: theme === "bright" ? "black" : "white",
      height: '120vh',
      paddingTop: '20vh'
    }} >
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
                  onChange={(e) => setName(e.target.value)}
                  value={name}
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