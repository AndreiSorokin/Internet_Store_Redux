import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { InitialStateUser, User } from "../../misc/type";

const initialState: InitialStateUser = {
   users: [],
   error: null,
   loading: false,
   userInput: ''
}

export const userLogin = createAsyncThunk(
   'userLogin',
   async(user: User, {rejectWithValue}) => {
      try {
         const response = await axios.post(`https://api.escuelajs.co/api/v1/users/`, user)
         console.log('API Response:', response.data);
         return response.data
      } catch (error) {
         console.error('API Error:', error);
         return rejectWithValue(error)
      }
   }
)

const userSlice = createSlice({
   name: 'user',
   initialState,
   reducers: {
      
   },
   extraReducers(builder) {
      builder.addCase(userLogin.fulfilled, (state, action) => {
         return {
            ...state,
            loading: false,
            user: action.payload
         }
      })
      builder.addCase(userLogin.pending, (state, action) => {
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
         }
      })
   }
})

const userReducer = userSlice.reducer;
export default userReducer;