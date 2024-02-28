import React from 'react'
import {
  BrowserRouter as Router, Link
} from 'react-router-dom'
import { AppState, useAppSelector } from '../redux/store'
import { Button } from '@mui/material'
import { useTheme } from '../components/contextAPI/ThemeContext';

export default function ProfilePage() {
  const { theme } = useTheme();
  
  const user = useAppSelector((state: AppState) => state.userRegister.user)

  if(!user) {
    return <div style={{
        backgroundColor: theme === "bright" ? "white" : "black",
        color: theme === "bright" ? "black" : "white",
        height: '100vh',
        paddingTop: '20vh'
      }}>
        To access this page first
        <Link to="/auth/login">
          <Button sx={{ display: { xs: 'none', md: 'block' } }}>Log in</Button>
        </Link>
      </div>
  }
  console.log('user',user)
  return (
    <div style={{
      backgroundColor: theme === "bright" ? "white" : "black",
      color: theme === "bright" ? "black" : "white",
      height: '100vh',
      paddingTop: '20vh'
    }}>
      <img src={user.avatar} alt="" />
      <h1>Hello, {user.name}</h1>
    </div>
  )
}
