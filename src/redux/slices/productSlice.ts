import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { InitialState, NewProduct } from "../../misc/type";

import axios from "axios";

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
         const response = await axios.get(`http://localhost:8080/api/v1/products`);
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
         const response = await axios.get(`http://localhost:8080/api/v1/products?limit=${limit}&offset=${offset}&searchQuery=${searchQuery}&minPrice=${minPrice}&maxPrice=${maxPrice}&size=${size}&gender=${gender}`);
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
         const response = await axios.get(`http://localhost:8080/api/v1/products/${id}`);
         const data = response.data;
         return data;
      } catch (error) {
         throw error;
      }
   }
)

export const uploadProductImages = createAsyncThunk(
   "uploadCategoryImage",
   async (imageFile: File, { rejectWithValue }) => {
      const formData = new FormData();
      formData.append("image", imageFile);
      try {
         const response = await fetch("http://localhost:8080/api/v1/uploads", {
            method: "POST",
            body: formData,
         });
         const data = await response.json();
         if (!response.ok) {
            throw new Error(data.message || "Failed to upload image");
         }
         return data.url;
      } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
      }
   }
);

export const createProduct = createAsyncThunk(
   'createProduct',
   async (product: NewProduct, { dispatch, rejectWithValue }) => {
      try {
         const { name, price, description, category, images, size, gender } = product;

         const uploadedImageUrls: string[] = [];

         const isFile = (obj: any): obj is File => {
            return obj instanceof File;
         };

         for (const imageFile of images) {
            if (isFile(imageFile)) {
               const uploadedImageUrl = await dispatch(uploadProductImages(imageFile)).unwrap();
               uploadedImageUrls.push(uploadedImageUrl);
            } else {
               console.error("One of the provided images is not a File object.");
               return rejectWithValue("One of the provided images is not a File object.");
            }
         }

         const response = await axios.post(`http://localhost:8080/api/v1/products`, {
            name,
            price,
            description,
            category,
            images: uploadedImageUrls,
            size,
            gender
         }, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`
            }
         });
         
         return response.data;
      } catch (error) {
         return rejectWithValue(error);
      }
   }
);

export const deleteProduct = createAsyncThunk(
   'deleteProduct',
   async (productId: string, { rejectWithValue }) => {
      try {
         await axios.delete(`http://localhost:8080/api/v1/products/${productId}`, {
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
         const response = await axios.put(`http://localhost:8080/api/v1/products/${id}`, {
            name,
            price
         }, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`
            }
         });
         return response.data;
      } catch (error) {
         console.log(localStorage.getItem('token'))
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

export const { filterByCategory, sortByPrice } = productsSlice.actions
const productsReducer = productsSlice.reducer;
export default productsReducer;