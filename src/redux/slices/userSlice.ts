import axios from "axios";
import axiosInstance from '../../api/axiosConfig';
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { InitialStateUser, User, Credentials, LoggedInUser, UserData, UserStatus } from "../../misc/type";

let userState: User | null = null;
const data = localStorage.getItem("userInformation");

if (data) {
   userState = JSON.parse(data);
}

const initialState: InitialStateUser = {
   user: userState,
   users: [],
   loading: false,
   error: null,
};

export const fetchAllUsers = createAsyncThunk(
   'fetchAllUsers',
   async (_, { rejectWithValue }) => {
     try {
       const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`);
       const users = response.data;
       if (users.length === 0) {
         return rejectWithValue({ message: "Empty User List" });
       } else {
         return users;
       }
     } catch (error) {
       if (axios.isAxiosError(error) && error.response) {
         return rejectWithValue(error.response.data);
       } else {
         return rejectWithValue({ message: "Internal error" });
       }
     }
   }
);

export const userRegistration = createAsyncThunk(
   'userRegistration',
   async(user: User, {dispatch, rejectWithValue}) => {
      try {
         const response = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/users/registration`, user)
         return response.data
      } catch (error) {
         return rejectWithValue(error)
      }
   }
);

export const getSingleUser = createAsyncThunk(
   'getSingleUser',
   async (userId: string, { rejectWithValue }) => {
      try {
      const access_token = localStorage.getItem('token');
      if (!access_token) {
         throw new Error('No token found');
      }
      
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${userId}`, {
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
         const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/login/`, credentials);
         localStorage.setItem('token', response.data.token);
         // localStorage.setItem('userInformation', JSON.stringify(response.data));
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
         const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/users/${id}`, { firstName, lastName, email }, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
         });
         console.log('updateUserProfile', response.data);
         return response.data;
      } catch (error) {
         if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data);
         } else {
            return rejectWithValue('An unexpected error occurred');
         }
      }
   }
);

export const userLogout = createAsyncThunk(
   'userLogout',
   async (_, { rejectWithValue }) => {
      try {
         localStorage.removeItem('cartInformation');
         localStorage.removeItem('userInformation');
         localStorage.removeItem('token')
      } catch (error) {
         return rejectWithValue(error);
      }
   }
);


// export const handleGoogleLogin = createAsyncThunk(
//    'handleGoogleLogin',
//    async (credentialResponse: { credential: string }, { rejectWithValue, dispatch }) => {
//       const token = credentialResponse;
//       if (!token) {
//          console.error('No credential token received from Google login');
//          return rejectWithValue('No credential token received from Google login');
//       }
//       try {
//          const response = await axios.post('http://localhost:8080/api/v1/users/auth/google', { id_token: token });
//          localStorage.setItem('userInformation', JSON.stringify(response.data));
//          dispatch(setUser(response.data));
//          return response.data;
//       } catch (error) {
//          console.error('Error processing Google login', error);
//          return rejectWithValue('Error processing Google login');
//       }
//    }
// );

export const updatePassword = createAsyncThunk(
   'updatePassword',
   async ({ id, oldPassword, newPassword }: { id: number; oldPassword: string; newPassword: string }, { rejectWithValue }) => {
      try {
         const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/users/${id}/update-password`, { oldPassword, newPassword }, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
         });
         return response.data;
      } catch (error) {
         if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data.message);
         } else {
            return rejectWithValue('An unexpected error occurred');
         }
      }
   }
);

export const assignAdminRole = createAsyncThunk(
   'assignAdminRole',
   async ({ id, role }: { id: number; role: string }, { rejectWithValue }) => {
      try {
         const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/users/${id}/userInformation`, { role }, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
               }
         });
      return response.data;
      } catch (error) {
         if (axios.isAxiosError(error) && error.response) {
         return rejectWithValue(error.response.data);
      } else {
         return rejectWithValue(error);
      }
      }
   }
);

export const removeAdminRole = createAsyncThunk(
   'removeAdminRole',
   async ({ id, role }: { id: number; role: string }, { rejectWithValue }) => {
      try {
         const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/users/${id}/userInformation`, { role }, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
         }
      });
      return response.data;
      } catch (error) {
         if (axios.isAxiosError(error) && error.response) {
         return rejectWithValue(error.response.data);
      } else {
         return rejectWithValue('An unexpected error occurred while removing admin role');
      }
      }
   }
);

export const updateUserStatus = createAsyncThunk(
  'updateUserStatus',
  async ({ id, status }: { id: number; status: UserStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/changeUserStatus`, { userId: id, status: status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue('An unexpected error occurred');
      }
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/forgot-password`, { email });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: "Failed to send verification email." });
      }
    }
  }
);

export const resetPassword = createAsyncThunk(
  'resetPassword',
  async ({ newPassword, token }: { newPassword: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/reset-password`, { newPassword }, {
        params: { token }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: "Failed to reset password." });
      }
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
      builder
      .addCase(resetPassword.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null,
         };
       })
       .addCase(resetPassword.fulfilled, (state, action) => {
         return {
            ...state,
            loading: false,
            error: null,
         };
       })
       .addCase(resetPassword.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "Failed to send verification email.",
         };
       })
      .addCase(forgotPassword.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null,
         };
      })
      .addCase(forgotPassword.fulfilled, (state) => {
         return {
            ...state,
            loading: false,
            error: null,
         };
      })
      .addCase(forgotPassword.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "Failed to send verification email.",
         };
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
         const index = state.users.findIndex(user => user.id === action.meta.arg.id);
         if (index !== -1) {
            state.users[index].status = action.meta.arg.status;
         }
      })
      .addCase(updateUserStatus.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null,
         }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      })
      .addCase(removeAdminRole.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null,
         }
      })
      .addCase(removeAdminRole.fulfilled, (state, action) => {
         state.loading = false;
         state.error = null;
         const index = state.users.findIndex(user => user.id === action.payload.id);
         if (index !== -1) {
            state.users[index].role = action.payload.role;
         }
      })
      .addCase(removeAdminRole.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      })
      .addCase(assignAdminRole.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null,
         }
      })
      .addCase(assignAdminRole.fulfilled, (state, action) => {
         state.loading = false;
         state.error = null;
         const index = state.users.findIndex(user => user.id === action.payload.id);
         if (index !== -1) {
            state.users[index] = action.payload;
         }
      })
      .addCase(assignAdminRole.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      })
      .addCase(fetchAllUsers.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null,
         }
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
         return {
            ...state,
            users: action.payload,
            loading: false,
            error: null,
         }
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      });
      builder.addCase(updatePassword.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null,
         }
      });
      
      builder.addCase(updatePassword.fulfilled, (state, action) => {
         return {
            ...state,
            loading: false,
            error: null,
            user: { ...state.user, ...action.payload }
         }
      });
      
      builder.addCase(updatePassword.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      });
      // builder.addCase(handleGoogleLogin.fulfilled, (state, action) => {
      //    return {
      //       user: action.payload,
      //       loading: false,
      //       error: null,
      //    }
      // })
      // builder.addCase(handleGoogleLogin.pending, (state) => {
      //    return {
      //       ...state,
      //       loading: true,
      //       error: null,
      //    }
      // })
      // builder.addCase(handleGoogleLogin.rejected, (state, action) => {
      //    return {
      //       user: null,
      //       loading: false,
      //       error: action.error.message ?? "error"
      //    }
      // })
      builder.addCase(getSingleUser.fulfilled, (state, action) => {
         return {
            ...state,
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
            ...state,
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