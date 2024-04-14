import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';

import { Order, OrderState } from '../../misc/type';

const initialState: OrderState = {
   orders: [],
   loading: false,
   error: null,
};

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
   async ({ userId, order }: { userId: number, order: Order }, { rejectWithValue }) => {
      try {
         const response = await axiosInstance.post(`http://localhost:8080/api/v1/orders/${userId}`, {
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
         })
         const data = await response.data;
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
      builder.addCase(deleteOrder.fulfilled, (state, action) => {
         const orderId = Number(action.payload);
         return {
            ...state,
            loading: false,
            error: null,
            orders: state.orders.filter(order => order.id !== orderId)
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