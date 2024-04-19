import React, { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import { AppState, useAppDispatch, useAppSelector } from '../../redux/store';
import { CartItem, LoggedInUser } from '../../misc/type';
import { updateCartItemQuantity, removeFromCart, getCart } from '../../redux/slices/cartSlice';
import { useTheme } from '../../components/contextAPI/ThemeContext'
import useSuccsessMessage from '../../hooks/SuccsessMessage';

import { Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import ScrollToTopButton from '../../components/utils/ScrollToTop';
import { createOrder, fetchOrdersByUserId } from '../../redux/slices/orderSlice';
import { handlePayment } from '../../redux/slices/paymentSlice';
import axios from 'axios';
import { getSingleUser } from '../../redux/slices/userSlice';
import CheckoutForm from '../../components/utils/CheckoutForm';

const CartPage: React.FC = () => {
  const { theme } = useTheme();
  const { succsessMessage, showSuccessMessage, succsessMessageStyle } = useSuccsessMessage()

  const cartItems = useAppSelector((state: AppState) => state.cart.items);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: AppState) => state.userRegister.user) as LoggedInUser;
  const orders = useAppSelector((state: AppState) => state.orders.orders);
  const userData = user?.userData as LoggedInUser
  const userId =user?.id

  // useEffect(() => {
  //   if (userId) {
  //     dispatch(fetchOrdersByUserId(userId));
  //   }
  // }, [dispatch, userId]);
  console.log(orders)


  useEffect(() => {
    if (userId) {
      dispatch(getCart(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(getSingleUser(user.id))
  }, [dispatch, user.id, orders]);

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartInformation');
    if (storedCartItems) {
      dispatch(updateCartItemQuantity(JSON.parse(storedCartItems)));
    }
  }, [dispatch]);

  const handleIncrementQuantity = (productId: number) => {
    const cartItem = cartItems.find(item => item.product.id === productId);
    if (cartItem) {
      const newQuantity = cartItem.quantity + 1;
      dispatch(updateCartItemQuantity({ productId: productId, quantity: newQuantity }));
    }
  };

  const handleDecrementQuantity = (productId: number) => {
    const cartItem = cartItems.find(item => item.product.id === productId);
    if (cartItem && cartItem.quantity > 1) {
      const newQuantity = cartItem.quantity - 1;
      dispatch(updateCartItemQuantity({ productId: productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId: number, productName: string) => {
    const answer = window.confirm(`Do you want to remove ${productName}?`);
    if(answer) {
      dispatch(removeFromCart(productId));
      showSuccessMessage(`Product ${cartItems.map(cartItem => cartItem.product.name)} has been deleted`);
    }
  };

  const totalPrice = cartItems.reduce((total, cartItem) => {
    return total + cartItem.product.price * cartItem.quantity;
  }, 0);


  const handleSendOrder = async () => {
    const orderItems = cartItems.map(item => ({
      product: item.product,
      quantity: item.quantity
    }));

    const orderData = {
      userId: user.id,
      order: {
        items: orderItems
      }
    };

    console.log('orderData', orderData)

    try {
      await dispatch(createOrder( orderData )).unwrap();
      showSuccessMessage('Order placed successfully!');
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

// Card Number: 4242 4242 4242 4242
// Expiration Date: 12/34
// CVC: 123
// ZIP/Postal Code: 90210

  const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);

  return (
    <div style={{ backgroundColor: theme === "bright" ? "white" : "black",
        color: theme === "bright" ? "black" : "white",
        paddingTop: '5vh',
        transition: '0.5s ease'
      }}>
        {succsessMessage && (
          <p style={succsessMessageStyle}>{succsessMessage}</p>
        )}
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
                      src={cartItem.product.category.image}
                      alt={cartItem.product.name}
                      style={{ width: "100%", height: "auto" }}
                    />
                    <h3>{cartItem.product.name}</h3>
                    <p>Price: ${cartItem.product.price}</p>
                    <p>Quantity: {cartItem.quantity}</p>
                    <Button
                      variant="outlined"
                      color="primary"
                      style={{ fontSize: "15px", marginBottom: "15px", marginRight: '15px' }}
                      onClick={() => handleIncrementQuantity(cartItem.product.id)}
                    >
                      +
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      style={{ fontSize: "15px", marginBottom: "15px" }}
                      onClick={() => handleDecrementQuantity(cartItem.product.id)}
                    >
                      -
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      style={{ marginBottom: "15px" }}
                      onClick={() => handleRemoveItem(cartItem.product.id, cartItem.product.name)}
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendOrder}
              style={{ margin: '20px 0' }}
            >
              Send Order
            </Button>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                totalPrice={totalPrice}
                onSuccess={async (paymentMethodId) => {
                  console.log('Payment successful with PaymentMethod ID:', paymentMethodId);
                  const orderItems = cartItems.map(item => ({
                    product: item.product,
                    quantity: item.quantity
                  }));
                
                  const orderData = {
                    userId: user.id,
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
                  console.error('Payment error:', errorMessage);
                }}
              />
            </Elements>
          </Grid>
            </Grid>
            <p style={{position: 'absolute', top: '10vh', right: '5vw', fontSize: '24px'}}>Total Price: ${totalPrice.toFixed(2)}</p>
          </Grid>
        </div>
      )}
      <ScrollToTopButton/>
      <h2>Orders</h2>
      <div>{orders.map(o=> {
        return (
          <div key={o.id}>
            <div>
              {o.orderItems.map((item, index) => (
                  <div key={index}>Quantity: {item.quantity}</div>
              ))}
            </div>
          </div>
        )
      })}</div>
    </Grid>
    </div>
  );
};

export default CartPage;
