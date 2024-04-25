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

   const boxShadowLight = '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)';
   const boxShadowDark = '0px 2px 4px -1px rgba(255,255,255,0.2), 0px 4px 5px 0px rgba(255,255,255,0.14), 0px 1px 10px 0px rgba(255,255,255,0.12)';

   const boxShadow = theme === 'dark' ? boxShadowDark : boxShadowLight;

   return (
      <ThemeProvider>
         <div>
            <AppBar style={{
      background: theme === 'bright' ? 'linear-gradient(135deg, #F7C585, #F76B19)' : 'linear-gradient(135deg, #431C01, #72571D)',
      color: theme === "bright" ? "black" : "white", boxShadow,
               transition: '0.5s ease'
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
                     {userData &&
                        <Link to="/auth/profile">
                           <Button>Profile</Button>
                        </Link>   
                     }
                     <Link to="/products">
                        <Button>Products</Button>
                     </Link>
                     {userData &&
                        <Link to="/cart">
                           <Button>Cart</Button>
                        </Link>
                     }
                     {userData &&
                        <Link to="/orders">
                           <Button>Orders</Button>
                        </Link>
                     }
                     {isAdmin &&
                        <Link to="auth/admin">
                           <Button>Admin</Button>
                        </Link>
                     }
                  </ButtonGroup>
                  {userData ? (
                     <ButtonGroup variant="elevated" aria-label="Basic button group" sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Button onClick={handleLogout} sx={{ display: { xs: 'none', md: 'block' } }}>Log out</Button>
                     </ButtonGroup>
                     ) : (
                        <ButtonGroup variant="elevated" aria-label="Basic button group" sx={{ display: { xs: 'none', md: 'flex' } }}>
                           <Link to="/auth/login" style={{textDecoration: 'none'}}>
                              <Button sx={{ display: { xs: 'none', md: 'block' } }}>Log in</Button>
                           </Link>
                        </ButtonGroup>
                  )}
                  <IconButton onClick={toggleTheme}>
                     {theme === 'bright' ? <Brightness4Icon /> : <Brightness7Icon sx={{ color: 'white' }} />}
                  </IconButton>
               </Toolbar>
               {showMenu && (
                  <div style={{ backgroundColor: theme === "bright" ? "white" : "black", padding: '10px', textAlign: 'center', borderTop: '1px solid black' }}>
                     {userData &&
                        <Link to="/auth/profile">
                           <Button variant="outlined" onClick={toggleMenu} style={{ color: theme === "bright" ? "black" : "white" }}>
                              Profile
                           </Button>
                        </Link>
                     }
                     <Link to="/products">
                        <Button variant="outlined" onClick={toggleMenu} style={{ color: theme === "bright" ? "black" : "white" }}>
                           Products
                        </Button>
                     </Link>
                     {userData &&
                        <Link to="/cart">
                           <Button variant="outlined" onClick={toggleMenu} style={{ color: theme === "bright" ? "black" : "white" }}>
                              Cart
                           </Button>
                        </Link>
                     }
                     {isAdmin &&
                        <Link to="auth/admin">
                           <Button variant="outlined" onClick={toggleMenu} style={{ color: theme === "bright" ? "black" : "white" }}>Admin</Button>
                        </Link>
                     }
                     {userData ? (
                        <Link to="/auth/login">
                           <Button variant="outlined" onClick={handleLogout} style={{ color: theme === "bright" ? "black" : "white" }}>
                              Log out
                           </Button>
                        </Link>
                     ) : (
                        <Link to="/auth/login">
                           <Button variant="outlined" style={{ color: theme === "bright" ? "black" : "white" }}>
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