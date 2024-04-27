import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { InitialState, NewProduct } from "../../misc/type";
import axiosInstance from '../../api/axiosConfig';

import axios from "axios";
import { uploadImage } from "./uploadSlice";

const initialState: InitialState = {
   products: [],
   userInput: '',
   loading: false,
   error: null,
   selectedProduct: null,
   selectedCategory: '',
   filteredProducts: [],
   totalCount: 0
};


export const fetchAllProducts = createAsyncThunk(
   "fetchAllProducts",
   async () => {
      try {
         const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/products`);
         const data = response.data;
         return data;
      } catch (error) {
         throw error;
      }
   }
)

export const fetchProducts = createAsyncThunk(
   "fetchProducts",
   async ({ limit, offset, searchQuery = "", minPrice = 0, maxPrice = Infinity, size, gender }: 
   { limit: number; offset: number; searchQuery?: string; minPrice?: number; maxPrice?: number, size: string, gender: string },
      { rejectWithValue }) => {
      try {
         const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/products?limit=${limit}&offset=${offset}&searchQuery=${searchQuery}&minPrice=${minPrice}&maxPrice=${maxPrice}&size=${size}&gender=${gender}`);
         const data = response.data;
         return data;
      } catch (error) {
         rejectWithValue(error);
      }
   }
)

export const fetchSingleProduct = createAsyncThunk(
   "fetchSingleProduct",
   async (id: string) => {
      try {
         const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/products/${id}`);
         const data = response.data;
         return data;
      } catch (error) {
         throw error;
      }
   }
)

export const createProduct = createAsyncThunk(
   'createProduct',
   async (product: Partial<NewProduct>, { dispatch, rejectWithValue }) => {
      try {
         const { name, price, description, images, size, gender, categoryId } = product;

         const uploadedImageUrls: string[] = [];

         const isFile = (obj: any): obj is File => {
            return obj instanceof File;
         };

         if(images) {
            for (const image of images) {
               if (isFile(image)) {
                  const uploadedImageUrl = await dispatch(uploadImage(image)).unwrap();
                  uploadedImageUrls.push(uploadedImageUrl);
               } else if (typeof image === 'string') {
                  uploadedImageUrls.push(image);
               } else {
                  console.error("One of the provided images is neither a File object nor a string URL.");
                  return rejectWithValue("Invalid image format.");
               }
            }
         }

         const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/products`, {
            name,
            price,
            description,
            images: uploadedImageUrls,
            size,
            gender,
            categoryId
         }, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
               'Content-Type': 'application/json',
            }
         });
         
         dispatch(fetchProducts({ limit: 10, offset: 0, size: '', gender: '' }));
         
         return response.data;
      } catch (error) {
         if (axios.isAxiosError(error)) {
            return rejectWithValue({
               message: error.message,
               response: error.response?.data
            });
         } else {
            return rejectWithValue({
               message: "An unknown error occurred"
            });
         }
      }
   }
);

export const deleteProduct = createAsyncThunk(
   'deleteProduct',
   async (productId: string, { rejectWithValue }) => {
      try {
         await axios.delete(`${process.env.REACT_APP_BASE_URL}/products/${productId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`
            }
         });
         return productId;
      } catch (error) {
      return rejectWithValue(error)
      }
   }
);

export const updateProduct = createAsyncThunk(
   'updateProduct',
   async ({ id, name, price }: { id: string, name: string, price: number }, { rejectWithValue }) => {
      try {
         const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/products/${id}`, {
            name,
            price
         }, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`
            }
         });
         return response.data;
      } catch (error) {
         return rejectWithValue(error)
      }
   }
);


const productsSlice = createSlice({
   name: 'products',
   initialState,
   reducers: {
      filterByCategory: (state, action) => {
         const category = action.payload;
         state.selectedCategory = category;
         if (category === "All") {
            state.filteredProducts = state.products;
         } else {
            state.filteredProducts = state.products.filter(p => p.category.name === category);
         }
      }
   },
   extraReducers(builder) {
      builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
         if(!(action.payload instanceof Error)) {
            return {
               ...state,
               products: action.payload.products,
               totalCount: action.payload.totalCount,
               loading: false,
               error: null
            }
         }
      });
      builder.addCase(fetchAllProducts.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null
         }
      })
      builder.addCase(fetchAllProducts.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      })
      builder.addCase(fetchProducts.fulfilled, (state, action) => {
         if(!(action.payload instanceof Error)) {
            return {
               ...state,
               products: action.payload.products,
               totalCount: action.payload.totalCount,
               loading: false,
               error: null
            }
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
            products: [...state.products, action.payload]
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
         console.log(action.payload);
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      });
      builder.addCase(deleteProduct.fulfilled, (state, action) => {
         const productId = Number(action.payload);
         return {
            ...state,
            loading: false,
            error: null,
            products: state.products.filter(product => product.id !== productId)
         }
      });
      builder.addCase(deleteProduct.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null
         }
      });
      builder.addCase(deleteProduct.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      });
      builder.addCase(updateProduct.fulfilled, (state, action) => {
         const updatedProduct = action.payload;
         const updatedProducts = state.products.map(product =>
            product.id === updatedProduct.id ? updatedProduct : product
         );
         return {
            ...state,
            loading: false,
            products: updatedProducts
         };
      });
      builder.addCase(updateProduct.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null
         }
      });
      builder.addCase(updateProduct.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      })
   }
})

export const { filterByCategory } = productsSlice.actions
const productsReducer = productsSlice.reducer;
export default productsReducer;