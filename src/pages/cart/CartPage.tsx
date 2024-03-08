import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, useAppDispatch } from '../../redux/store';
import { CartItem } from '../../misc/type';
import { updateCartItemQuantity, removeFromCart } from '../../redux/slices/cartSlice';
import { useTheme } from '../../components/contextAPI/ThemeContext'
import useSuccsessMessage from '../../hooks/SuccsessMessage';

import { Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import ScrollToTopButton from '../../components/utils/ScrollToTop';

const CartPage: React.FC = () => {
  const { theme } = useTheme();
  const { succsessMessage, showSuccessMessage, succsessMessageStyle } = useSuccsessMessage()

  const cartItems = useSelector((state: AppState) => state.cart.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
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
      showSuccessMessage(`Product ${cartItems.map(cartItem => cartItem.product.title)} has been deleted`);
    }
  };

  const totalPrice = cartItems.reduce((total, cartItem) => {
    return total + cartItem.product.price * cartItem.quantity;
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
                      alt={cartItem.product.title}
                      style={{ width: "100%", height: "auto" }}
                    />
                    <h3>{cartItem.product.title}</h3>
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
                      onClick={() => handleRemoveItem(cartItem.product.id, cartItem.product.title)}
                    >
                      Remove
                    </Button>
                  </div>
                </Grid>
              ))}
            </Grid>
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
          </Grid>
        </div>
      )}
      <ScrollToTopButton/>
    </Grid>
    </div>
  );
};

export default CartPage;
