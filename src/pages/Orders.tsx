import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';

import { useTheme } from '../components/contextAPI/ThemeContext';
import { AppState, useAppDispatch, useAppSelector } from '../redux/store';
import { LoggedInUser } from '../misc/type';
import { fetchOrdersByUserId } from '../redux/slices/orderSlice';

import { Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';

export default function Orders() {
   const { theme } = useTheme();
   const dispatch = useAppDispatch();
   const user = useAppSelector((state: AppState) => state.userRegister.user) as LoggedInUser;
   const userData = user?.userData as LoggedInUser
   const orders = useAppSelector((state: AppState) => state.orders.orders);
   const userId =userData?.id

   console.log(orders)

   useEffect(() => {
      if (userId) {
         dispatch(fetchOrdersByUserId(userId));
      }
   }, [dispatch]);

   
   return (
      <Grid container justifyContent="center" alignItems="center" style={{
            backgroundColor: theme === "bright" ? "white" : "black",
            color: theme === "bright" ? "black" : "white",
            minHeight: '100vh',
            transition: '0.5s ease',
            paddingTop: '20vh'
         }}>
         <Grid item xs={12} md={8} lg={6}>
            {orders.length === 0 ? (
               <div style={{ textAlign: 'center' }}>
               <Typography variant="h4" gutterBottom>No orders yet</Typography>
               <Link to="/products" style={{ textDecoration: 'none' }}>
                  <Button variant="outlined">Shop now</Button>
               </Link>
            </div>
            ) : (
               <div>
               <Typography variant="h4" gutterBottom textAlign="center">Your orders</Typography>
               {orders.map(o => (
                  <Card key={o.id} sx={{ marginBottom: 2 }}>
                     {o.orderItems.map((item, index) => (
                        <CardContent key={index} sx={{color: theme === "bright" ? "black" : "white", backgroundColor: theme === "bright" ? "white" : "black", border: theme === "bright" ? "none" : "1px solid white", borderRadius: '5px'}}>
                           <Grid container spacing={2} alignItems="center">
                           <Grid item xs={4}>
                              <CardMedia
                                 component="img"
                                 image={item.productId.images?.[0] || ''}
                                 alt={item.productId.name}
                                 style={{ width: '100%', height: 'auto', backgroundColor: theme === "bright" ? "white" : "black" }}
                              />
                           </Grid>
                           <Grid item xs={8}>
                              <Typography variant="h6">{item.productId.name}</Typography>
                              <Typography variant="body1">Price: ${item.productId.price}</Typography>
                              <Typography variant="body1">Size: {item.productId.size}</Typography>
                              <Typography variant="body1">Quantity: {item.quantity}</Typography>
                           </Grid>
                        </Grid>
                        </CardContent>
                     ))}
                  </Card>
               ))}
            </div>
            )}
         </Grid>
      </Grid>
   );
}
