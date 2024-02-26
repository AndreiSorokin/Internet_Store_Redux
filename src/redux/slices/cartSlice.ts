import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState } from '../../misc/type';

const initialState: CartState = {
   items: [],
};

const cartSlice = createSlice({
   name: 'cart',
   initialState,
   reducers: {
      addToCart(state, action: PayloadAction<CartItem>) {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);

      if (existingItemIndex !== -1) {
         state.items[existingItemIndex].quantity += quantity;
      } else {
         state.items.push(action.payload);
      }
      },
      removeFromCart(state, action: PayloadAction<number>) {
      const productIdToRemove = action.payload;
      state.items = state.items.filter(item => item.product.id !== productIdToRemove);
      },
      updateCartItemQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
      const { productId, quantity } = action.payload;
      const itemToUpdate = state.items.find(item => item.product.id === productId);
      if (itemToUpdate) {
         itemToUpdate.quantity = quantity;
      }
      },
      clearCart(state) {
      state.items = [];
      },
   },
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;
const cartReducer = cartSlice.reducer;
export default cartReducer;