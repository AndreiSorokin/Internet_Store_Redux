// import axios from 'axios';
// import { LoggedInUser, User } from '../misc/type'
// import userReducer, { clearUser, fetchUserProfile, getUserInput, setUser, switchRole, updateUserProfile, userLogin, userLogout, userRegistration } from '../redux/slices/userSlice'
// import { Dispatch, UnknownAction } from '@reduxjs/toolkit';
// import store from '../redux/store';

// const userState: User | null = null;

// const initialState = {
//    user: userState,
//    loading: false,
//    error: null 
// }

// const userData: User = {
//    email: 'test@example.com',
//    password: 'testpassword',
//    name: 'Test User',
//    avatar: 'avatar-url'
// };

// const BASE_URL = 'https://api.escuelajs.co/api/v1'

// const loggedInUser: LoggedInUser = {
//    id: 1,
//    email: 'aa@aa.aa',
//    name: 'name',
//    password: 'password',
//    role: 'customer',
//    avatar: 'avatar'
// };

// describe("user reducer", () => {

//    describe("fulfilled", () => {
//       test("should register a user", async () => {
      
//          const mockApiResponse = {
//             id: '123',
//             ...userData
//          };
      
//          jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: mockApiResponse });
      
//          const dispatch: Dispatch<UnknownAction> = jest.fn();
      
//          await userRegistration(userData)(dispatch, () => {}, null);
      
//          const state = userReducer(initialState, userRegistration.fulfilled(mockApiResponse, '', userData));
      
//          expect(state).toEqual({
//             user: mockApiResponse,
//             loading: false,
//             error: null,
//          });
//       });

//       test("should fetch user profile", async() => {
//          const access_token = 'mock-token';
//          const mockApiResponse = {
//             id: 1,
//             email: "john@mail.com",
//             password: "changeme",
//             name: "Jhon",
//             role: "customer",
//             avatar: "avatar"
//          }
//          localStorage.setItem('token', access_token);

//          jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: mockApiResponse });

//          const dispatch = jest.fn();
//          const getState = jest.fn();

//          await fetchUserProfile()(dispatch, getState, null);

//          const state = userReducer(initialState, fetchUserProfile.fulfilled(mockApiResponse, "fullfilled"));

//          expect(state).toEqual({
//             user: mockApiResponse,
//             loading: false,
//             error: null,
//          });
//       })
      
//       test("should login", async () => {
//          const credentials = {
//             email: 'a@a.a',
//             password: 'a'
//          };
      
//          const mockApiResponse = {
//             id: '123',
//             email: credentials.email,
//          };
      
//          jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: mockApiResponse });
      
//          const dispatch: Dispatch<UnknownAction> = jest.fn();
      
//          await userLogin(credentials)(dispatch, () => {}, null);
      
//          const state = userReducer(initialState, userLogin.fulfilled(mockApiResponse, '', credentials));
      
//          expect(state).toEqual({
//             user: mockApiResponse,
//             loading: false,
//             error: null,
//          });
//       });

//       test('should update user profile', async () => {
         
//          const updatedUser = {
//             ...loggedInUser,
//             name: 'updatedName',
//             email: 'updatedEmail@aa.aa'
//          }

//          jest.spyOn(axios, 'put').mockResolvedValueOnce({ data: updatedUser });

//          const dispatch = jest.fn();
//          await dispatch(updateUserProfile(loggedInUser))

//          const action = fetchUserProfile.fulfilled(updatedUser, '1')
//          const state = userReducer(initialState, action);
         
//          expect(state.user?.name).toBe('updatedName');
//          expect(state.user?.email).toBe('updatedEmail@aa.aa');
//       });

//       test("should switch roles", async () => {
//          const switchedUser = {
//             ...loggedInUser,
//             role: 'admin'
//          }

//          jest.spyOn(axios, 'put').mockResolvedValueOnce({ data: switchedUser });

//          const dispatch = jest.fn();
//          await dispatch(switchRole(loggedInUser))

//          const action = switchRole.fulfilled(switchedUser, '', loggedInUser)
//          const state = userReducer(initialState, action);
         
//          expect((state.user as LoggedInUser)?.role).toBe('admin');
//       })

//       test("should logout", async () => {
//          const localStorageRemoveItemMock = jest.fn();
//          global.localStorage.removeItem = localStorageRemoveItemMock.mockReturnValue(undefined);
   
//          const dispatch: Dispatch<UnknownAction> = jest.fn();
   
//          const resultAction = await userLogout()(dispatch, () => {}, null);
   
//          expect(resultAction.type).toBe(userLogout.fulfilled.type);
   
//          const stateAfterLogout = userReducer(initialState, resultAction);
//          expect(stateAfterLogout.loading).toBe(false);
//          expect(stateAfterLogout.error).toBe(null);
   
//          expect(stateAfterLogout.user).toBeNull();
   
//          const stateAfterClearUser = userReducer(stateAfterLogout, clearUser());
   
//          expect(stateAfterClearUser.user).toBeNull();
//       });

//       test("should get user input", () => {
//          const userInput = {
//             email: 'test@example.com',
//             password: 'testpassword',
//             name: 'Test User',
//             avatar: 'avatar-url'
//          };
      
//          const state = userReducer(
//             initialState,
//             getUserInput(userInput)
//          );
      
//          expect(state).toEqual(
//             {
//                user: userInput,
//                loading: false,
//                error: null 
//             }
//          )
//       })

//       test("should set a user", () => {
//          const newState = userReducer(initialState, setUser(loggedInUser));
      
//          expect(newState.user).toEqual(loggedInUser);
//       })

//       test("should clear a user", () => {
//          const localStorageMock = {
//             removeItem: jest.fn(),
//          };
//          Object.defineProperty(window, 'localStorage', {
//             value: localStorageMock,
//          });
         
//          const state = userReducer(initialState, clearUser());
   
//          expect(localStorageMock.removeItem).toHaveBeenCalledWith('userInformation');
//          expect(state).toEqual({
//             user: null,
//             loading: false,
//             error: null
//          });
//       });
//    })

//    describe("pending", () => {
//       test("should have loading truthy when registration is pending", () => {

//          const state = userReducer(
//             initialState,
//             userRegistration.pending('', userData)
//          );
      
//          expect(state).toEqual({
//             user: userState,
//             loading: true,
//             error: null,
//          })
//       });

//       test("should have loading truthy when fetching profile is pending", () => {
//          const state = userReducer(
//             initialState,
//             fetchUserProfile.pending('pending')
//          );
      
//          expect(state).toEqual({
//             user: userState,
//             loading: true,
//             error: null,
//          })
//       })

//       test("should have loading truthy when logging in is pending", () => {
//          const credentials = {
//             email: 'a@a.a',
//             password: 'a'
//          };
         
//          const state = userReducer(
//             initialState,
//             userLogin.pending('', credentials)
//          );
      
//          expect(state).toEqual({
//             user: null,
//             loading: true,
//             error: null,
//          });
//       });

//       test("should have loading truthy when updating profile is pending", () => {

//          const state = userReducer(
//             initialState,
//             fetchUserProfile.pending('1')
//          );

//          expect(state).toEqual({
//             user: null,
//             loading: true,
//             error: null,
//          });
//       })

//       test("should have loading truthy when switching role is pending", () => {
//          const action = {
//             type: switchRole.pending.type,
//             meta: { arg: loggedInUser.id }
//          };
      
//          const state = userReducer(initialState, action);

//          expect(state).toEqual({
//             user: null,
//             loading: true,
//             error: null,
//          })
//       })

//       test("should have loading truthy when logging out is pending", () => {
      
//          const state = userReducer(
//             initialState,
//             userLogout.pending('', undefined, undefined)
//          );
      
//          expect(state).toEqual({
//             ...initialState,
//             loading: true,
//             error: null
//          })

//          expect(state).toEqual({
//             user: null,
//             loading: true,
//             error: null,
//          });
//       })
//    })

//    describe("rejected", () => {
//       const error = new Error("error");

//       test("registration should have error", () => {
//          const state = userReducer(
//             initialState,
//             userRegistration.rejected(error, "error", userData)
//          );
      
//          expect(state).toEqual({
//             user: null,
//             loading: false,
//             error: error.message,
//          });
//       });

//       test("fethicg profile should have error", () => {
//          const state = userReducer(
//             initialState,
//             fetchUserProfile.rejected(error, "error")
//          );
      
//          expect(state).toEqual({
//             user: null,
//             loading: false,
//             error: error.message,
//          });
//       })

//       test("login should have error", () => {
//          const credentials = {
//             email: 'a@a.a',
//             password: 'a'
//          };

//          const state = userReducer(
//             initialState,
//             userLogin.rejected(error, "error", credentials)
//          );
      
//          expect(state).toEqual({
//             user: userState,
//             loading: false,
//             error: error.message
//          });
//       })

//       test("updating profile should have error", () => {

//          const state = userReducer(
//             initialState,
//             fetchUserProfile.rejected(error, "error")
//          );
      
//          expect(state).toEqual({
//             user: userState,
//             loading: false,
//             error: error.message
//          });
//       })

//       test("switching role should have error", () => {
//          const action = {
//             type: switchRole.rejected.type,
//             error: error,
//             meta: { arg: loggedInUser.id }
//          };
      
//          const state = userReducer(initialState, action);

//          expect(state).toEqual({
//             user: userState,
//             loading: false,
//             error: error.message
//          });
//       })

//       test("logout should have error", () => {
//          const state = userReducer(
//             initialState,
//             userLogout.rejected(error, "error")
//          );

//          expect(state).toEqual({
//             user: userState,
//             loading: false,
//             error: error.message
//          });
//       })
//    })
// })

export default {}