import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { InitialStateUser, User } from "../../misc/type";

const initialState: InitialStateUser = {
   users: [],
   error: null,
   loading: false,
   userInput: '',
   isAuthenticated: null
}

const BASE_URL = 'https://api.escuelajs.co/api/v1'

export const userRegistration = createAsyncThunk(
   'userRegistration',
   async(user: User, {rejectWithValue}) => {
      try {
         const response = await axios.post(`${BASE_URL}/users/`, user)
         console.log('API Response:', response.data);
         return response.data
      } catch (error) {
         console.error('API Error:', error);
         return rejectWithValue(error)
      }
   }
)
export const uploadAvatar = createAsyncThunk(
   'uploadAvatar',
   async (file: File, { rejectWithValue }) => {
      try {
         const formData = new FormData();
         formData.append('file', file);
         
         const response = await axios.post(`${BASE_URL}/files/upload`, formData, {
         headers: {
            'Content-Type': 'multipart/form-data'
         }
         });

         const { location } = response.data;

         if (!location) {
            throw new Error('Invalid response');
         }

         return location;
      
      } catch (error) {
         console.error('API Error:', error);
         return rejectWithValue(error)
      }
   }
);

export const userLogin = createAsyncThunk(
   'userLogin',
   async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
      try {
         const response = await axios.post(`${BASE_URL}/auth/login/`, { email, password });
         console.log('Login Response:', response.data);
         return response.data;
      } catch (error) {
         console.error('Login Error:', error);
         return rejectWithValue(error);
      }
   }
);

const userSlice = createSlice({
   name: 'user',
   initialState,
   reducers: {
      getUserInput: (state, action) => {
         state.userInput = action.payload;
      },
   },
   extraReducers(builder) {
      builder.addCase(userRegistration.fulfilled, (state, action) => {
         return {
            ...state,
            loading: false,
            user: action.payload
         }
      })
      builder.addCase(userRegistration.pending, (state, action) => {
         return {
            ...state,
            loading: true,
            error: null
         };
      })
      builder.addCase(userRegistration.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      })
      builder.addCase(userLogin.fulfilled, (state, action) => {
         return {
            ...state,
            loading: false,
            loggedInUser: action.payload
         };
      })
      builder.addCase(userLogin.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null
         };
      })
      builder.addCase(userLogin.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         };
      });
   }
})

const userReducer = userSlice.reducer;
export default userReducer;