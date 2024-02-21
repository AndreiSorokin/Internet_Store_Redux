import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import ButtonGroup from '@mui/material-next/ButtonGroup';
import { Link } from 'react-router-dom';

const Navbar = () => {
   const [showMenu, setShowMenu] = useState(false);

   const toggleMenu = () => {
      setShowMenu(!showMenu);
   };

   return (
      <div style={{ marginBottom: '100px' }}>
      <AppBar sx={{ backgroundColor: 'white' }}>
         <div style={{ textShadow: '3px 2px black' }}>
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
            <Link to="/login">
               <Button sx={{ display: { xs: 'none', md: 'block' } }}>Log in</Button>
            </Link>
            </Toolbar>
         </div>
         {showMenu && (
            <div style={{ backgroundColor: 'white', padding: '10px', textAlign: 'center', borderTop: '1px solid black' }}>
            <Link to="/">
               <Button variant="outlined" onClick={toggleMenu}>
                  Profile
               </Button>
            </Link>
            <Link to="/products">
               <Button variant="outlined" onClick={toggleMenu}>
                  Products
               </Button>
            </Link>
            <Link to="/cart">
               <Button variant="outlined" onClick={toggleMenu}>
                  Cart
               </Button>
            </Link>
            <Link to="/login">
               <Button variant="outlined" onClick={toggleMenu}>
                  Log in
               </Button>
            </Link>
            </div>
         )}
      </AppBar>
      </div>
   );
};

export default Navbar;
