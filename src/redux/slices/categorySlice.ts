import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Category, CategoryState } from '../../misc/type';
import axios from 'axios';
import axiosInstance from '../../api/axiosConfig';


const initialState: CategoryState = {
   categories: [],
   loading: false,
   error: null,
}

export const fetchCategories = createAsyncThunk(
   "fetchCategories",
   async () => {
      try {
         const response = await axios.get("http://localhost:8080/api/v1/categories");
         const data = response.data;
         return data;
      } catch (error) {
         throw error;
      }
   }
)

export const fetchSingleCategory = createAsyncThunk(
   "fetchSingleCategory",
   async (id: string) => {
      try {
         const response = await axios.get(`http://localhost:8080/api/v1/categories/${id}`);
         const data = response.data;
         return data;
      } catch (error) {
         throw error;
      }
   }
)

export const updateCategory = createAsyncThunk(
   "updateCategory",
   async ({ id, category }: { id: string, category: Category }, { rejectWithValue }) => {
      try {
         const response = await axios.put(`http://localhost:8080/api/v1/categories/${id}`, {
            body: JSON.stringify(category),
         });
         const data = response.data;
         return data;
      } catch (error) {
         return rejectWithValue(error)
      }
   }
)

export const deleteCategory = createAsyncThunk(
   "deleteCategory",
   async (id: string, { rejectWithValue }) => {
      try {
         const response = await axios.delete(`http://localhost:8080/api/v1/categories/${id}`, {
            headers: {
               "Content-Type": "application/json"
            }
         })
         const data = await response.data;
         return data;
      } catch (error) {
         return rejectWithValue(error)
      }
   }
)

export const createCategory = createAsyncThunk(
   'createCategory',
   async (formData: FormData, { rejectWithValue }) => {
      try {
         const response = await axios.post('http://localhost:8080/api/v1/categories', formData, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
         },
         });
         return response.data;
      } catch (error) {
         return rejectWithValue(error);
      }
   }
);

const categorySlice = createSlice({
   name: 'category',
   initialState,
   reducers: {},
   extraReducers(builder) {
      builder.addCase(createCategory.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null
         }
      })
      builder.addCase(createCategory.fulfilled, (state, action) => {
         return {
            ...state,
            categories: [...state.categories, action.payload],
            loading: false,
            error: null
         }
      })
      builder.addCase(createCategory.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message?? "error"
         }
      })
      builder.addCase(deleteCategory.fulfilled, (state, action) => {
         const id = Number(action.payload);
         return {
            ...state,
            loading: false,
            error: null,
            categories: state.categories.filter(category => category.id!== id)
         }
      })
      builder.addCase(deleteCategory.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null
         }
      })
      builder.addCase(deleteCategory.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      })
      builder.addCase(updateCategory.fulfilled, (state, action) => {
         const category = action.payload;
         return {
            ...state,
            loading: false,
            error: null,
            categories: state.categories.map(c => c.id === category.id? category : c)
         }
      })
      builder.addCase(updateCategory.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null
         }
      })
      builder.addCase(updateCategory.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      })
      builder.addCase(fetchSingleCategory.fulfilled, (state, action) => {
         return {
            ...state,
            categories: action.payload,
            loading: false,
            error: null,
         }
      })
      builder.addCase(fetchSingleCategory.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null,
         }
      })
      builder.addCase(fetchSingleCategory.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error",
         }
      })
      builder.addCase(fetchCategories.fulfilled, (state, action) => {
         return {
            ...state,
            categories: action.payload,
            loading: false,
            error: null
         }
      })
      builder.addCase(fetchCategories.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null
         }
      })
      builder.addCase(fetchCategories.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      })
   }
})

const categoryReducer = categorySlice.reducer;
export default categoryReducer;