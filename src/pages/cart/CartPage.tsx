import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { AppState, useAppDispatch, useAppSelector } from '../../redux/store';
import { CartItem } from '../../misc/type';
import { updateCartItemQuantity, removeFromCart } from '../../redux/slices/cartSlice';
import { useTheme } from '../../components/contextAPI/ThemeContext'
import useSuccsessMessage from '../../hooks/SuccsessMessage';
import ScrollToTopButton from '../../components/utils/ScrollToTop';
import { createOrder, fetchOrdersByUserId } from '../../redux/slices/orderSlice';
import CheckoutForm from '../../components/utils/CheckoutForm';
import useErrorMessage from '../../hooks/ErrorMessage';

import { Box, Button, Grid } from '@mui/material';
import parseJwt from '../../helpers/decode';

const CartPage: React.FC = () => {
  const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);
  const { theme } = useTheme();
  const { succsessMessage, showSuccessMessage, succsessMessageStyle } = useSuccsessMessage()
  const { errorMessage, showError, errorMessageStyle } = useErrorMessage();

  const cartItems = useAppSelector((state: AppState) => state.cart.items);
  const dispatch = useAppDispatch();
  const userData = parseJwt(localStorage.getItem('token'));
  const userId =userData?.id

  useEffect(() => {
    if (userId) {
      dispatch(fetchOrdersByUserId(userId));
    }
  }, [dispatch]);

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartInformation');
    if (storedCartItems) {
      dispatch(updateCartItemQuantity(JSON.parse(storedCartItems)));
    }
  }, [dispatch]);

  const handleIncrementQuantity = (productId: number) => {
    const cartItem = cartItems.find(item => item.productId.id === productId);
    if (cartItem) {
      const newQuantity = cartItem.quantity + 1;
      dispatch(updateCartItemQuantity({ productId: productId, quantity: newQuantity }));
    }
  };

  const handleDecrementQuantity = (productId: number) => {
    const cartItem = cartItems.find(item => item.productId.id === productId);
    if (cartItem && cartItem.quantity > 1) {
      const newQuantity = cartItem.quantity - 1;
      dispatch(updateCartItemQuantity({ productId: productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId: number, productName: string) => {
    const answer = window.confirm(`Do you want to remove ${productName}?`);
    if(answer) {
      dispatch(removeFromCart(productId));
      showSuccessMessage(`Product ${cartItems.map(cartItem => cartItem.productId.name)} has been deleted`);
    }
  };

  const totalPrice = cartItems.reduce((total, cartItem) => {
    return total + cartItem.productId.price * cartItem.quantity;
  }, 0);

  return (
    <div style={{
      background: theme === 'bright' ? 'linear-gradient(to bottom, #B8B8B8  0%, #9C9C9C 25%, #7B7B7B 50%, #353535 100%)' : 'linear-gradient(to bottom, #444444 18%, #414141 38%, #3C3C3C 56%, #212121 97%)',
      color: theme === "bright" ? "black" : "#E9E9E9",
      minHeight: '100vh',
        paddingTop: '5vh',
        transition: '0.5s ease'
      }}>
        {succsessMessage && (
          <p style={succsessMessageStyle}>{succsessMessage}</p>
        )}
        {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          minHeight: "100vh",
          padding: "15vh",
          margin: "0 auto",
          maxWidth: "1200px"
        }}
      >
      {cartItems.length === 0 ? (
        <Grid item xs={12} textAlign="center">
          <h2 style={{fontSize: '36px'}}>Cart</h2>
          <p style={{fontSize: '24px'}}>Your cart is empty.</p>
          <Link to="/products">
            <Button
            sx={{ 
              color: 'white', border: '2px solid #5F2E2E', 
              fontSize: { xs: '0.8rem', sm: '1rem' }, 
              padding: { xs: '5px 10px', sm: '8px 15px' },
              backgroundColor: '#5F2E2E',
              '&:hover': {
                 borderColor: '#5F2E2E'
              }
           }}
            >Shop now</Button>
          </Link>
        </Grid>
      ) : (
        <div>
          <Grid item xs={12} textAlign="center">
            <h2>Cart</h2>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {cartItems.map((cartItem: CartItem, index: number) => (
                <Box key={index} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10vh' }}>
                  <img
                    src={cartItem.productId.category.image}
                    alt={cartItem.productId.name}
                    style={{ width: "180px", height: "200px" }}
                  />
                  <h3>{cartItem.productId.name}</h3>
                  <div>Price: ${cartItem.productId.price}</div>
                  <div>Quantity: {cartItem.quantity}</div>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '2vh 0' }}>
                      <Button
                        variant="outlined"
                        onClick={() => handleIncrementQuantity(cartItem.productId.id)}
                        sx={{ 
                          color: 'white', border: '2px solid #5F2E2E', 
                          fontSize: '15px', 
                          padding: { xs: '5px 10px', sm: '8px 15px' },
                          '&:hover': {
                            borderColor: '#5F2E2E',
                            backgroundColor: '#5F2E2E',
                            transition: '0.5s ease'
                          }
                        }}
                      >
                        +
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => handleDecrementQuantity(cartItem.productId.id)}
                        sx={{ 
                          color: 'white', border: '2px solid #5F2E2E', 
                          fontSize: '15px', 
                          padding: { xs: '5px 10px', sm: '8px 15px' },
                          '&:hover': {
                            borderColor: '#5F2E2E',
                            backgroundColor: '#5F2E2E',
                            transition: '0.5s ease'
                          }
                        }}
                      >
                        -
                      </Button>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => handleRemoveItem(cartItem.productId.id, cartItem.productId.name)}
                    sx={{ 
                      color: 'white', border: '2px solid #5F2E2E', 
                      fontSize: { xs: '0.8rem', sm: '1rem' }, 
                      padding: { xs: '5px 10px', sm: '8px 15px' },
                      margin: '20px 0 40px 0',
                      backgroundColor: '#5F2E2E',
                      '&:hover': {
                          borderColor: '#5F2E2E'
                      }
                    }}
                  >
                    Remove
                  </Button>
              </Box>
              ))}
              <Grid item xs={12}>
            <Grid container spacing={2}>
            </Grid>
            <p style={{position: 'absolute', top: '10vh', right: '5vw', fontSize: '24px'}}>Total Price: ${totalPrice.toFixed(2)}</p>
            <Grid item xs={12} sx={{
              color: theme === "bright" ? "black" : "white",
              backgroundColor: '#fff',
              width: '350px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                totalPrice={totalPrice}
                onSuccess={async (paymentMethodId) => {
                  const orderItems = cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                  }));
                
                  const orderData = {
                    userId: userData.id,
                    order: {
                      items: orderItems
                    }
                  };
                
                  try {
                    await dispatch(createOrder(orderData)).unwrap();
                    showSuccessMessage('Order placed successfully!');
                    window.scrollTo(0, 0);
                  } catch (error) {
                    showError('Failed to place order')
                    window.scrollTo(0, 0);
                  }
                }}
                onError={(errorMessage) => {
                  showError('Wrong payment information');
                }}
              />
            </Elements>
            </Grid>
          </Grid>
            </Grid>
            <p style={{position: 'absolute', top: '10vh', right: '5vw', fontSize: '24px'}}>Total Price: ${totalPrice.toFixed(2)}</p>
          </Grid>
        </div>
      )}
      <ScrollToTopButton/>
    </Grid>
    </div>
  );
};

export default CartPage;
