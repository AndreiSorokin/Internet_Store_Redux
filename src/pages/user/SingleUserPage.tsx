import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { getSingleUser, assignAdminRole, removeAdminRole, updateUserStatus } from '../../redux/slices/userSlice';

import { Avatar, Box, Typography, IconButton, Button } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from '../../components/contextAPI/ThemeContext';
import { UserStatus } from '../../misc/type';

import defaultPicture from "../../img/defaultPicture.png"

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
       background: theme === 'bright' ? 'linear-gradient(to bottom, #B8B8B8  0%, #9C9C9C 25%, #7B7B7B 50%, #353535 100%)' : 'linear-gradient(to bottom, #444444 18%, #414141 38%, #3C3C3C 56%, #212121 97%)',
       color: theme === "bright" ? "black" : "#E9E9E9",
       minHeight: '100vh',
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
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 2,
                  boxShadow: 'none',
               }}
            >
               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    src={viewedUser.avatar || defaultPicture}
                    alt="User's avatar"
                    sx={{ 
                       width: 250,
                       height: 250 
                    }}
                 />
                 <Typography variant="h6">Name: {viewedUser.firstName} {viewedUser.lastName}</Typography>
                 <Typography variant="h6">Email: {viewedUser.email}</Typography>
                 <Typography variant="h6">Status: {viewedUser.status}</Typography>
                 <Typography variant="h6">Role: {viewedUser.role}</Typography>
               </Box>
               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                 {viewedUser.role === "ADMIN" ? (
                    <Button onClick={handleRemoveAdmin}
                    sx={{ 
                     color: '#E9E9E9', border: '2px solid #5F2E2E', 
                     marginRight: '1vw',
                     backgroundColor: '#5F2E2E',
                     '&:hover': {
                           borderColor: '#5F2E2E'
                     }
                  }}>
                       Remove Admin Role
                    </Button>
                 ) : (
                    <Button onClick={handleAssignAdmin}
                    sx={{ 
                     color: '#E9E9E9', border: '2px solid #5F2E2E', 
                     marginRight: '1vw',
                     backgroundColor: '#5F2E2E',
                     '&:hover': {
                           borderColor: '#5F2E2E'
                     }
                  }}>
                       Assign Admin Role
                    </Button>
                 )}
                 {viewedUser.status === "INACTIVE" ? (
                    <Button onClick={handleUnbanUser} 
                    sx={{ 
                     color: '#E9E9E9', border: '2px solid #5F2E2E', 
                     marginRight: '1vw',
                     backgroundColor: '#5F2E2E',
                     '&:hover': {
                           borderColor: '#5F2E2E'
                     }
                  }}
                    >
                       Unban User
                    </Button>
                 ) : (
                    <Button onClick={handleBanUser}
                    sx={{ 
                     color: '#E9E9E9', border: '2px solid #5F2E2E', 
                     marginRight: '1vw',
                     backgroundColor: '#5F2E2E',
                     '&:hover': {
                           borderColor: '#5F2E2E'
                     }
                  }}
                    >
                       Ban User
                    </Button>
                 )}
               </Box>
            </Box>
         ) : (
            <Typography>Loading user information...</Typography>
         )}
      </div>
   );
}