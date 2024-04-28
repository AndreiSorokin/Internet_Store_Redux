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
import { forgotPassword, handleGoogleLogin, setUser, userLogin } from '../../redux/slices/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../components/contextAPI/ThemeContext';
import useErrorMessage from '../../hooks/ErrorMessage';
import useInput  from '../../hooks/UseInput';
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
        background: theme === 'bright' ? 'linear-gradient(to bottom, #B8B8B8  0%, #9C9C9C 25%, #7B7B7B 50%, #353535 100%)' : 'linear-gradient(to bottom, #444444 18%, #414141 38%, #3C3C3C 56%, #212121 97%)',
        color: theme === "bright" ? "black" : "#E9E9E9",
        minHeight: '100vh',
        paddingTop: '20vh',
        transition: '0.5s ease'
      }}
    >
      <GoogleOAuthProvider clientId="856209738432-ct140b6kuui6cov1cg2c2g8na5fpi3r4.apps.googleusercontent.com">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <GoogleLogin
          onSuccess={credentialResponse => {
          if (credentialResponse.credential) {
            dispatch(handleGoogleLogin({credential: credentialResponse.credential}));
            navigate('/');
          } else {
            showError('Credential is undefined');
          }
          }}
          onError={() => {}}
        />
        </div>
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
              sx={{ borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                        borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
                    },
                  },
                  'label': {
                  color: theme === 'bright' ? 'black' : 'white',
                  } }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              sx={{ 'svg': { color: theme === 'bright' ? 'black' : '#E9E9E9' } }}
            />
            <Button type="submit" fullWidth variant="contained"
            sx={{ 
              color: '#E9E9E9', border: '2px solid #5F2E2E', 
              fontSize: '15px', 
              padding: { xs: '5px 10px', sm: '8px 15px',
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
              Sign In
            </Button>
            <Button onClick={() => setOpenForgotPassword(true)} sx={{color: "#E9E9E9", textDecoration: "underline"}}>
              Forgot Password?
            </Button>
              <Dialog open={openForgotPassword} onClose={() => setOpenForgotPassword(false)}>
              <DialogTitle  sx={{backgroundColor: theme === 'bright' ? '#9C9C9C' : '#353535', color: theme === 'bright' ? 'black' : '#E9E9E9'}}>Forgot Password</DialogTitle>
              <DialogContent sx={{backgroundColor: theme === 'bright' ? '#9C9C9C' : '#353535'}}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="forgotEmail"
                  label="Email Address"
                  type="email"
                  fullWidth
                  value={forgotEmailInput.value}
                  onChange={forgotEmailInput.onChange}
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
                      color: theme === 'bright' ? 'black' : '#E9E9E9',
                      '&.Mui-focused': {
                        color: theme === 'bright' ? 'black' : '#E9E9E9',
                      },
                    },
                  }}
                    sx={{ margin: "2vh", width: "500px", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                          borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
                      },
                    },
                    'label': {
                    color: theme === 'bright' ? 'black' : '#E9E9E9',
                    } }}
                />
              </DialogContent>
              <DialogActions sx={{backgroundColor: theme === 'bright' ? '#9C9C9C' : '#353535'}}>
                <Button onClick={() => setOpenForgotPassword(false)} sx={{color: theme === 'bright' ? 'black' : '#E9E9E9'}}>
                  Cancel
                </Button>
                <Button onClick={handleForgotPassword}
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
                  Send Email
                </Button>
              </DialogActions>
            </Dialog>
            <Grid container>
              <Grid item>
                <Link to="/registration" style={{color: "#E9E9E9", textDecoration: "underline", fontSize: '18px'}}>Don't have an account? Sign Up</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
}