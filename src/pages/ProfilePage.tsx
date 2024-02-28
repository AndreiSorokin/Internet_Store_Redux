import { AppState, useAppDispatch, useAppSelector } from '../redux/store';
import { useTheme } from '../components/contextAPI/ThemeContext';
import { updateUserProfile } from '../redux/slices/userSlice';
import { LoggedInUser } from '../misc/type';
import { useState } from 'react';
import { Button, TextField } from '@mui/material';

export default function ProfilePage() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: AppState) => state.userRegister.user) as LoggedInUser;
  const [updatedUser, setUpdatedUser] = useState<LoggedInUser>({
    ...user,
  });
  const [isAdmin, setIsAdmin] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // const becomeAdmin = () => {
  //   dispatch(updateUserProfile(updatedUser));
  //   localStorage.setItem('userInformation', JSON.stringify(updatedUser));
  // };

  const becomeAdmin = () => {
    if (user) {
      const updatedUser: LoggedInUser = { ...user, role: 'admin' };
      dispatch(updateUserProfile(updatedUser));
      setIsAdmin(true);
      localStorage.setItem('userInformation', JSON.stringify(updatedUser));
    }
  };

  return (
    <div>
      {user && (
        <div
          style={{
            backgroundColor: theme === 'bright' ? 'white' : 'black',
            color: theme === 'bright' ? 'black' : 'white',
            height: '100vh',
            paddingTop: '20vh',
          }}
        >
          <img src={user.avatar} alt="" />
          <h1>Hello, {user.name}</h1>
          <form onSubmit={becomeAdmin}>
            <TextField
              name="name"
              label="Name"
              value={updatedUser.name}
              onChange={handleInputChange}
              variant="outlined"
              margin="normal"
              fullWidth
            />
            <TextField
              name="email"
              label="Email"
              value={updatedUser.email}
              onChange={handleInputChange}
              variant="outlined"
              margin="normal"
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary">
              Apply Changes
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
