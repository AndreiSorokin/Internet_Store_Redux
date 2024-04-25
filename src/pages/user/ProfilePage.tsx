import { useState } from 'react';

import { AppState, useAppDispatch, useAppSelector } from '../../redux/store';
import { useTheme } from '../../components/contextAPI/ThemeContext';
import { updatePassword, updateUserProfile } from '../../redux/slices/userSlice';
import { LoggedInUser, UserData } from '../../misc/type';
import  useInput  from '../../hooks/UseInput';
import defaultPicture from "../../img/defaultPicture.png"

import useSuccsessMessage from '../../hooks/SuccsessMessage';
import useErrorMessage from '../../hooks/ErrorMessage';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import parseJwt from '../../helpers/decode';


export default function ProfilePage() {
  const { theme } = useTheme();
  const { succsessMessage, showSuccessMessage, succsessMessageStyle } = useSuccsessMessage();
  const { errorMessage, showError, errorMessageStyle } = useErrorMessage();


  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.userRegister.users)
  
  const usernameInput = useInput();
  const firstNameInput = useInput();
  const lastNameInput = useInput();
  const emailInput = useInput();
  const currentPasswordInput = useInput();
  const newPasswordInput = useInput();

  const user = parseJwt(localStorage.getItem('token'));
  const [openUpdatePasswordDialog, setOpenUpdatePasswordDialog] = useState(false);

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const existedEmail = users.map(user=> user.email)
  
    type UserChanges = Partial<Pick<UserData, 'username' | 'firstName' | 'lastName' | 'email'>>;
    const changes: UserChanges = {};
  
    if (firstNameInput.value !== user.firstName && firstNameInput.value !== '') {
      changes.firstName = firstNameInput.value;
    }
    if (lastNameInput.value !== user.lastName && lastNameInput.value !== '') {
      changes.lastName = lastNameInput.value;
    }
    if(usernameInput.value !== user.username && usernameInput.value !== '') {
      changes.username = usernameInput.value;
    }
    if (emailInput.value !== user.email && emailInput.value !== '') {
      if (!/\S+@\S+\.\S+/.test(emailInput.value)) {
        return showError('Incorrect email format');
      } else if(existedEmail) {
        return showError('Oops This email is already taken')
      }
    

      changes.email = emailInput.value;
    }
  
    if (Object.keys(changes).length === 0) {
      return showError('No changes detected');
    }

    console.log(user)
  
    const updatedUser: UserData = {
      ...user,
      ...changes,
      id: user.id
    };
  
    dispatch(updateUserProfile(updatedUser)).then(() => {
      firstNameInput.reset();
      lastNameInput.reset();
      usernameInput.reset();
      emailInput.reset();
    });
  
    if(user.status === 'INACTIVE') {
      return showError('Your account is inactive. Please contact the administrator')
    }
  
    showSuccessMessage('Your information has been updated successfully');
    console.log('user', user)
  };

  const handleUpdatePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newPasswordInput.value || newPasswordInput.value.length < 6) {
      return showError('New password must be at least 6 characters long');
    }

    dispatch(updatePassword({
      id: user.id,
      oldPassword: currentPasswordInput.value,
      newPassword: newPasswordInput.value,
    }))
    .then((action) => {
      if (updatePassword.fulfilled.match(action)) {
        showSuccessMessage('Password updated successfully');
        currentPasswordInput.reset();
        newPasswordInput.reset();
      } else {
        showError('Failed to update password');
      }
    });
  };

  const handleClickOpenUpdatePasswordDialog = () => {
    setOpenUpdatePasswordDialog(true);
  };

  const handleCloseUpdatePasswordDialog = () => {
    setOpenUpdatePasswordDialog(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme === 'bright' ? 'linear-gradient(135deg, #F7C585, #F76B19)' : 'linear-gradient(135deg, #431C01, #72571D)',
        color: theme === 'bright' ? 'black' : 'white',
        minHeight: '120vh',
        transition: '0.5s ease',
        overflow: 'hidden',
        paddingTop: '3vh'
      }}
    >
      {succsessMessage && <p style={succsessMessageStyle}>{succsessMessage}</p>}
      {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>}
      {user && (
        <div style={{ textAlign: 'center' }}>
          <img style={{ borderRadius: '5px', width: '150px' }} src={user.avatar || defaultPicture} alt="" />
          {user.status === 'INACTIVE' && <div>Your account is inactive, please contact administrator</div>}
          <h1>Hello, {user.firstName || "User"}</h1>
          <p>On this page you can modify your information</p>
          <form onSubmit={handleUpdateUser} style={{ width: '100%', maxWidth: '400px' }}>
          <TextField
              placeholder={user.username}
              name="usernameInput"
              label="username"
              value={usernameInput.value}
              onChange={usernameInput.onChange}
              variant="outlined"
              margin="normal"
              fullWidth
              InputProps={{
                style: {
                  color: theme === 'bright' ? 'black' : 'white',
                },
                }}
                sx={{ margin: "2vh", width: "90%", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                color: theme === 'bright' ? 'black' : 'white'
                } }}
            />
            <TextField
              placeholder={user.firstName}
              name="firstName"
              label="First name"
              value={firstNameInput.value}
              onChange={firstNameInput.onChange}
              variant="outlined"
              margin="normal"
              fullWidth
              InputProps={{
                style: {
                  color: theme === 'bright' ? 'black' : 'white',
                  background: theme === 'bright' ? 'linear-gradient(135deg, #F7C585, #F76B19)' : 'linear-gradient(135deg, #431C01, #72571D)',

                },
                }}
                sx={{ margin: "2vh", width: "90%", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                color: theme === 'bright' ? 'black' : 'white'
                } }}
            />
            <TextField
              placeholder={user.lastName}
              name="lasttName"
              label="Last name"
              value={lastNameInput.value}
              onChange={lastNameInput.onChange}
              variant="outlined"
              margin="normal"
              fullWidth
              InputProps={{
                style: {
                  color: theme === 'bright' ? 'black' : 'white',
                },
                }}
                sx={{ margin: "2vh", width: "90%", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                color: theme === 'bright' ? 'black' : 'white'
                } }}
            />
            <TextField
              placeholder={user.email}
              name="email"
              label="Email"
              value={emailInput.value}
              onChange={emailInput.onChange}
              variant="outlined"
              margin="normal"
              fullWidth
              InputProps={{
                style: {
                  color: theme === 'bright' ? 'black' : 'white',
                },
                }}
                sx={{ margin: "2vh", width: "90%", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                color: theme === 'bright' ? 'black' : 'white',
                } }}
            />
            <Button type="submit" variant="outlined" color="primary">
              Apply Changes
            </Button>
          </form>
          <Button variant="outlined" color="primary" onClick={handleClickOpenUpdatePasswordDialog}>
            Update Password
          </Button>
          <Dialog open={openUpdatePasswordDialog} onClose={handleCloseUpdatePasswordDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title" sx={{background: theme === 'bright' ? 'linear-gradient(135deg, #F7C585, #F76B19)' : 'linear-gradient(135deg, #431C01, #72571D)',}}>Update Password</DialogTitle>
            <DialogContent sx={{background: theme === 'bright' ? 'linear-gradient(135deg, #F7C585, #F76B19)' : 'linear-gradient(135deg, #431C01, #72571D)',}}>
              <form onSubmit={handleUpdatePassword}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="currentPassword"
                  label="Current Password"
                  type="password"
                  fullWidth
                  value={currentPasswordInput.value}
                  onChange={currentPasswordInput.onChange}
                  // sx={{backgroundColor: "black"}}
                />
                <TextField
                  margin="dense"
                  id="newPassword"
                  label="New Password"
                  type="password"
                  fullWidth
                  value={newPasswordInput.value}
                  onChange={newPasswordInput.onChange}
                />
                <DialogActions>
                  <Button onClick={handleCloseUpdatePasswordDialog} color="primary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    Update
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

