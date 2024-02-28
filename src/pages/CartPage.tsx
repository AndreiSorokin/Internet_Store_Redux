import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, useAppDispatch } from '../redux/store';
import { CartItem } from '../misc/type';
import { updateCartItemQuantity, removeFromCart } from '../redux/slices/cartSlice';
import { useTheme } from '../components/contextAPI/ThemeContext'
import useSuccsessMessage from '../hooks/SuccsessMessage';

import { Button } from '@mui/material';

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

  const handleRemoveItem = (productId: number) => {
    const answer = window.confirm(`Do you want to remove ${cartItems.map(cartItem => cartItem.product.title)}?`);
    if(answer) {
      dispatch(removeFromCart(productId));
      showSuccessMessage(`Product ${cartItems.map(cartItem => cartItem.product.title)} has been deleted`);
    }
  };

  const totalPrice = cartItems.reduce((total, cartItem) => {
    return total + cartItem.product.price * cartItem.quantity;
  }, 0);
  
  return (
    <div style={{
      backgroundColor: theme === "bright" ? "white" : "black",
      color: theme === "bright" ? "black" : "white",
      height: '100vh',
      paddingTop: '20vh'
    }}>
      {succsessMessage && <p style={succsessMessageStyle}>{succsessMessage}</p>}
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((cartItem: CartItem, index: number) => (
            <li key={index}>
              <div>
                <img src={cartItem.product.category.image} alt={cartItem.product.title} style={{ width: '100px', height: '100px' }} />
                <h3>{cartItem.product.title}</h3>
                <p>Price: ${cartItem.product.price}</p>
                <p>Quantity: {cartItem.quantity}</p>
                <Button variant="outlined" color="primary" style={{margin: '10px', fontSize: '15px'}} onClick={() => handleIncrementQuantity(cartItem.product.id)}>+</Button>
                <Button variant="outlined" color="primary" style={{margin: '10px', fontSize: '15px'}} onClick={() => handleDecrementQuantity(cartItem.product.id)}>-</Button>
                <Button variant="outlined" color="primary" style={{margin: '10px'}} onClick={() => handleRemoveItem(cartItem.product.id)}>Remove</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p>Total Price: ${totalPrice.toFixed(2)}</p>
    </div>
  );
};

export default CartPage;
