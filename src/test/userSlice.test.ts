import axios from 'axios';
import { InitialStateUser, LoggedInUser, User, UserStatus } from '../misc/type'
import userReducer, { clearUser, getUserInput, setUser, switchRole, updateUserProfile, userLogin, userLogout, userRegistration } from '../redux/slices/userSlice'
import { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import store from '../redux/store';

const userState: User | null = null;

const initialState: InitialStateUser = {
   user: userState,
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
      id: 1
   },
   status: UserStatus.ACTIVE,
   cart: { items: [] },
   orders: { orders: [] }
};
const BASE_URL = 'http://localhost:8080/api/v1'

describe("user reducer", () => {

   describe("fulfilled", () => {
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
            ...currentUserData,
         };
      
         const updatedUser = {
            ...loggedInUser,
            firstName: updateData.firstName,
            lastName: updateData.lastName,
            email: updateData.email
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

      test("should switch roles", async () => {
         const switchedUser = {
            ...loggedInUser,
            role: 'admin'
         }

         jest.spyOn(axios, 'put').mockResolvedValueOnce({ data: switchedUser });

         const dispatch = jest.fn();
         await dispatch(switchRole(loggedInUser))

         const action = switchRole.fulfilled(switchedUser, '', loggedInUser)
         const state = userReducer(initialState, action);
         
         expect((state.user as LoggedInUser)?.role).toBe('admin');
      })

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
               error: null 
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
            error: null
         });
      });
   })

   describe("pending", () => {
      test("should have loading truthy when registration is pending", () => {

         const state = userReducer(
            initialState,
            userRegistration.pending('', userData)
         );
      
         expect(state).toEqual({
            user: userState,
            loading: true,
            error: null,
         })
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
            updateUserProfile.pending('', { id: loggedInUser.id, firstName: 'UpdatedFirstName', lastName: 'UpdatedLastName', email: 'updatedEmail@aa.aa', ...currentUserData })
         );
      
         expect(state).toEqual({
            ...initialState,
            loading: true,
            error: null,
         });
      });

      test("should have loading truthy when switching role is pending", () => {
         const action = {
            type: switchRole.pending.type,
            meta: { arg: loggedInUser.id }
         };
      
         const state = userReducer(initialState, action);

         expect(state).toEqual({
            user: null,
            loading: true,
            error: null,
         })
      })

      test("should have loading truthy when logging out is pending", () => {
      
         const state = userReducer(
            initialState,
            userLogout.pending('', undefined, undefined)
         );
      
         expect(state).toEqual({
            ...initialState,
            loading: true,
            error: null
         })

         expect(state).toEqual({
            user: null,
            loading: true,
            error: null,
         });
      })
   })

   describe("rejected", () => {
      const error = new Error("error");

      test("registration should have error", () => {
         const state = userReducer(
            initialState,
            userRegistration.rejected(error, "error", userData)
         );
      
         expect(state).toEqual({
            user: null,
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
            error: error.message
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
         });
      });

      test("switching role should have error", () => {
         const action = {
            type: switchRole.rejected.type,
            error: error,
            meta: { arg: loggedInUser.id }
         };
      
         const state = userReducer(initialState, action);

         expect(state).toEqual({
            user: userState,
            loading: false,
            error: error.message
         });
      })

      test("logout should have error", () => {
         const state = userReducer(
            initialState,
            userLogout.rejected(error, "error")
         );

         expect(state).toEqual({
            user: userState,
            loading: false,
            error: error.message
         });
      })
   })
})