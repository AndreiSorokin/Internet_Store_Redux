import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../misc/type";

const initialState: User = {
   id: '',
   email: '',
   password: '',
   name: '',
   role: "customer",
   avatar: '',
   loading: false,
}

export const userLogin = createAsyncThunk(
   'userLogin',
   async(user: Omit<User, 'id'>, {rejectWithValue}) => {
      try {
         const response = await axios.post(`https://api.escuelajs.co/api/v1/users/`, user)
         return response.data
      } catch (error) {
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
         state.loading = false
         return action.payload
      })
   }
})

const userReducer = userSlice.reducer;
export default userReducer;