import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import ButtonGroup from '@mui/material-next/ButtonGroup';
import { Link, useNavigate } from 'react-router-dom';
import ThemeProvider, { useTheme } from './contextAPI/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAppDispatch } from '../redux/store';
import { userLogout } from '../redux/slices/userSlice';
import { clearCart } from '../redux/slices/cartSlice';
import parseJwt from '../helpers/decode';

const Navbar = () => {
   const userData = parseJwt(localStorage.getItem('token'));
   const dispatch = useAppDispatch();
   const navigate = useNavigate();

   const isAdmin = userData?.role === 'ADMIN';
   
   const [showMenu, setShowMenu] = useState(false);
   const { toggleTheme, theme } = useTheme();

   const toggleMenu = () => {
      setShowMenu(!showMenu);
   };

   const handleLogout = () => {
      dispatch(userLogout());
      dispatch(clearCart());
      navigate('/auth/login');
   };

   return (
      <ThemeProvider>
         <div>
            <AppBar style={{
               backgroundColor: theme === 'bright' ? '#8F5E4E' : "#694134",
               color: theme === "bright" ? "black" : "#E9E9E9",
               transition: '0.5s ease'
               }} >
               <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                     <div style={{ fontSize: '23px' }}>
                        <span style={{fontFamily: '"Noto Serif Grantha", serif', fontSize: '40px' }}>T</span>he store
                     </div>
                  </Typography>
                  <Button onClick={toggleMenu} sx={{color: theme === 'bright' ? 'black' : '#E9E9E9', display: { xs: 'block', md: 'none' } }}>
                     Menu
                  </Button>
                  <ButtonGroup variant="elevated" aria-label="Basic button group" sx={{display: { xs: 'none', md: 'flex' } }}>
                     {userData &&
                        <Link to="/auth/profile">
                           <Button sx={{color: theme === 'bright' ? 'black' : '#E9E9E9'}}>Profile</Button>
                        </Link>   
                     }
                     <Link to="/products">
                        <Button sx={{color: theme === 'bright' ? 'black' : '#E9E9E9'}}>Products</Button>
                     </Link>
                     {userData &&
                        <Link to="/cart">
                           <Button sx={{color: theme === 'bright' ? 'black' : '#E9E9E9'}}>Cart</Button>
                        </Link>
                     }
                     {userData &&
                        <Link to="/orders">
                           <Button sx={{color: theme === 'bright' ? 'black' : '#E9E9E9'}}>Orders</Button>
                        </Link>
                     }
                     {isAdmin &&
                        <Link to="auth/admin">
                           <Button sx={{color: theme === 'bright' ? 'black' : '#E9E9E9'}}>Admin</Button>
                        </Link>
                     }
                  </ButtonGroup>
                  {userData ? (
                     <ButtonGroup variant="elevated" aria-label="Basic button group" sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Button onClick={handleLogout} sx={{color: theme === 'bright' ? 'black' : '#E9E9E9', display: { xs: 'none', md: 'block' } }}>Log out</Button>
                     </ButtonGroup>
                     ) : (
                        <ButtonGroup variant="elevated" aria-label="Basic button group" sx={{ display: { xs: 'none', md: 'flex' } }}>
                           <Link to="/auth/login" style={{textDecoration: 'none'}}>
                              <Button sx={{color: theme === 'bright' ? 'black' : '#E9E9E9', display: { xs: 'none', md: 'block' } }}>Log in</Button>
                           </Link>
                        </ButtonGroup>
                  )}
                  <IconButton onClick={toggleTheme}>
                     {theme === 'bright' ? <Brightness4Icon /> : <Brightness7Icon sx={{ color: '#E9E9E9' }} />}
                  </IconButton>
               </Toolbar>
               {showMenu && (
                  <div style={{ backgroundColor: theme === 'bright' ? '#8F5E4E' : "#694134", padding: '10px', textAlign: 'center', borderTop: '1px solid black' }}>
                     {userData &&
                        <Link to="/auth/profile">
                           <Button variant="outlined" onClick={toggleMenu} sx={{color: theme === "bright" ? "black" : "#E9E9E9", border: 'none', '&:hover': {backgroundColor: 'transparent', border: theme === "bright" ? "1px solid black" : "1px solid #E9E9E9" }}}>
                              Profile
                           </Button>
                        </Link>
                     }
                     <Link to="/products">
                        <Button variant="outlined" onClick={toggleMenu} sx={{color: theme === "bright" ? "black" : "#E9E9E9", border: 'none', '&:hover': {backgroundColor: 'transparent', border: theme === "bright" ? "1px solid black" : "1px solid #E9E9E9" }}}>
                           Products
                        </Button>
                     </Link>
                     {userData &&
                        <Link to="/cart">
                           <Button variant="outlined" onClick={toggleMenu} sx={{color: theme === "bright" ? "black" : "#E9E9E9", border: 'none', '&:hover': {backgroundColor: 'transparent', border: theme === "bright" ? "1px solid black" : "1px solid #E9E9E9" }}}>
                              Cart
                           </Button>
                        </Link>
                     }
                     {isAdmin &&
                        <Link to="auth/admin">
                           <Button variant="outlined" onClick={toggleMenu} sx={{color: theme === "bright" ? "black" : "#E9E9E9", border: 'none', '&:hover': {backgroundColor: 'transparent', border: theme === "bright" ? "1px solid black" : "1px solid #E9E9E9" }}}>Admin</Button>
                        </Link>
                     }
                     {userData ? (
                        <Link to="/auth/login">
                           <Button variant="outlined" onClick={handleLogout} sx={{color: theme === "bright" ? "black" : "#E9E9E9", border: 'none', '&:hover': {backgroundColor: 'transparent', border: theme === "bright" ? "1px solid black" : "1px solid #E9E9E9" }}}>
                              Log out
                           </Button>
                        </Link>
                     ) : (
                        <Link to="/auth/login">
                           <Button variant="outlined" sx={{color: theme === "bright" ? "black" : "#E9E9E9", border: 'none', '&:hover': {backgroundColor: 'transparent', border: theme === "bright" ? "1px solid black" : "1px solid #E9E9E9" }}}>
                              Log in
                           </Button>
                        </Link>
                     )}
                  </div>
               )}
            </AppBar>
         </div>
      </ThemeProvider>
   );
};

export default Navbar;