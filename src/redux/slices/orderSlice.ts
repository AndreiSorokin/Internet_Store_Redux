import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';

import { CartState, Order, OrderState } from '../../misc/type';
import axios from 'axios';

const initialState: OrderState = {
   orders: [],
   loading: false,
   error: null,
};

export const fetchOrdersByUserId = createAsyncThunk(
   "fetchOrdersByUserId",
   async (userId: number, { rejectWithValue }) => {
      try {
         const response = await axios.get(`http://localhost:8080/api/v1/orders/${userId}/get-orders`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
         });
         return response.data;
      } catch (error) {
         return rejectWithValue(error);
      }
   }
);

export const fetchOrders = createAsyncThunk(
   "fetchOrders",
   async () => {
      try {
         const response = await axiosInstance.get("http://localhost:8080/api/v1/orders");
         const data = response.data;
         return data;
      } catch (error) {
         throw error;
      }
   }
)

export const fetchSingleOrder = createAsyncThunk(
   "fetchSingleOrder",
   async (id: string) => {
      try {
         const response = await axiosInstance.get(`http://localhost:8080/api/v1/orders/admin/${id}`);
         const data = response.data;
         return data;
      } catch (error) {
         throw error;
      }
   }
)

export const createOrder = createAsyncThunk(
   "createOrder",
   async ({ userId, order }: { userId: number, order: CartState }, { rejectWithValue }) => {
      try {
         const response = await axios.post(`http://localhost:8080/api/v1/orders/${userId}`, JSON.stringify(order), {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
               "Content-Type": "application/json"
            },
         })
         const data = await response.data;
         console.log('createOrder', response.data)
         return data;
      } catch (error) {
         return rejectWithValue(error)
      }
})

export const deleteOrder = createAsyncThunk(
   "deleteOrder",
   async (id: string, { rejectWithValue }) => {
      try {
         const response = await axiosInstance.delete(`http://localhost:8080/api/v1/orders/${id}`, {
            headers: {
               "Content-Type": "application/json"
            }
         })
         const data = await response.data;
         return data;
      } catch (error) {
         return rejectWithValue(error)
      }
   })

const orderSlice = createSlice({
   name: 'order',
   initialState,
   reducers: {},
   extraReducers(builder) {
      builder.addCase(fetchOrdersByUserId.fulfilled, (state, action) => {
         return {
            orders: action.payload,
            loading: false,
            error: null,
         }
      })
      builder.addCase(fetchOrdersByUserId.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null,
         }
      })
      builder.addCase(fetchOrdersByUserId.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error",
         }
      })
      builder.addCase(deleteOrder.fulfilled, (state, action) => {
         // const orderId = Number(action.payload);
         return {
            ...state,
            loading: false,
            error: null,
            orders: state.orders.filter(order => order.id !== action.payload)
         }
      })
      builder.addCase(deleteOrder.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null
         }
      })
      builder.addCase(deleteOrder.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      })
      builder.addCase(createOrder.fulfilled, (state, action) => {
         return {
            ...state,
            orders: [...state.orders, action.payload],
            loading: false,
            error: null
         }
      })
      builder.addCase(createOrder.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null
         }
      })
      builder.addCase(createOrder.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      })
      builder.addCase(fetchOrders.fulfilled, (state, action) => {
         return {
            ...state,
            orders: action.payload,
            loading: false,
            error: null
         }
      })
      builder.addCase(fetchOrders.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null
         }
      })
      builder.addCase(fetchOrders.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      })
      builder.addCase(fetchSingleOrder.fulfilled, (state, action) => {
         return {
            ...state,
            order: action.payload,
            loading: false,
            error: null
         }
      })
      builder.addCase(fetchSingleOrder.pending, (state) => {
         return {
            ...state,
            loading: true,
            error: null
         }
      })
      builder.addCase(fetchSingleOrder.rejected, (state, action) => {
         return {
            ...state,
            loading: false,
            error: action.error.message ?? "error"
         }
      })
   }
})

const orderReducer = orderSlice.reducer;
export default orderReducer;