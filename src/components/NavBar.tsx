import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import ButtonGroup from '@mui/material-next/ButtonGroup';
import { Link, useNavigate } from 'react-router-dom';
import ThemeProvider, { useTheme } from './contextAPI/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { clearUser, userLogout } from '../redux/slices/userSlice';

const Navbar = () => {
   const user = useAppSelector((state) => state.userRegister.user);
   const dispatch = useAppDispatch();
   const navigate = useNavigate()
   
   const [showMenu, setShowMenu] = useState(false);
   const { toggleTheme, theme } = useTheme();

   const boxShadowLight = '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)';
   const boxShadowDark = '0px 2px 4px -1px rgba(255,255,255,0.2), 0px 4px 5px 0px rgba(255,255,255,0.14), 0px 1px 10px 0px rgba(255,255,255,0.12)';

   const boxShadow = theme === 'dark' ? boxShadowDark : boxShadowLight;

   const toggleMenu = () => {
      setShowMenu(!showMenu);
   };

   const handleLogout = () => {
      dispatch(userLogout());
      navigate('/auth/login');
   };

   return (
      <ThemeProvider>
         <div>
            <AppBar style={{
               backgroundColor: theme === "bright" ? "white" : "black",
               color: theme === "bright" ? "black" : "white", boxShadow
               }} >
               <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                     <div style={{ fontSize: '30px' }}>
                        <span>T</span>he <span>S</span>tore
                     </div>
                  </Typography>
                  <Button onClick={toggleMenu} sx={{ display: { xs: 'block', md: 'none' } }}>
                     Menu
                  </Button>
                  <ButtonGroup variant="elevated" aria-label="Basic button group" sx={{ display: { xs: 'none', md: 'flex' } }}>
                     {user &&
                        <Link to="/">
                           <Button>Profile</Button>
                        </Link>   
                     }
                     <Link to="/products">
                        <Button>Products</Button>
                     </Link>
                     {user &&
                        <Link to="/cart">
                           <Button>Cart</Button>
                        </Link>
                     }
                  </ButtonGroup>
                  {user ? (
                     <Button onClick={handleLogout} sx={{ display: { xs: 'none', md: 'block' } }}>Log out</Button>
                  ) : (
                     <Link to="/auth/login">
                        <Button sx={{ display: { xs: 'none', md: 'block' } }}>Log in</Button>
                     </Link>
                  )}
                  <IconButton onClick={toggleTheme}>
                     {theme === 'bright' ? <Brightness4Icon /> : <Brightness7Icon sx={{ color: 'white' }} />}
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
                     {user &&
                        <Link to="/cart">
                           <Button variant="outlined" onClick={toggleMenu} style={{ color: theme === "bright" ? "black" : "white" }}>
                              Cart
                           </Button>
                        </Link>
                     }
                     {user ? (
                        <Link to="/auth/login">
                           <Button variant="outlined" onClick={handleLogout} style={{ color: theme === "bright" ? "black" : "white" }}>
                              Log out
                           </Button>
                        </Link>
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
      </ThemeProvider>
   );
};

export default Navbar;