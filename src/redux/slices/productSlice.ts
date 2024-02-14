import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { InitialState, Data } from "../../misc/type";

import axios from "axios";

const initialState: InitialState = {
   products: [],
   userInput: '',
   loading: false,
};

const url = 'https://api.escuelajs.co/api/v1/products';

export const fetchProducts = createAsyncThunk(
   "fetchProducts",
   async () => {
      try {
         const response = await axios.get(url);
         const data: Data[] = response.data;
         console.log('product slice data: ', data);
         return data;
      } catch (error) {
         console.error('Error fetching products:', error);
         throw error;
      }
   }
)

const productsSlice = createSlice({
   name: 'products',
   initialState,
   reducers: {
      getUserInput: (state, action) => {
         state.userInput = action.payload
      }
   },
   extraReducers(builder) {
      builder.addCase(fetchProducts.fulfilled, (state, action) => {
         if(!(action.payload instanceof Error)) {
            return {
               ...state,
               products: action.payload,
               loading: false
            }
         }
      })
      builder.addCase(fetchProducts.pending, (state, action) => {
         return {
            ...state,
            loading: true
         };
      })
      builder.addCase(fetchProducts.rejected, (state, action) => {
         if(action.payload instanceof Error) {
            return {
               ...state,
               loading: false
            }
         }
      })
   }
})

export const { getUserInput } = productsSlice.actions
const productsReducer = productsSlice.reducer;
export default productsReducer;


