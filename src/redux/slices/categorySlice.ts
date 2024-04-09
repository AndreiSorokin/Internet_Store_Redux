import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Category, CategoryState } from '../../misc/type';

const initialState: CategoryState = {
   categories: [],
   loading: false,
   error: null,
}

export const fetchCategories = createAsyncThunk(
   "fetchCategories",
   async () => {
      try {
         const response = await fetch("http://localhost:8080/api/v1/categories");
         const data = response.json();
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
         const response = await fetch(`http://localhost:8080/api/v1/categories/${id}`);
         const data = response.json();
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
         const response = await fetch(`http://localhost:8080/api/v1/categories/${id}`, {
            method: "PUT",
            body: JSON.stringify(category),
         });
         const data = response.json();
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
         const response = await fetch(`http://localhost:8080/api/v1/categories/${id}`, {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json"
            }
         })
         const data = await response.json();
         return data;
      } catch (error) {
         return rejectWithValue(error)
      }
   }
)

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