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

import { useEffect, useState } from 'react'
import { Credentials, User } from '../../misc/type';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { userRegistration, setUser, fetchAllUsers } from '../../redux/slices/userSlice'
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../components/contextAPI/ThemeContext';
import useErrorMessage from '../../hooks/ErrorMessage';
import axios from 'axios';
import { uploadImage } from '../../redux/slices/uploadSlice';

export default function RegisterPage() {
  const { theme } = useTheme()
  const { errorMessage, showError, errorMessageStyle } = useErrorMessage();

  const dispatch = useAppDispatch()
  const users = useAppSelector((state) => state.userRegister.users)
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)

  useEffect(() => {
    dispatch(fetchAllUsers())
  }, [dispatch])

  const existedEmail = users.map(user=> user.email).includes(email)


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

  if(existedEmail) {
    return showError('A user with this email already exists')
  }

  const formData = new FormData();
  formData.append('avatar', avatar);

  try {
    let avatarUrl = '';
    if (avatar) {
      const uploadedFileResponse = await dispatch(uploadImage(avatar)).unwrap();
      console.log("uploadedFileResponse:", uploadedFileResponse);
      avatarUrl = uploadedFileResponse;
    }

    const newUser: User = { firstName, lastName, username, email, password, avatar: avatarUrl };
    await dispatch(userRegistration(newUser));
    alert('Your account has been created successfully')
    navigate('/auth/login');
  } catch (error) {
    showError('Something went wrong')
    return
  }
};

  return (
    <div style={{
      background: theme === 'bright' ? 'linear-gradient(to bottom, #B8B8B8  0%, #9C9C9C 25%, #7B7B7B 50%, #353535 100%)' : 'linear-gradient(to bottom, #444444 18%, #414141 38%, #3C3C3C 56%, #212121 97%)',
      color: theme === "bright" ? "black" : "#E9E9E9",
      minHeight: '100vh',
      paddingTop: '5vh',
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
                    sx: {
                      color: theme === 'bright' ? 'black' : '#E9E9E9',
                      '@media (max-width: 768px)': {
                        maxWidth: '90%',
                      },
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      color: theme === 'bright' ? 'black' : 'white',
                      '&.Mui-focused': {
                        color: theme === 'bright' ? 'black' : '#E9E9E9',
                      },
                    },
                  }}
                  sx={{borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                            borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
                        },
                      },
                      'label': {
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
                    sx: {
                      color: theme === 'bright' ? 'black' : '#E9E9E9',
                      '@media (max-width: 768px)': {
                        maxWidth: '90%',
                      },
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      color: theme === 'bright' ? 'black' : 'white',
                      '&.Mui-focused': {
                        color: theme === 'bright' ? 'black' : '#E9E9E9',
                      },
                    },
                  }}
                  sx={{borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                            borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
                        },
                      },
                      'label': {
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
                    sx: {
                      color: theme === 'bright' ? 'black' : '#E9E9E9',
                      '@media (max-width: 768px)': {
                        maxWidth: '90%',
                      },
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      color: theme === 'bright' ? 'black' : 'white',
                      '&.Mui-focused': {
                        color: theme === 'bright' ? 'black' : '#E9E9E9',
                      },
                    },
                  }}
                  sx={{borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                            borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
                        },
                      },
                      'label': {
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
                    sx: {
                      color: theme === 'bright' ? 'black' : '#E9E9E9',
                      '@media (max-width: 768px)': {
                        maxWidth: '90%',
                      },
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      color: theme === 'bright' ? 'black' : 'white',
                      '&.Mui-focused': {
                        color: theme === 'bright' ? 'black' : '#E9E9E9',
                      },
                    },
                  }}
                  sx={{borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                            borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
                        },
                      },
                      'label': {
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
                    sx: {
                      color: theme === 'bright' ? 'black' : '#E9E9E9',
                      '@media (max-width: 768px)': {
                        maxWidth: '90%',
                      },
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      color: theme === 'bright' ? 'black' : 'white',
                      '&.Mui-focused': {
                        color: theme === 'bright' ? 'black' : '#E9E9E9',
                      },
                    },
                  }}
                  sx={{borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                            borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
                        },
                      },
                      'label': {
                      color: theme === 'bright' ? 'black' : 'white',
                      } }}
                />
              </Grid>
              <Grid item xs={12}>
              <Box sx={{ margin: "2vh" }}>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    color: theme === 'bright'? 'black' : '#E9E9E9', 
                    border: theme === 'bright'? '2px solid black' : '2px solid #E9E9E9', 
                    fontSize: { xs: '0.8rem', sm: '1rem' }, 
                    padding: { xs: '5px 10px', sm: '8px 15px' },
                    backgroundColor: 'transparent',
                    '&:hover': {
                        borderColor: theme === 'bright'? 'black' : '#E9E9E9'
                    }
                  }}
                >
                  Upload File
                  <input
                    type="file"
                    hidden
                    onChange={handleAvatarChange}
                    accept="image/*"
                    multiple
                  />
                </Button>
              </Box>
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
              sx={{ 
                color: '#E9E9E9', border: '2px solid #5F2E2E', 
                fontSize: '15px', 
                padding: { xs: '5px 10px', sm: '8px 15px', marginTop: '2vh',
                '@media (max-width: 768px)': {
                  maxWidth: '90%',
                },
                },
                backgroundColor: '#5F2E2E',
                '&:hover': {
                  borderColor: '#5F2E2E',
                  transition: '0.5s ease'
                }
              }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/auth/login" style={{color: "#E9E9E9", textDecoration: "underline", fontSize: '18px'}}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
}