import axios from "axios";
import axiosInstance from '../../api/axiosConfig';
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { InitialStateUser, User, Credentials, LoggedInUser, UserData } from "../../misc/type";

let userState: User | null = null;
const data = localStorage.getItem("userInformation");

if (data) {
   userState = JSON.parse(data);
}

const initialState: InitialStateUser = {
   user: userState,
   loading: false,
   error: null,
};

// export const getSingleUser = createAsyncThunk(
//    "getSingleUser",
//    async (id: number, { rejectWithValue }) => {
//       try {
//          const response = await axios.get(`http://localhost:8080/api/v1/users/${id}`);
//          return response.data;
//       } catch (error) {
//             return rejectWithValue(error);
//       }
//    }
// );

export const uploadAvatar = createAsyncThunk(
   "uploadAvatar",
   async (imageFile: File, { rejectWithValue }) => {
      const formData = new FormData();
      formData.append("image", imageFile);
      try {
         console.log("Uploading image", imageFile.name);
         const response = await fetch("http://localhost:8080/api/v1/uploads", {
            method: "POST",
            body: formData,
         });
         const data = await response.json();
         console.log("Response data:", data);
         if (response.status !== 200) {
            throw new Error(data.message || "Failed to upload image");
         }
         console.log("Image uploaded, URL:", data.imageUrl);
         return data.imageUrl;
      } catch (error) {
         console.error("Error uploading image:", error);
         return rejectWithValue(error);
      }
   }
);

export const userRegistration = createAsyncThunk(
   'userRegistration',
   async(user: User, {dispatch, rejectWithValue}) => {
      try {
         const response = await axiosInstance.post(`http://localhost:8080/api/v1/users/registration`, user)
         return response.data
      } catch (error) {
         return rejectWithValue(error)
      }
   }
);

export const getSingleUser = createAsyncThunk(
   'fetchUserProfile',
   async (userId: number, { rejectWithValue }) => {
      try {
      const access_token = localStorage.getItem('token');
      if (!access_token) {
         throw new Error('No token found');
      }
      
      const response = await axios.get(`http://localhost:8080/api/v1/users/${userId}`, {
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
   async (credentials: Credentials, { rejectWithValue }) => {
      try {
         const response = await axios.post(`http://localhost:8080/api/v1/users/login/`, credentials);
         localStorage.setItem('token', response.data.token);
         
         // const login = await dispatch(fetchUserProfile());

         // return login.payload;
         console.log('userLogin', response.data);
         localStorage.setItem('userInformation', JSON.stringify(response.data));
         return response.data
      } catch (error) {
         return rejectWithValue('An error occurred during login');
      }
   }
);

export const updateUserProfile = createAsyncThunk(
   'updateUserProfile',
   async ({ id, firstName, lastName, email }: UserData, { rejectWithValue }) => {
      try {
         const response = await axios.put(`http://localhost:8080/api/v1/users/${id}`, { firstName, lastName, email }, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
         });
         console.log('updateUserProfile', response.data);
         return response.data;
      } catch (error) {
         if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data); //this part goes
         } else {
            return rejectWithValue('An unexpected error occurred');
         }
      }
   }
);

export const switchRole = createAsyncThunk(
   'switchRole',
   async ({ id }: LoggedInUser, { rejectWithValue, dispatch }) => {
      try {
         const response = await axiosInstance.put(`${process.env.REACT_APP_BASE_URL}/users/${id}`, {role: 'admin'} );
         const switchedUser = response.data;
         dispatch(setUser(switchedUser))
         return switchedUser;
      } catch (error) {
      return rejectWithValue('An error occurred during login');
      }
   }
)

export const userLogout = createAsyncThunk(
   'userLogout',
   async (_, { rejectWithValue }) => {
      try {
         localStorage.removeItem('userInformation');
      } catch (error) {
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
      builder.addCase(getSingleUser.fulfilled, (state, action) => {
         return {
            user: action.payload,
            loading: false,
            error: null,
         }
      })
      builder.addCase(getSingleUser.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null,
         }
      })
      builder.addCase(getSingleUser.rejected, (state, action) => {
         return {
            user: null,
            loading: false,
            error: action.error.message ?? "error"
         }
      });
      builder.addCase(userRegistration.fulfilled, (state, action) => {
         return {
            ...state,
            loading: false,
            error: null,
            user: action.payload
         }
      });
      builder.addCase(userRegistration.pending, (state, action) => {
         return {
            ...state,
            loading: true,
            error: null
         };
      });
      builder.addCase(userRegistration.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      });
      builder.addCase(uploadAvatar.fulfilled, (state, action) => {
         return {
            ...state,
            loading: false,
            error: null,
            avatar: action.payload
         };
      });
      builder.addCase(uploadAvatar.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null
         };
      });
      builder.addCase(uploadAvatar.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? 'Error occurred while uploading avatar'
         };
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
      });
      builder.addCase(userLogin.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         };
      });
      // builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      //    return {
      //       ...state,
      //       loading: false,
      //       error: null,
      //       user: action.payload
      //    };
      // });
      // builder.addCase(fetchUserProfile.pending, (state) => {
      //    return {
      //       ...state,
      //       loading: true,
      //       error: null
      //    };
      // });
      // builder.addCase(fetchUserProfile.rejected, (state, action) => {
      //    return {
      //       ...state,
      //       loading: false,
      //       error: action.error.message ?? "error"
      //    }
      // });
      builder.addCase(updateUserProfile.fulfilled, (state, action) => {
         return {
            ...state,
            loading: false,
            error: null,
            userData: action.payload
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
      builder.addCase(switchRole.fulfilled, (state, action) => {
         return {
            ...state,
            loading: false,
            error: null,
            user: action.payload
         };
      });
      builder.addCase(switchRole.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null,
         };
      });
      builder.addCase(switchRole.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error",
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