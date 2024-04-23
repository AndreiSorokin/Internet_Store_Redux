import React, { useEffect } from 'react';
import { AppState, useAppDispatch, useAppSelector } from '../../redux/store';
import { LoggedInUser } from '../../misc/type';
import { fetchAllUsers } from '../../redux/slices/userSlice';
import { useTheme } from '../contextAPI/ThemeContext';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';


export default function UserList() {
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const users = useAppSelector((state: AppState) => state.userRegister.users);

    useEffect(() => {
      dispatch(fetchAllUsers());
    }, [dispatch]);
    
return (
  <div>
    {users.map(user => (
      <div key={user.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <img src={user.avatar} alt="User's avatar" style={{ marginRight: '20px', width: '150px', height: '150px' }} />
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '10px', color: theme === "bright" ? "black" : "white" }}>{user.email}</div>
          <Link to={`/user/${user?.id}`} style={{ display: 'block', marginBottom: '10px' }}>
            <Button variant="outlined" style={{ marginRight: '10px' }}>
              View
            </Button>
          </Link>
        </div>
      </div>
    ))}
  </div>
)
}
