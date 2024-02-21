import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { InitialState, Product } from "../../misc/type";

import axios from "axios";

const initialState: InitialState = {
   products: [],
   userInput: '',
   loading: false,
   error: false,
   selectedProduct: null,
   selectedCategory: 'All',
   priceFilter: '',
   product: [],
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
         const response = await axios.post(`https://api.escuelajs.co/api/v1/products/`, product);
         return response.data;
      } catch (error) {
         return rejectWithValue(error)
      }
   }
);

export const updateProduct = createAsyncThunk(
   'updateProduct',
   async (updatedProduct: Product, { rejectWithValue }) => {
      try {
         const response = await axios.put(`${BASE_URL}/${updatedProduct.id}`, updatedProduct);
         return response.data;
      } catch (error) {
         return rejectWithValue(error)
      }
   }
);

export const deleteProduct = createAsyncThunk(
   'deleteProduct',
   async (productId: string, { rejectWithValue }) => {
      try {
         await axios.delete(`${BASE_URL}/${productId}`);
         return productId;
      } catch (error) {
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
      builder.addCase(createProduct.fulfilled, (state, action) => {
         state.products.push(action.payload)
      })
   }
})

export const { getUserInput, filterByCategory, setPriceFilter, sortByPrice } = productsSlice.actions
const productsReducer = productsSlice.reducer;
export default productsReducer;