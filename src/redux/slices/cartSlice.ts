import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState } from '../../misc/type';

const getCartFromLocalStorage = (): CartItem[] => {
   const data = localStorage.getItem('cartInformation');
   if (data) {
      return JSON.parse(data);
   } else {
      return [];
   }
};

const initialState: CartState = {
   items: getCartFromLocalStorage()
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

         localStorage.setItem("cartInformation", JSON.stringify(state.items));
      },
      removeFromCart(state, action: PayloadAction<number>) {
      const productIdToRemove = action.payload;
      state.items = state.items.filter(item => item.product.id !== productIdToRemove);

      localStorage.setItem("cartInformation", JSON.stringify(state.items));
      },
      updateCartItemQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
      const { productId, quantity } = action.payload;
      const itemToUpdate = state.items.find(item => item.product.id === productId);
      if (itemToUpdate) {
         itemToUpdate.quantity = quantity;

         localStorage.setItem("cartInformation", JSON.stringify(state.items));
      }
      },
      clearCart(state) {
      state.items = [];
      localStorage.removeItem("cartInformation");
      },
   },
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;
const cartReducer = cartSlice.reducer;
export default cartReducer;