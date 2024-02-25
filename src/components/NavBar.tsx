import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import ButtonGroup from '@mui/material-next/ButtonGroup';
import { Link } from 'react-router-dom';
import { useTheme } from './contextAPI/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { userLogout } from '../redux/slices/userSlice';

const Navbar = () => {
   const user = useAppSelector((state) => state.userRegister.user);
   const dispatch = useAppDispatch();
   
   const [showMenu, setShowMenu] = useState(false);
   const { toggleTheme, theme } = useTheme();

   const toggleMenu = () => {
      setShowMenu(!showMenu);
   };

   const handleLogout = () => {
      dispatch(userLogout());
   };

   return (
      <div style={{
         backgroundColor: theme === "bright" ? "white" : "black",
         color: theme === "bright" ? "black" : "white",
         }}>
         <p style={{height:'50px'}}>{theme}</p>
         <div style={{ marginBottom: '100px' }}>
            <AppBar sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
               <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                     <div style={{ fontSize: '30px' }}>
                        <span style={{ color: 'white' }}>T</span>he <span style={{ color: 'white' }}>S</span>tore
                     </div>
                  </Typography>
                  <Button onClick={toggleMenu} sx={{ display: { xs: 'block', md: 'none' } }}>
                     Menu
                  </Button>
                  <ButtonGroup variant="elevated" aria-label="Basic button group" sx={{ display: { xs: 'none', md: 'flex' } }}>
                     <Link to="/">
                        <Button>Profile</Button>
                     </Link>
                     <Link to="/products">
                        <Button>Products</Button>
                     </Link>
                     <Link to="/cart">
                        <Button>Cart</Button>
                     </Link>
                  </ButtonGroup>
                  {user ? (
                     <Button onClick={handleLogout} sx={{ display: { xs: 'none', md: 'block' } }}>Log out</Button>
                  ) : (
                     <Link to="/auth/login">
                        <Button sx={{ display: { xs: 'none', md: 'block' } }}>Log in</Button>
                     </Link>
                  )}
                  <IconButton onClick={toggleTheme} sx={{ color: 'white' }}>
                     {theme === 'bright' ? <Brightness4Icon /> : <Brightness7Icon />}
                  </IconButton>
               </Toolbar>
               {showMenu && (
                  <div style={{ backgroundColor: theme === "bright" ? "white" : "black", padding: '10px', textAlign: 'center', borderTop: '1px solid black' }}>
                     <Link to="/">
                        <Button variant="outlined" onClick={toggleMenu} style={{ color: theme === "bright" ? "black" : "white" }}>
                           Profile
                        </Button>
                     </Link>
                     <Link to="/products">
                        <Button variant="outlined" onClick={toggleMenu} style={{ color: theme === "bright" ? "black" : "white" }}>
                           Products
                        </Button>
                     </Link>
                     <Link to="/cart">
                        <Button variant="outlined" onClick={toggleMenu} style={{ color: theme === "bright" ? "black" : "white" }}>
                           Cart
                        </Button>
                     </Link>
                     {user ? (
                        <Button variant="outlined" onClick={handleLogout} style={{ color: theme === "bright" ? "black" : "white" }}>
                           Log out
                        </Button>
                     ) : (
                        <Link to="/auth/login">
                           <Button variant="outlined" onClick={toggleMenu} style={{ color: theme === "bright" ? "black" : "white" }}>
                              Log in
                           </Button>
                        </Link>
                     )}
                  </div>
               )}
            </AppBar>
         </div>
      </div>
   );
};

export default Navbar;