import { AppState, useAppDispatch, useAppSelector } from '../../redux/store';
import { useTheme } from '../../components/contextAPI/ThemeContext';
import { getSingleUser, switchRole, updatePassword, updateUserProfile } from '../../redux/slices/userSlice';
import { LoggedInUser, UserData } from '../../misc/type';
import  useInput  from '../../hooks/UseInput';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import useSuccsessMessage from '../../hooks/SuccsessMessage';
import useErrorMessage from '../../hooks/ErrorMessage';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { theme } = useTheme();
  const { succsessMessage, showSuccessMessage, succsessMessageStyle } = useSuccsessMessage();
  const { errorMessage, showError, errorMessageStyle } = useErrorMessage();


  const dispatch = useAppDispatch();
  

  const firstNameInput = useInput();
  const lastNameInput = useInput();
  const emailInput = useInput();
  const currentPasswordInput = useInput();
  const newPasswordInput = useInput();
  const user = useAppSelector((state: AppState) => state.userRegister.user) as LoggedInUser;
  const [openUpdatePasswordDialog, setOpenUpdatePasswordDialog] = useState(false);


  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    type UserChanges = Partial<Pick<UserData, 'firstName' | 'lastName' | 'email'>>;
    const changes: UserChanges = {};
  
    if (firstNameInput.value !== user.firstName && firstNameInput.value !== '') {
      changes.firstName = firstNameInput.value;
    }
    if (lastNameInput.value !== user.lastName && lastNameInput.value !== '') {
      changes.lastName = lastNameInput.value;
    }
    if (emailInput.value !== user.email && emailInput.value !== '') {
      if (!/\S+@\S+\.\S+/.test(emailInput.value)) {
        return showError('Incorrect email format');
      }
      changes.email = emailInput.value;
    }
  
    if (Object.keys(changes).length === 0) {
      return showError('No changes detected');
    }
  
    const updatedUser: UserData = {
      ...user,
      ...changes,
      id: user.userData.id
    };
  
    dispatch(updateUserProfile(updatedUser));
  
    localStorage.setItem('userInformation', JSON.stringify(updatedUser));
  
    showSuccessMessage('Your information has been updated successfully');
    console.log('user', user)
  };
  
  const handleSwitchRole = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(user) {
      dispatch(switchRole(user))
      localStorage.setItem('userInformation', JSON.stringify(user));
      showSuccessMessage('You have bocome an admin')
    }
  }

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
        backgroundColor: theme === 'bright' ? 'white' : 'black',
        color: theme === 'bright' ? 'black' : 'white',
        minHeight: '100vh',
        transition: '0.5s ease',
        overflow: 'hidden'
      }}
    >
      {succsessMessage && <p style={succsessMessageStyle}>{succsessMessage}</p>}
      {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>}
      {user && (
        <div style={{ textAlign: 'center' }}>
          <img style={{ borderRadius: '5px', width: '150px' }} src={user.userData.avatar} alt="" />
          <h1>Hello, {user.userData.firstName}</h1>
          <form onSubmit={handleUpdateUser} style={{ width: '100%', maxWidth: '400px' }}>
            <TextField
              placeholder={user.userData.firstName}
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
                },
                }}
                sx={{ margin: "2vh", width: "90%", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                color: theme === 'bright' ? 'black' : 'white'
                } }}
            />
            <TextField
              placeholder={user.userData.lastName}
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
              placeholder={user.userData.email}
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
          {/* <form onSubmit={handleSwitchRole} style={{ width: '100%', maxWidth: '400px', marginTop: '15px' }}>
            <Button type="submit" variant="outlined" color="primary">
              Switch role
            </Button>
          </form> */}
          <Button variant="outlined" color="primary" onClick={handleClickOpenUpdatePasswordDialog}>
            Update Password
          </Button>
          <Dialog open={openUpdatePasswordDialog} onClose={handleCloseUpdatePasswordDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Update Password</DialogTitle>
            <DialogContent>
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

