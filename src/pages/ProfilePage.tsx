import React from 'react'
import {
  BrowserRouter as Router, Link
} from 'react-router-dom'
import { AppState, useAppSelector } from '../redux/store'
import { Button } from '@mui/material'

export default function ProfilePage() {
  const user = useAppSelector((state: AppState) => state.userRegister.user)

  if(!user) {
    return <div>
      To access this page first
      <Link to="/auth/login">
        <Button sx={{ display: { xs: 'none', md: 'block' } }}>Log in</Button>
      </Link>
    </div>
  }
  return (
    <div>
      <img src={user.avatar} alt="" />
      <h1>Hello, {user.name}</h1>
    </div>
  )
}
