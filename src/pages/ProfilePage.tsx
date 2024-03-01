import { AppState, useAppDispatch, useAppSelector } from '../redux/store';
import { useTheme } from '../components/contextAPI/ThemeContext';
import { updateUserProfile } from '../redux/slices/userSlice';
import { LoggedInUser } from '../misc/type';
import  useInput  from '../hooks/UseInput';

import { Button, TextField } from '@mui/material';

export default function ProfilePage() {
  const { theme } = useTheme();

  const dispatch = useAppDispatch();
  const user = useAppSelector((state: AppState) => state.userRegister.user) as LoggedInUser;

  const nameInput = useInput();
  const emailInput = useInput();

  const becomeAdmin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      const updatedUser: LoggedInUser = {
        ...user,
        name: nameInput.value,
        email: emailInput.value
      };
      dispatch(updateUserProfile(updatedUser));

      localStorage.setItem('userInformation', JSON.stringify(updatedUser));
    }
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
      }}
    >
      {user && (
        <div style={{ textAlign: 'center' }}>
          <img style={{ borderRadius: '5px', width: '150px' }} src={user.avatar} alt="" />
          <h1>Hello, {user.name}</h1>
          <form onSubmit={becomeAdmin} style={{ width: '100%', maxWidth: '400px' }}>
            <TextField
              name="name"
              label="Name"
              value={nameInput.value}
              onChange={nameInput.onChange}
              variant="outlined"
              margin="normal"
              fullWidth
              InputProps={{
                style: {
                  color: theme === 'bright' ? 'black' : 'white',
                },
                }}
                sx={{ margin: "2vh", width: "100%", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                color: theme === 'bright' ? 'black' : 'white',
                } }}
            />
            <TextField
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
                sx={{ margin: "2vh", width: "100%", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                color: theme === 'bright' ? 'black' : 'white',
                } }}
            />
            <Button type="submit" variant="outlined" color="primary">
              Apply Changes
            </Button>
          </form>
        </div>
      )}
    </div>
  );
  
  
}
