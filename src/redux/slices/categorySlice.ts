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
         const response = await axiosInstance.get("http://localhost:8080/api/v1/categories");
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
         const response = await axiosInstance.get(`http://localhost:8080/api/v1/categories/${id}`);
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
         const response = await axiosInstance.put(`http://localhost:8080/api/v1/categories/${id}`, {
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
         const response = await axiosInstance.delete(`http://localhost:8080/api/v1/categories/${id}`, {
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

export const uploadCategoryImage = createAsyncThunk(
   "uploadCategoryImage",
   async (imageFile: File, { rejectWithValue }) => {
      const formData = new FormData();
      formData.append("image", imageFile);
      try {
         const response = await axiosInstance.post("http://localhost:8080/api/v1/uploads", {
            body: formData,
         });
         const data = await response.data
         if (!data) {
            throw new Error(data.message || "Failed to upload image");
         }
         return data.url;
      } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
      }
   }
);

export const createCategory = createAsyncThunk(
   'createCategory',
   async (formData: FormData, { rejectWithValue }) => {
      try {
         const response = await axiosInstance.post('http://localhost:8080/api/v1/categories', formData, {
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