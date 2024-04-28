import React, { useEffect } from 'react';
import { AppState, useAppDispatch, useAppSelector } from '../../redux/store';
import { fetchAllUsers } from '../../redux/slices/userSlice';
import { useTheme } from '../contextAPI/ThemeContext';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

import defaultPicture from "../../img/defaultPicture.png"


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
        <img src={user.avatar || defaultPicture} alt="User's avatar" style={{ marginRight: '20px', width: '150px', height: '150px' }} />
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '10px', color: theme === "bright" ? "black" : "white" }}>{user.email}</div>
          <Link to={`/user/${user?.id}`} style={{ display: 'block', marginBottom: '10px' }}>
            <Button variant="outlined" 
            sx={{ 
              color: '#E9E9E9', border: '2px solid #5F2E2E', 
              marginRight: '1vw',
              backgroundColor: '#5F2E2E',
              '&:hover': {
                    borderColor: '#5F2E2E'
              }
           }}
            >
              View
            </Button>
          </Link>
        </div>
      </div>
    ))}
  </div>
)
}
