import { AppState, useAppDispatch, useAppSelector } from '../../redux/store';
import { useTheme } from '../../components/contextAPI/ThemeContext';
import { getSingleUser, switchRole, updateUserProfile } from '../../redux/slices/userSlice';
import { LoggedInUser, UserData } from '../../misc/type';
import  useInput  from '../../hooks/UseInput';

import { Button, TextField } from '@mui/material';
import useSuccsessMessage from '../../hooks/SuccsessMessage';
import useErrorMessage from '../../hooks/ErrorMessage';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { theme } = useTheme();
  const { succsessMessage, showSuccessMessage, succsessMessageStyle } = useSuccsessMessage();
  const { errorMessage, showError, errorMessageStyle } = useErrorMessage();


  const dispatch = useAppDispatch();
  const user = useAppSelector((state: AppState) => state.userRegister.user) as LoggedInUser;
  const userData = user.userData as UserData
  const data = localStorage.getItem("userInformation");
  // const userId = userData.id //gives ID and error at the same time

  console.log("data", data)
  console.log("user", user)
  console.log("userData",userData)


  const firstNameInput = useInput();
  const lastNameInput = useInput();
  const emailInput = useInput();

  // useEffect(() => {
  //   if (userData) {
  //     dispatch(getSingleUser(userId));
  //   }
  // }, [userId, dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(getSingleUser(user.id));
    }
  }, [user.id, dispatch]);


  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user) {
      if(!/\S+@\S+\.\S+/.test(emailInput.value)) {
        return showError('Incorrect email format')
      }
      
      const updatedUser: UserData = {
        // ...user.userData,
        ...user,
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        email: emailInput.value,
        // id: user.userData.id
        id: user.id
      };
      
      dispatch(updateUserProfile(updatedUser));

      
      localStorage.setItem('userInformation', JSON.stringify(updatedUser));// gives old data but changes DB

      showSuccessMessage('Your information has been changed successfully')
    }
  };

  const handleSwitchRole = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(user) {
      dispatch(switchRole(user))
      localStorage.setItem('userInformation', JSON.stringify(user));
      showSuccessMessage('You have bocome an admin')
    }
  }

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
          <img style={{ borderRadius: '5px', width: '150px' }} src={user.avatar} alt="" />
          <h1>Hello, {user.firstName}</h1>
          <form onSubmit={handleUpdateUser} style={{ width: '100%', maxWidth: '400px' }}>
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
          <form onSubmit={handleSwitchRole} style={{ width: '100%', maxWidth: '400px', marginTop: '15px' }}>
            <Button type="submit" variant="outlined" color="primary">
              Switch role
            </Button>
          </form>
        </div>
      )}
    </div>
  );
  
  
}

