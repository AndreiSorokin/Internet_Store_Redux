import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { InitialState, Product } from "../../misc/type";

import axios from "axios";

const initialState: InitialState = {
   products: [],
   userInput: '',
   loading: false,
   error: null,
   selectedProduct: null,
   selectedCategory: '',
   priceFilter: '',
   filteredProducts: []
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

export const createProduct = createAsyncThunk(
   'createProduct',
   async (product: Product, { rejectWithValue }) => {
      try {
         const response = await axios.post(`${BASE_URL}`, product);
         console.log('API Response:', response.data);
         return response.data;
      } catch (error) {
         console.error('API Error:', error);
         return rejectWithValue(error)
      }
   }
);

const productsSlice = createSlice({
   name: 'products',
   initialState,
   reducers: {
      getUserInput: (state, action) => {
         state.userInput = action.payload
      },
      filterByCategory: (state, action) => {
         const category = action.payload;
         state.selectedCategory = category;
         if (category === "All") {
            state.filteredProducts = state.products;
         } else {
            state.filteredProducts = state.products.filter(p => p.category.name === category);
         }
      },
      setPriceFilter: (state, action) => {
         state.priceFilter = action.payload;
         state.filteredProducts = state.products.filter(product => {
            switch (action.payload) {
               case 'Under 20':
               return product.price < 20;
               case '20 to 100':
               return product.price >= 20 && product.price <= 100;
               case 'Over 100':
               return product.price > 100;
               default:
               return true;
            }
         });
      },
      sortByPrice: (state, action) => {
         const sortOrder = action.payload;
         state.products.sort((a, b) => {
            if (sortOrder === 'from low to high') {
               return a.price - b.price;
            } else {
               return b.price - a.price;
            }
         });
      }
   },
   extraReducers(builder) {
      builder.addCase(fetchProducts.fulfilled, (state, action) => {
         return {
            ...state,
            products: action.payload,
            loading: false,
            error: null
         }
      });
      builder.addCase(fetchProducts.pending, (state, action) => {
         return {
            ...state,
            loading: true,
            error: null,
         };
      });
      builder.addCase(fetchProducts.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      });
      builder.addCase(fetchSingleProduct.pending, (state, action) => {
         return {
            ...state,
            loading: true,
            error: null
         }
      });
      builder.addCase(fetchSingleProduct.fulfilled, (state, action) => {
         return {
            ...state,
            loading: false,
            selectedProduct: action.payload
         }
      });
      builder.addCase(fetchSingleProduct.rejected, (state, action) => {
         state.loading = false;
         state.error = action.error.message ?? "error";
      });
      builder.addCase(createProduct.fulfilled, (state, action) => {
         return {
            ...state,
            loading: false,
            user: action.payload
         }
      });
      builder.addCase(createProduct.pending, (state, action) => {
         return {
            ...state,
            loading: true,
            error: null
         };
      });
      builder.addCase(createProduct.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      });
   }
})

export const { getUserInput, filterByCategory, setPriceFilter, sortByPrice } = productsSlice.actions
const productsReducer = productsSlice.reducer;
export default productsReducer;