import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartInitialState, CartItem, CartState, addProduct } from '../../misc/type';
import axios from 'axios';

export const getCartFromLocalStorage = (): CartItem[] => {
   const data = localStorage.getItem('cartInformation');
   if (data) {
      return JSON.parse(data);
   } else {
      return [];
   }
};

const initialState: CartInitialState = {
   items: getCartFromLocalStorage(),
   loading: false,
   error: null
};

export const getCart = createAsyncThunk(
   'getCart',
   async (userId: number, { rejectWithValue }) => {
      try {
         const response = await axios.get(`http://localhost:8080/api/v1/users/${userId}/cart`);
         const data = response.data;
         return data;
      } catch (error) {
         return rejectWithValue(error);
      }
   }
)

export const addProductToCart = createAsyncThunk(
   'addProductToCart',
   async ({ userId, productId, quantity }: addProduct, { rejectWithValue }) => {
      try {
         const response = await axios.post(`http://localhost:8080/api/v1/${userId}/cart`, {
            productId,
            quantity
         });
         const data = response.data;
         return data;
      } catch (error) {
         return rejectWithValue(error);
      }
   }
);

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
   extraReducers(builder) {
      builder.addCase(addProductToCart.pending, (state) => {
         return {
           ...state,
            loading: true,
            error: null,
         }
        })
        builder.addCase(addProductToCart.fulfilled, (state, action) => {
         return {
           ...state,
            items: action.payload,
            loading: false,
            error: null,
         }
        })
        builder.addCase(addProductToCart.rejected, (state, action) => {
         return {
           ...state,
            loading: false,
            error: action.error.message ?? "error",
         }
        })
      builder.addCase(getCart.pending, (state) => {
      return {
        ...state,
         loading: true,
         error: null,
      }
     })
     builder.addCase(getCart.fulfilled, (state, action) => {
      return {
        ...state,
         items: action.payload,
         loading: false,
         error: null,
      }
     })
     builder.addCase(getCart.rejected, (state, action) => {
      return {
        ...state,
         loading: false,
         error: action.error.message ?? "error",
      }
     })
   }
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;
const cartReducer = cartSlice.reducer;
export default cartReducer;