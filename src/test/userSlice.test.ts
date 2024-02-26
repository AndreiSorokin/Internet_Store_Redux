import axios from 'axios';
import { User } from '../misc/type'
import userReducer, { clearUser, userLogin, userLogout, userRegistration } from '../redux/slices/userSlice'
import { Dispatch, UnknownAction } from '@reduxjs/toolkit';

const userState: User | null = null;

const initialState = {
   user: userState,
   loading: false,
   error: null 
}

const userData: User = {
   email: 'test@example.com',
   password: 'testpassword',
   name: 'Test User',
   avatar: 'avatar-url'
};

describe("user reducer", () => {

   describe("fulfilled", () => {
      test("should register a user", async () => {
         const userData = {
            email: 'test@example.com',
            password: 'testpassword',
            name: 'Test User',
            avatar: 'avatar-url'
         };
      
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