import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import { useTheme } from '../components/contextAPI/ThemeContext';
import { AppState, useAppDispatch, useAppSelector } from '../redux/store';
import { fetchOrdersByUserId } from '../redux/slices/orderSlice';

import { Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import parseJwt from '../helpers/decode';

interface ExpandedOrders {
   [key: string]: boolean;
}

export default function Orders() {
   const { theme } = useTheme();
   const dispatch = useAppDispatch();
   const userData = parseJwt(localStorage.getItem('token'));
   const orders = useAppSelector((state: AppState) => state.orders.orders);
   const userId =userData?.id

   useEffect(() => {
      if (userId) {
         dispatch(fetchOrdersByUserId(userId));
      }
   }, [dispatch]);

   const [expandedOrders, setExpandedOrders] = useState<ExpandedOrders>({});
   
   const toggleOrderExpansion = (orderId: number) => {
  setExpandedOrders(prevState => ({
    ...prevState,
    [orderId]: !prevState[orderId]
  }));
};


   return (
      <Grid container justifyContent="center" alignItems="center" style={{
            background: theme === 'bright' ? 'linear-gradient(to bottom, #B8B8B8  0%, #9C9C9C 25%, #7B7B7B 50%, #353535 100%)' : 'linear-gradient(to bottom, #444444 18%, #414141 38%, #3C3C3C 56%, #212121 97%)',
            color: theme === "bright" ? "black" : "#E9E9E9",
            minHeight: '100vh',
            transition: '0.5s ease',
            paddingTop: '20vh'
         }}>
         <Grid item xs={12} md={8} lg={6}>
            {orders.length === 0 ? (
               <div style={{ textAlign: 'center' }}>
               <Typography variant="h4" gutterBottom>No orders yet</Typography>
               <Link to="/products" style={{ textDecoration: 'none' }}>
                  <Button
                  sx={{ 
                    color: 'white', border: '2px solid #5F2E2E', 
                    fontSize: '15px', 
                    padding: { xs: '5px 10px', sm: '8px 15px' },
                    backgroundColor: '#5F2E2E',
                    '&:hover': {
                      borderColor: '#5F2E2E',
                      transition: '0.5s ease'
                    }
                  }}
                  >Shop now</Button>
               </Link>
            </div>
            ) : (
               <div>
               <Typography variant="h4" gutterBottom textAlign="center">Your orders</Typography>
              {orders.map(o => (
                 <Card key={o.id} sx={{ marginBottom: 2 }}>
                   <CardContent sx={{color: theme === "bright" ? "black" : "white", backgroundColor: theme === "bright" ? "#9C9C9C" : "#353535"}}>
                     <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                       <Grid item xs={12}>
                         <Typography variant="h5" sx={{ cursor: 'pointer' }} onClick={() => toggleOrderExpansion(o.id)}>
                           Order #{o.id} {expandedOrders[o.id.toString()] ? '▲' : '▼'}
                         </Typography>
                       </Grid>
                       {expandedOrders[o.id.toString()] && o.orderItems.map((item, index) => (
                         item.productId ? (
                           <React.Fragment key={index}>
                             <Grid item xs={4}>
                               <CardMedia
                                 component="img"
                                 image={item.productId.images && item.productId.images.length > 0 ? item.productId.images[0] : ''}
                                 alt={item.productId.name}
                                 sx={{ width: '100%', height: 'auto', backgroundColor: theme === "bright" ? "white" : "black" }}
                               />
                             </Grid>
                             <Grid item xs={8}>
                               <Typography variant="h6">{item.productId.name}</Typography>
                               <Typography variant="body1">Price: ${item.productId.price}</Typography>
                               <Typography variant="body1">Size: {item.productId.size}</Typography>
                               <Typography variant="body1">Quantity: {item.quantity}</Typography>
                             </Grid>
                           </React.Fragment>
                         ) : null
                       ))}
                     </Grid>
                   </CardContent>
                 </Card>
               ))}
            </div>
            )}
         </Grid>
      </Grid>
   );
}
