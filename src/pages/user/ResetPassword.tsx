import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { resetPassword } from '../../redux/slices/userSlice';
import { useAppDispatch } from '../../redux/store';
import { useTheme } from '../../components/contextAPI/ThemeContext';
import useSuccsessMessage from '../../hooks/SuccsessMessage';
import useErrorMessage from '../../hooks/ErrorMessage';

import { Box, Button, Container, TextField, Typography } from '@mui/material';

const ResetPassword = () => {
   const { theme } = useTheme();
   const { succsessMessage, showSuccessMessage, succsessMessageStyle } = useSuccsessMessage();
   const { errorMessage, showError, errorMessageStyle } = useErrorMessage();
   const navigate = useNavigate();

   const [newPassword, setNewPassword] = useState('');

   const dispatch = useAppDispatch();
   const location = useLocation();
   const queryParams = new URLSearchParams(location.search);
   const token = queryParams.get('token');

   const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
   
      e.preventDefault();
      if (!newPassword || !token) {
         showError('Please provide a new password and token.');
         return;
      } else if (newPassword.length < 5) {
         showError('Password must be at least 5 characters long.');
         return;
      }
      try {
      const resultAction = await dispatch(resetPassword({ newPassword, token }));
      if (resetPassword.fulfilled.match(resultAction)) {
         showSuccessMessage('Password reset successfully. You can now log in with your new password.');
         setTimeout(() => {
            navigate('/auth/login');
            }, 3000);
      } else {
         throw new Error('Failed to reset password.');
      }
   } catch (error) {
      showError('Failed to reset password.');
   }
};

   return (
      <div style={{
         backgroundColor: theme === 'bright' ? 'white' : 'black',
         color: theme === 'bright' ? 'black' : 'white',
         height: '80vh',
         paddingTop: '20vh',
         transition: '0.5s ease'
         }}>
         {succsessMessage && <p style={succsessMessageStyle}>{succsessMessage}</p>}
         {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>}
         <Container component="main" maxWidth="xs" sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
         }}>
            <Box
               sx={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: theme === 'bright' ? '1px solid black' : '1px solid white',
                  padding: '20px'
               }}
            >
               <Typography component="h1" variant="h5">
                  Reset Password
               </Typography>
               <Box component="form" onSubmit={handleResetPassword} noValidate sx={{ mt: 1 }}>
               <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="newPassword"
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoFocus
                  sx={{border: '1px solid white'}}
                        InputProps={{
                        style: {
                           color: theme === 'bright' ? 'black' : 'white',
                        },
                     }}
               />
               <Button
                  type="submit"
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 3, mb: 2 }}
               >
                  Reset Password
               </Button>
               </Box>
            </Box>
         </Container>
      </div>
   );
};

export default ResetPassword;