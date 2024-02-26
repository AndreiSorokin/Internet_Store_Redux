import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, useAppDispatch } from '../redux/store';
import { CartItem } from '../misc/type';
import { updateCartItemQuantity, removeFromCart } from '../redux/slices/cartSlice';
import { Button } from '@mui/material';

const CartPage: React.FC = () => {
  const cartItems = useSelector((state: AppState) => state.cart.items);
  const dispatch = useAppDispatch();

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
      alert(`Product ${cartItems.map(cartItem => cartItem.product.title)} has been deleted`);
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default CartPage;
