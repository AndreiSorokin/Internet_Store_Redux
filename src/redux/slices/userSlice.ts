import axios from "axios";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { InitialStateUser, User, Credentials, LoggedInUser } from "../../misc/type";

let userState: User | null = null;
const data = localStorage.getItem("userInformation");

if (data) {
   userState = JSON.parse(data);
}

console.log("User information from local storage:", data);


const initialState: InitialStateUser = {
   user: userState,
   loading: false,
   error: null,
};

const BASE_URL = 'https://api.escuelajs.co/api/v1';

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

export const fetchUserProfile = createAsyncThunk(
   'fetchUserProfile',
   async (_, { rejectWithValue }) => {
      try {
      const access_token = localStorage.getItem('token');
      if (!access_token) {
         throw new Error('No token found');
      }
      
      const response = await axios.get(`${BASE_URL}/auth/profile`, {
         headers: {
            Authorization: `Bearer ${access_token}`,
         },
      });
      
      return response.data;
      } catch (error) {
      if (axios.isAxiosError(error)) {
         const errorResponse = error.response?.data;
         if (errorResponse) {
            return rejectWithValue(errorResponse);
         }
      }
      return rejectWithValue(error);
      }
   }
);

export const userLogin = createAsyncThunk(
   'userLogin',
   async (credentials: Credentials, { rejectWithValue, dispatch }) => {
      try {
         const response = await axios.post(`${BASE_URL}/auth/login/`, credentials);
         console.log('Login Response:', response.data);
         localStorage.setItem('token', response.data.access_token);
         
         const login = await dispatch(fetchUserProfile());

         return login.payload;
      } catch (error) {
         console.error('Login Error:', error);
         return rejectWithValue('An error occurred during login');
      }
   }
);

export const updateUserProfile = createAsyncThunk(
   'updateUserProfile',
   async ({ id, email, name }: LoggedInUser, { rejectWithValue, dispatch }) => {
      try {
         const response = await axios.put(`${BASE_URL}/users/${id}`, { email, name, role: 'admin' });
         const updatedUser = response.data;
         dispatch(setUser(updatedUser))
         console.log('Update User Profile Response:', updatedUser);
         return updatedUser;
      } catch (error) {
      console.error('Login Error:', error);
      return rejectWithValue('An error occurred during login');
      }
   }
);

export const userLogout = createAsyncThunk(
   'userLogout',
   async (_, { rejectWithValue }) => {
      try {
         localStorage.removeItem('userInformation');
      } catch (error) {
         console.error('Logout Error:', error);
         return rejectWithValue(error);
      }
   }
);


const userSlice = createSlice({
   name: 'user',
   initialState,
   reducers: {
      getUserInput: (state, action) => {
         state.user = action.payload;
      },
      setUser: (state, action: PayloadAction<LoggedInUser>) => {
         state.user = action.payload;
      },
      clearUser: (state) => {
         localStorage.removeItem('userInformation');
         state.user = null;
      },
   },
   extraReducers(builder) {
      builder.addCase(userRegistration.fulfilled, (state, action) => {
         return {
            ...state,
            loading: false,
            error: null,
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
      });
      builder.addCase(userLogin.fulfilled, (state, action) => {         
         return {
            ...state,
            loading: false,
            error: null,
            user: action.payload as LoggedInUser,
         };
      });
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
      builder.addCase(userLogout.fulfilled, (state) => {
         return {
            ...state,
            error: null,
            loading: false,
            user: null
         };
      });
      builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
         return {
            ...state,
            loading: false,
            error: null,
            user: action.payload
         };
      });
      builder.addCase(fetchUserProfile.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null
         };
      });
      builder.addCase(fetchUserProfile.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      });
      builder.addCase(updateUserProfile.fulfilled, (state, action) => {
         return {
            ...state,
            loading: false,
            error: null,
            user: action.payload
         };
      });
      builder.addCase(updateUserProfile.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null,
         };
      });
      builder.addCase(updateUserProfile.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error",
         };
      });
      builder.addCase(userLogout.pending, (state) => {
         return {
            ...state,
            error: null,
            loading: true,
            user: state.user
         };
      });
      builder.addCase(userLogout.rejected, (state, action) => {
         return {
            ...state,
            error: action.error.message ?? "error",
            loading: false,
         };
      });
   }
})

export const { getUserInput, setUser, clearUser } = userSlice.actions;
const userReducer = userSlice.reducer;
export default userReducer;