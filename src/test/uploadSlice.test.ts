import axios from "axios";
import { UploadState } from "../misc/type";
import uploadReducer, { uploadImage } from "../redux/slices/uploadSlice";

const initialState: UploadState = {
   loading: false,
   imageUrl: null,
   error: null,
}

describe('uploadImage thunk', () => {
   test('should handle pending state', async () => {
      const action = uploadImage.pending('pending', new File([], 'image.jpg'));
      const state = uploadReducer(initialState, action);
      expect(state).toEqual({
         ...initialState,
         loading: true,
         error: null,
      });
   });

  it('should handle fulfilled state correctly', async () => {
    const mockImageUrl = 'http://example.com/image.jpg';
    const action = uploadImage.fulfilled(mockImageUrl, 'fulfilled', new File([], 'image.jpg'));
    const state = uploadReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: false,
      imageUrl: mockImageUrl,
      error: null,
    });
  });

  it('should handle rejected state correctly', async () => {
    const error = new Error('Failed to upload image');
const action = uploadImage.rejected(error, 'rejected', new File([], 'image.jpg'));
    const state = uploadReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: [error.message],
      imageUrl: null,
    });
  });
});