import axios from 'axios';
import { InitialStateUser, LoggedInUser, User, UserStatus } from '../misc/type'
import userReducer, { clearUser, fetchAllUsers, getSingleUser, getUserInput, setUser, updatePassword, updateUserProfile, userLogin, userLogout, userRegistration } from '../redux/slices/userSlice'
import { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import store from '../redux/store';

const userState: User | null = null;

const initialState: InitialStateUser = {
   user: userState,
   users: [],
   loading: false,
   error: null 
};

const userData: User = {
   email: 'test@example.com',
   password: 'testpassword',
   firstName: 'Test',
   lastName: 'User',
   avatar: 'avatar-url',
   username: 'testuser'
};

const loggedInUser: LoggedInUser = {
   id: 1,
   email: 'aa@aa.aa',
   password: 'password',
   firstName: 'name',
   lastName: '',
   avatar: 'avatar',
   username: 'username',
   role: 'CUSTOMER',
   userData: {
      email: 'aa@aa.aa',
      password: 'password',
      firstName: 'name',
      lastName: '',
      avatar: 'avatar',
      username: 'username',
      id: 1,
      status: UserStatus.ACTIVE,
      role: "ADMIN"
   },
   status: UserStatus.ACTIVE,
   cart: { items: [] },
   orders: { orders: [] }
};
const BASE_URL = 'http://localhost:8080/api/v1'

describe("user reducer", () => {

   describe("fulfilled", () => {
      test("should fetch user list", async () => {
         const mockUsers = [
            { id: 1, name: 'User One' },
            { id: 2, name: 'User Two' }
         ];
      
         jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: mockUsers });
      
         const dispatch: Dispatch<UnknownAction> = jest.fn();
         const getState = () => {};
      
         await fetchAllUsers()(dispatch, getState, null);
      
         expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: fetchAllUsers.fulfilled.type,
            payload: mockUsers
         }));
      });
      
      test("should register a user", async () => {
      
         const mockApiResponse = {
            id: '123',
            ...userData
         };
      
         jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: mockApiResponse });
      
         const dispatch: Dispatch<UnknownAction> = jest.fn();
      
         await userRegistration(userData)(dispatch, () => {}, null);
      
         const state = userReducer(initialState, userRegistration.fulfilled(mockApiResponse, '', userData));
      
         expect(state).toEqual({
            user: mockApiResponse,
            loading: false,
            error: null,
            users: []
         });
      });

      test("getSingleUser should return user data when fulfilled", async () => {
         const userId = 1;
         const mockUserResponse = { id: userId, name: "John Doe", email: "john@example.com" };
         const action = getSingleUser.fulfilled(mockUserResponse, 'fulfilled', userId.toString());
         const state = userReducer(initialState, action);
      
         expect(state).toEqual({
            ...initialState,
            user: mockUserResponse,
            loading: false,
            error: null,
         });
      });
      
      test("should login", async () => {
         const credentials = {
            email: 'a@a.a',
            password: 'a'
         };
      
         const mockApiResponse = {
            id: '123',
            email: credentials.email,
         };
      
         jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: mockApiResponse });
      
         const dispatch: Dispatch<UnknownAction> = jest.fn();
      
         await userLogin(credentials)(dispatch, () => {}, null);
      
         const state = userReducer(initialState, userLogin.fulfilled(mockApiResponse, '', credentials));
      
         expect(state).toEqual({
            user: mockApiResponse,
            loading: false,
            error: null,
            users: []
         });
      });

      test('should update user profile', async () => {
         const currentUserData = {
            password: loggedInUser.password,
            avatar: loggedInUser.avatar,
            username: loggedInUser.username,
         };
         
         const updateData = {
            id: loggedInUser.id,
            firstName: 'UpdatedFirstName',
            lastName: 'UpdatedLastName',
            email: 'updatedEmail@aa.aa',
            status: UserStatus.ACTIVE,
            role: "ADMIN" as "ADMIN" | "CUSTOMER",
            ...currentUserData,
         };
      
         const updatedUser = {
            ...loggedInUser,
            firstName: updateData.firstName,
            lastName: updateData.lastName,
            email: updateData.email,
         };
      
         jest.spyOn(axios, 'put').mockResolvedValueOnce({ data: updatedUser });
      
         const dispatch = jest.fn();
         const getState = () => {};
      
         await updateUserProfile(updateData)(dispatch, getState, null);
      
         expect(axios.put).toHaveBeenCalledWith(
            `${process.env.REACT_APP_BASE_URL}/users/${updateData.id}`,
            { firstName: updateData.firstName, lastName: updateData.lastName, email: updateData.email },
            {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
               }
            }
         );
      
         expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: updateUserProfile.fulfilled.type,
            payload: updatedUser
         }));
      });

      test("should logout", async () => {
         const localStorageRemoveItemMock = jest.fn();
         global.localStorage.removeItem = localStorageRemoveItemMock.mockReturnValue(undefined);
   
         const dispatch: Dispatch<UnknownAction> = jest.fn();
   
         const resultAction = await userLogout()(dispatch, () => {}, null);
   
         expect(resultAction.type).toBe(userLogout.fulfilled.type);
   
         const stateAfterLogout = userReducer(initialState, resultAction);
         expect(stateAfterLogout.loading).toBe(false);
         expect(stateAfterLogout.error).toBe(null);
   
         expect(stateAfterLogout.user).toBeNull();
   
         const stateAfterClearUser = userReducer(stateAfterLogout, clearUser());
   
         expect(stateAfterClearUser.user).toBeNull();
      });

      test("updatePassword should handle fulfilled case", async () => {
        const updatePayload = { id: 1, oldPassword: "oldPass", newPassword: "newPass" };
        const mockResponseData = { message: "Password updated successfully" };
        const action = updatePassword.fulfilled(mockResponseData, 'fulfilled', updatePayload);
        const state = userReducer(initialState, action);
      
        expect(state).toEqual({
          ...initialState,
          loading: false,
          error: null,
          user: { message: "Password updated successfully" }, 
        });
      });

      test("should get user input", () => {
         const userInput = {
            email: 'test@example.com',
            password: 'testpassword',
            name: 'Test User',
            avatar: 'avatar-url'
         };
      
         const state = userReducer(
            initialState,
            getUserInput(userInput)
         );
      
         expect(state).toEqual(
            {
               user: userInput,
               loading: false,
               error: null,
               users: []
            }
         )
      })

      test("should set a user", () => {
         const newState = userReducer(initialState, setUser(loggedInUser));
      
         expect(newState.user).toEqual(loggedInUser);
      })

      test("should clear a user", () => {
         const localStorageMock = {
            removeItem: jest.fn(),
         };
         Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
         });
         
         const state = userReducer(initialState, clearUser());
   
         expect(localStorageMock.removeItem).toHaveBeenCalledWith('userInformation');
         expect(state).toEqual({
            user: null,
            loading: false,
            error: null,
            users: []
         });
      });
   })

   describe("pending", () => {
      test("fetchAllUsers should set loading to true when pending", () => {
         const action = fetchAllUsers.pending('fetchAllUsers/pending');
         const state = userReducer(initialState, action);
      
         expect(state).toEqual({
            ...initialState,
            loading: true,
            error: null,
         });
      });
      test("should have loading truthy when registration is pending", () => {

         const state = userReducer(
            initialState,
            userRegistration.pending('', userData)
         );
      
         expect(state).toEqual({
            user: userState,
            loading: true,
            error: null,
            users: []
         })
      });

      test("getSingleUser should set loading to true when pending", () => {
         const action = getSingleUser.pending('pending', '1');
         const state = userReducer(initialState, action);
      
         expect(state).toEqual({
            ...initialState,
            loading: true,
            error: null,
         });
      });

      test("should have loading truthy when logging in is pending", () => {
         const credentials = {
            email: 'a@a.a',
            password: 'a'
         };
         
         const state = userReducer(
            initialState,
            userLogin.pending('', credentials)
         );
      
         expect(state).toEqual({
            user: null,
            loading: true,
            error: null,
            users: []
         });
      });

      test("should have loading truthy when updating profile is pending", () => {
         const currentUserData = {
            password: loggedInUser.password,
            avatar: loggedInUser.avatar,
            username: loggedInUser.username,
         };
         const state = userReducer(
            initialState,
            updateUserProfile.pending('', { id: loggedInUser.id, firstName: 'UpdatedFirstName', lastName: 'UpdatedLastName', email: 'updatedEmail@aa.aa',status: UserStatus.ACTIVE,
            role: "ADMIN", ...currentUserData })
         );
      
         expect(state).toEqual({
            ...initialState,
            loading: true,
            error: null,
         });
      });

      test("should have loading truthy when logging out is pending", () => {
      
         const state = userReducer(
            initialState,
            userLogout.pending('', undefined, undefined)
         );
      
         expect(state).toEqual({
            user: null,
            loading: true,
            error: null,
            users: []
         })
      })

      test("updatePassword should set loading to true when pending", () => {
         const action = updatePassword.pending('pending', { id: 1, oldPassword: "dummyOldPassword", newPassword: "dummyNewPassword" }, '1');
        const state = userReducer(initialState, action);
      
        expect(state).toEqual({
          ...initialState,
          loading: true,
          error: null,
        });
      });
   })

   describe("rejected", () => {
      const error = new Error("error");
      test("fetchAllUsers should have error when rejected", () => {
         const errorMessage = "Network error";
         const action = fetchAllUsers.rejected(new Error(errorMessage), 'fetchAllUsers/rejected', undefined);
         const state = userReducer(initialState, action);
      
         expect(state).toEqual({
            ...initialState,
            loading: false,
            error: errorMessage,
         });
      });

      test("registration should have error", () => {
         const state = userReducer(
            initialState,
            userRegistration.rejected(error, "error", userData)
         );
      
         expect(state).toEqual({
            user: null,
            loading: false,
            error: error.message,
            users: []
         });
      });

      test("getSingleUser should handle rejection", async () => {
        const userId = 1;
        const error = new Error("Failed to fetch user");
        const action = getSingleUser.rejected(error, 'rejected', userId.toString());
        const state = userReducer(initialState, action);
      
        expect(state).toEqual({
          ...initialState,
          loading: false,
          error: error.message,
        });
      });

      test("login should have error", () => {
         const credentials = {
            email: 'a@a.a',
            password: 'a'
         };

         const state = userReducer(
            initialState,
            userLogin.rejected(error, "error", credentials)
         );
      
         expect(state).toEqual({
            user: userState,
            loading: false,
            error: error.message,
            users: []
         });
      })

      test("updating profile should have error", async () => {
         const error = new Error("Failed to update profile");
         const updateData = {
            id: loggedInUser.id,
            firstName: 'UpdatedFirstName',
            lastName: 'UpdatedLastName',
            email: 'updatedEmail@aa.aa',
            password: loggedInUser.password,
            avatar: loggedInUser.avatar,
            username: loggedInUser.username,
            status: UserStatus.ACTIVE,
            role: "ADMIN" as "ADMIN" | "CUSTOMER",
         };
      
         jest.spyOn(axios, 'put').mockRejectedValueOnce(error);
      
         const dispatch: Dispatch<UnknownAction> = jest.fn();
         const getState = () => {};
      
         await updateUserProfile(updateData)(dispatch, getState, null);
      
         expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
           type: updateUserProfile.rejected.type,
           error: expect.objectContaining({ message: expect.any(String) }),
           meta: expect.objectContaining({
             arg: expect.objectContaining({
               id: updateData.id,
               firstName: updateData.firstName,
               lastName: updateData.lastName,
               email: updateData.email,
               password: updateData.password,
               avatar: updateData.avatar,
               username: updateData.username,
             }),
             rejectedWithValue: true,
           }),
         }));
      
         const state = userReducer(initialState, updateUserProfile.rejected(error, '', updateData));
      
         expect(state).toEqual({
            user: userState,
            loading: false,
            error: error.message,
            users: []
         });
      });

      test("logout should have error", () => {
   const error = new Error("error"); // Ensure this is defined if not already
   const state = userReducer(
      initialState,
      userLogout.rejected(error, "error")
   );

   expect(state).toEqual({
      user: null,
      loading: false,
      error: error.message,
      users: []
   });
});

      test("updatePassword should handle rejection", async () => {
         const updatePayload = { id: 1, oldPassword: "oldPass", newPassword: "newPass" };
         const error = new Error("Failed to update password");
         const action = updatePassword.rejected(error, 'rejected', updatePayload);
         const state = userReducer(initialState, action);
      
         expect(state).toEqual({
            user: null,
            loading: false,
            error: error.message,
            users: [],
         });
      });
   })
})