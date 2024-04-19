import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { CartItem } from '../../misc/type';

export const handlePayment = createAsyncThunk(
   'payment',
   async ({ userId, cartItems }: { userId: string; cartItems: CartItem }, { rejectWithValue }) => {
      try {
         const response = await axios.post('http://localhost:8080/api/v1/payment', { userId, cartItems });
         return response.data;
      } catch (error) {
         return rejectWithValue(error);
      }
   }
);