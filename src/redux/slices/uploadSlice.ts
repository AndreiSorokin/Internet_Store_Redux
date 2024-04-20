import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface UploadState {
   loading: boolean;
   imageUrl: string | null;
   error: string[] | null;
}

const initialState: UploadState = {
   loading: false,
   imageUrl: null,
   error: null,
};

export const uploadImage = createAsyncThunk(
   "uploadAvatar",
   async (imageFile: File, { rejectWithValue }) => {
      const formData = new FormData();
      formData.append("image", imageFile);
      try {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}/uploads`, {
            method: "POST",
            body: formData,
         });
         const data = await response.json();
         if (response.status !== 200) {
            throw new Error(data.message || "Failed to upload image");
         }
         return data.imageUrl;
      } catch (error) {
         return rejectWithValue(error);
      }
   }
);

const uploadSlice = createSlice({
   name: 'upload',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(uploadImage.pending, (state) => {
            return {
               ...state,
               loading: true,
               error: null
            }
         })
         .addCase(uploadImage.fulfilled, (state, action) => {
            return {
               ...state,
               loading: false,
               error: null,
               imageUrl: action.payload
            }
         })
         .addCase(uploadImage.rejected, (state, action) => {
            return {
               ...state,
               loading: false,
               error: [action.error.message ?? "error"]
            }
      });
   },
});

const uploadReducer = uploadSlice.reducer;
export default uploadReducer;