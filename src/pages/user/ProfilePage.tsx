import { AppState, useAppDispatch, useAppSelector } from '../../redux/store';
import { useTheme } from '../../components/contextAPI/ThemeContext';
import { switchRole, updateUserProfile } from '../../redux/slices/userSlice';
import { LoggedInUser } from '../../misc/type';
import  useInput  from '../../hooks/UseInput';

import { Button, TextField } from '@mui/material';
import useSuccsessMessage from '../../hooks/SuccsessMessage';
import useErrorMessage from '../../hooks/ErrorMessage';

export default function ProfilePage() {
  const { theme } = useTheme();
  const { succsessMessage, showSuccessMessage, succsessMessageStyle } = useSuccsessMessage();
  const { errorMessage, showError, errorMessageStyle } = useErrorMessage();


  const dispatch = useAppDispatch();
  const user = useAppSelector((state: AppState) => state.userRegister.user) as LoggedInUser;
  const userData = user.userData
  console.log('userData', userData)

  const firstNameInput = useInput();
  const emailInput = useInput();

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user) {
      if(!/\S+@\S+\.\S+/.test(emailInput.value)) {
        return showError('Incorrect email format')
      }
      
      const updatedUser: LoggedInUser = {
        ...user,
        firstName: firstNameInput.value,
        email: emailInput.value
      };
      dispatch(updateUserProfile(updatedUser));

      localStorage.setItem('userInformation', JSON.stringify(updatedUser));
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
          <img style={{ borderRadius: '5px', width: '150px' }} src={userData.avatar} alt="" />
          <h1>Hello, {userData.firstName}</h1>
          <form onSubmit={handleUpdateUser} style={{ width: '100%', maxWidth: '400px' }}>
            <TextField
              placeholder={userData.firstName}
              name="name"
              label="Name"
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

