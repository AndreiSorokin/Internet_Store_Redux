import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { InitialState, Data } from "../../misc/type";

import axios from "axios";

const initialState: InitialState = {
   products: [],
   userInput: '',
   loading: false,
   error: false,
   selectedProduct: null,
   priceFilter: '',
   product: []
};

const BASE_URL = 'https://api.escuelajs.co/api/v1/products';

export const fetchProducts = createAsyncThunk(
   "fetchProducts",
   async () => {
      try {
         const response = await axios.get(BASE_URL);
         const data = response.data;
         return data;
      } catch (error) {
         console.error('Error fetching products:', error);
         throw error;
      }
   }
)

export const fetchSingleProduct = createAsyncThunk(
   "fetchSingleProduct",
   async (id: string) => {
      try {
         const response = await axios.get(`${BASE_URL}/${id}`);
         const data = response.data;
         return data;
      } catch (error) {
         console.error('Error fetching single product:', error);
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
      },
      filterByCategory: (state, action) => {
         const category = action.payload;
         state.products = state.products.filter(p => {
            return p.category.name === category
         })
      },
      setPriceFilter: (state, action) => {
         state.priceFilter = action.payload;
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
      builder.addCase(fetchSingleProduct.pending, (state, action) => {
         state.loading = true;
      });
      builder.addCase(fetchSingleProduct.fulfilled, (state, action) => {
         state.loading = false;
         state.selectedProduct = action.payload;
      });
      builder.addCase(fetchSingleProduct.rejected, (state, action) => {
         state.loading = false;
         console.error('Error fetching single product:', action.error);
      });
   }
})

export const { getUserInput, filterByCategory, setPriceFilter } = productsSlice.actions
const productsReducer = productsSlice.reducer;
export default productsReducer;