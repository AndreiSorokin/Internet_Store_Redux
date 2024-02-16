import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface SingleProductState {
   product: any;
   loading: boolean;
   error: string | null;
}

const initialState: SingleProductState = {
   product: null,
   loading: false,
   error: null,
};
const BASE_URL = 'https://api.escuelajs.co/api/v1/products';


export const fetchSingleProduct = createAsyncThunk(
   "fetchSingleProduct",
   async (id: string) => {
      try {
         const response = await axios.get(`${BASE_URL}/${id}`);
         return response.data;
      } catch (error) {
         console.error('Error fetching single product:', error);
         throw error;
      }
   }
);

const singleProductSlice = createSlice({
   name: "singleProduct",
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder.addCase(fetchSingleProduct.pending, (state) => {
         state.loading = true;
         state.error = null;
      });
      builder.addCase(fetchSingleProduct.fulfilled, (state, action) => {
         state.loading = false;
         state.product = action.payload;
      });
      builder.addCase(fetchSingleProduct.rejected, (state, action) => {
         state.loading = false;
      });
   },
});

export default singleProductSlice.reducer;
