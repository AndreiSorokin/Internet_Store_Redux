import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { getSingleUser, assignAdminRole, removeAdminRole, updateUserStatus } from '../../redux/slices/userSlice';

import { Avatar, Box, Typography, IconButton, Button } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from '../../components/contextAPI/ThemeContext';
import { UserStatus } from '../../misc/type';

export default function SingleUserPage() {
   const { theme } = useTheme();
   const { id } = useParams<{ id: string }>();
   const dispatch = useAppDispatch();
   const users = useAppSelector((state) => state.userRegister.users);

   useEffect(() => {
      if (id && !isNaN(Number(id))) {
         dispatch(getSingleUser(id));
      } 
   }, [dispatch, id]);

   const viewedUser = users.find(user => user.id.toString() === id);

   const handleAssignAdmin = () => {
      if(viewedUser) {
         dispatch(assignAdminRole({ id: viewedUser.id, role: "ADMIN" }));
      }
   };

   const handleRemoveAdmin = () => {
      if(viewedUser) {
         dispatch(removeAdminRole({ id: viewedUser.id, role: "CUSTOMER" }));
      }
   };

   const handleBanUser = () => {
   if(viewedUser) {
      dispatch(updateUserStatus({ id: viewedUser.id, status: UserStatus.INACTIVE }));   }
   };

const handleUnbanUser = () => {
   if(viewedUser) {
      dispatch(updateUserStatus({ id: viewedUser.id, status: UserStatus.ACTIVE }));
   }
};

   return (
      <div style={{
            backgroundColor: theme === "bright" ? "white" : "black",
            color: theme === "bright" ? "black" : "white",
            width: '100vw',
            height: '100vh'
         }}>
            <Link to="/auth/admin" style={{ textDecoration: "none" }}>
               <IconButton sx={{ position: 'absolute', top: '15vh', left: '2vw', color: theme === 'bright' ? 'black' : 'white' }}>
                  <ArrowBackIcon />
                  Back
               </IconButton>
            </Link>
         {viewedUser ? (
            <Box
               sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: { xs: '90%', sm: '80%', md: '60%', lg: '40%', xl: '30%' },
                  p: { xs: 2, sm: 3, md: 4 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  boxShadow: 'none',
                  backgroundColor: theme === "bright" ? "white" : "black",
                  color: theme === "bright" ? "black" : "white",
               }}
            >
               <Avatar
                  src={viewedUser.avatar}
                  alt=""
                  sx={{ 
                     width: { xs: '70%', sm: '80%', md: '90%' },
                     height: { xs: '70%', sm: '80%', md: '90%' }
                  }}
               />
               <Typography variant="h4">Name: {viewedUser.firstName} {viewedUser.lastName}</Typography>
               <Typography variant="h6">Email: {viewedUser.email}</Typography>
               <Typography variant="h6">Status: {viewedUser.status}</Typography>
               <Typography variant="h6">Role: {viewedUser.role}</Typography>
               {viewedUser.role === "ADMIN" ? (
                  <Button onClick={handleRemoveAdmin} variant="outlined" color="primary">
                     Remove Admin Role
                  </Button>
               ) : (
                  <Button onClick={handleAssignAdmin} variant="outlined" color="primary">
                     Assign Admin Role
                  </Button>
               )}
               {viewedUser.status === "INACTIVE" ? (
                  <Button onClick={handleUnbanUser} variant="outlined" color="secondary" style={{marginTop: '10px'}}>
                     Unban User
                  </Button>
               ) : (
                  <Button onClick={handleBanUser} variant="outlined" color="secondary" style={{marginTop: '10px'}}>
                     Ban User
                  </Button>
               )}
            </Box>
         ) : (
            <Typography>Loading user information...</Typography>
         )}
      </div>
   );
}