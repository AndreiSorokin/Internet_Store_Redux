import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { getSingleUser } from '../../redux/slices/userSlice';

import { Avatar, Box, Typography, IconButton  } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from '../../components/contextAPI/ThemeContext';

export default function SingleUserPage() {
   const { theme } = useTheme();
   const { id } = useParams<{ id: string }>();
   const dispatch = useAppDispatch();
   // Removed the line that selects the logged-in user's information
   const users = useAppSelector((state) => state.userRegister.users); // Assuming this is an array of users

   useEffect(() => {
      if (id && !isNaN(Number(id))) {
         dispatch(getSingleUser(id));
      } 
   }, [dispatch, id]);

   // Find the user based on the id parameter from the URL
   const viewedUser = users.find(user => user.id.toString() === id);
   console.log(viewedUser)

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
               <Typography variant="h4" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem', lg: '2.5rem' } }}>Name: {viewedUser.firstName} {viewedUser.lastName}</Typography>
               <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}>Email: {viewedUser.email}</Typography>
               <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}>Status: {viewedUser.status}</Typography>
               <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}>Role: {viewedUser.role}</Typography>
            </Box>
         ) : (
            <Typography variant="h5" sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.5rem' } }}>Loading user information...</Typography>
         )}
      </div>
   );
}