import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements } from '@stripe/react-stripe-js';

import { AppState, useAppDispatch, useAppSelector } from '../../redux/store';
import { CartItem, LoggedInUser } from '../../misc/type';
import { updateCartItemQuantity, removeFromCart } from '../../redux/slices/cartSlice';
import { useTheme } from '../../components/contextAPI/ThemeContext'
import useSuccsessMessage from '../../hooks/SuccsessMessage';
import ScrollToTopButton from '../../components/utils/ScrollToTop';
import { createOrder, fetchOrdersByUserId } from '../../redux/slices/orderSlice';
import { getSingleUser } from '../../redux/slices/userSlice';
import CheckoutForm from '../../components/utils/CheckoutForm';
import useErrorMessage from '../../hooks/ErrorMessage';

import { Button, Grid } from '@mui/material';

const CartPage: React.FC = () => {
  const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);
  const { theme } = useTheme();
  const { succsessMessage, showSuccessMessage, succsessMessageStyle } = useSuccsessMessage()
  const { errorMessage, showError, errorMessageStyle } = useErrorMessage();

  const cartItems = useAppSelector((state: AppState) => state.cart.items);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: AppState) => state.userRegister.user) as LoggedInUser;
  const userData = user?.userData as LoggedInUser
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

  console.log(cartItems)

  const totalPrice = cartItems.reduce((total, cartItem) => {
    return total + cartItem.productId.price * cartItem.quantity;
  }, 0);

  return (
    <div style={{ backgroundColor: theme === "bright" ? "white" : "black",
        color: theme === "bright" ? "black" : "white",
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
          <h2>Cart</h2>
          <p>Your cart is empty.</p>
          <Link to="/products">
            <Button variant="outlined">Shop now</Button>
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
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <div>
                    <img
                      src={cartItem.productId.category.image}
                      alt={cartItem.productId.name}
                      style={{ width: "100%", height: "auto" }}
                    />
                    <h3>{cartItem.productId.name}</h3>
                    <p>Price: ${cartItem.productId.price}</p>
                    <p>Quantity: {cartItem.quantity}</p>
                    <Button
                      variant="outlined"
                      color="primary"
                      style={{ fontSize: "15px", marginBottom: "15px", marginRight: '15px' }}
                      onClick={() => handleIncrementQuantity(cartItem.productId.id)}
                    >
                      +
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      style={{ fontSize: "15px", marginBottom: "15px" }}
                      onClick={() => handleDecrementQuantity(cartItem.productId.id)}
                    >
                      -
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      style={{ marginBottom: "15px" }}
                      onClick={() => handleRemoveItem(cartItem.productId.id, cartItem.productId.name)}
                    >
                      Remove
                    </Button>
                  </div>
                </Grid>
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
                  console.log('Payment successful with PaymentMethod ID:', paymentMethodId);
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
                  } catch (error) {
                    console.error('Failed to place order:', error);
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
