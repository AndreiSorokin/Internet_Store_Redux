// import React from 'react'
// import {
//    BrowserRouter as Router,
//    Routes, Link, Route
// } from 'react-router-dom'

// // import Button from '@mui/material/Button';
// import { AppBar, Toolbar, Typography, Button } from '@mui/material';
// import ButtonGroup from '@mui/material-next/ButtonGroup';

// export default function NavBar() {
//    return (
//       <div>
//          <AppBar sx={{ backgroundColor: 'white' }}>
//             <div style={{ textShadow: '3px 2px black' }}>
//                <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
//                      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//                         <div style={{fontSize: '30px'}}>
//                            <span style={{ color: 'white' }}>T</span>he <span style={{ color: 'white' }}>S</span>tore
//                         </div>
//                      </Typography>
//                   <ButtonGroup variant="elevated" aria-label="Basic button group">
//                      <Link to="/"><Button>Profile</Button></Link>
//                      <Link to="/products"><Button>Products</Button></Link>
//                      <Link to="/cart"><Button>Cart</Button></Link>
//                   </ButtonGroup>
//                   <Link to="/login"><Button>Log in</Button></Link>
//                </Toolbar>
//             </div>
//          </AppBar>
//       </div>
//    )
// }
import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import ButtonGroup from '@mui/material-next/ButtonGroup';

export default function NavBar() {
   return (
      <div style={{marginBottom:'100px'}}>
         <AppBar sx={{ backgroundColor: 'white' }}>
            <div style={{ textShadow: '3px 2px black' }}>
               <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                     <div style={{fontSize: '30px'}}>
                        <span style={{ color: 'white' }}>T</span>he <span style={{ color: 'white' }}>S</span>tore
                     </div>
                  </Typography>
                  <ButtonGroup variant="elevated" aria-label="Basic button group">
                     <Link to="/"><Button>Profile</Button></Link>
                     <Link to="/products"><Button>Products</Button></Link>
                     <Link to="/cart"><Button>Cart</Button></Link>
                  </ButtonGroup>
                  <Link to="/login"><Button>Log in</Button></Link>
               </Toolbar>
            </div>
         </AppBar>
      </div>
   );
}
