import axios from "axios";
import categoryReducer, { createCategory, deleteCategory, fetchCategories, fetchSingleCategory, updateCategory } from "../redux/slices/categorySlice";

const initialState = {
   categories: [
      { id: 1, name: "name", image: 'img' }
   ],
   loading: false,
   error: null,
};

const mockCategories = [
   {
      id: 1,
      name: "category1",
      image: 'img1'
   },
   {
      id: 2,
      name: "category2",
      image: 'img2'
   },
];

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockError = 'Error fetching orders';
mockedAxios.get.mockRejectedValueOnce(new Error(mockError));

describe("category reducer", () => {
   describe("fulfilled", () => {
      test("should fetch categories successfully", async () => {
         mockedAxios.get.mockResolvedValueOnce({ data: mockCategories });
         const action = await fetchCategories.fulfilled(mockCategories, 'fetchCategories');

         const state = categoryReducer(initialState, action);

         expect(state).toEqual({
            categories: mockCategories,
            loading: false,
            error: null,
         });
      });

      test("should fetch a single category", async () => {
         const mockCategory = { id: '1', name: "category1" };
         mockedAxios.get.mockResolvedValueOnce({ data: mockCategory });
         const action = await fetchSingleCategory.fulfilled(mockCategory, 'fetchSingleCategory', mockCategory.id);
 
         const state = categoryReducer(initialState, action);
 
         expect(state).toEqual({
             ...initialState,
             categories: mockCategory,
             loading: false,
             error: null,
         });
      });

      test("should update a category", async () => {
      const mockCategory = { id: 1, name: "updatedCategory", image: "" };
      mockedAxios.put.mockResolvedValueOnce({ data: mockCategory });
      const action = await updateCategory.fulfilled(mockCategory, 'updateCategory', { id: mockCategory.id.toString(), category: mockCategory });
      const state = categoryReducer(initialState, action);

      expect(state).toEqual({
          ...initialState,
          categories: [mockCategory],
          loading: false,
          error: null,
      });
      });

      test("should delete a category", async () => {
          const mockId = '1';
          const initialStateWithCategories = {
              ...initialState,
              categories: [
                  { id: 1, name: "category1", image: 'img1' },
                  { id: 2, name: "category2", image: 'img2' }
              ],
          };
          mockedAxios.delete.mockResolvedValueOnce({ data: mockId });
          const action = await deleteCategory.fulfilled(mockId, 'deleteCategory', mockId);
          const state = categoryReducer(initialStateWithCategories, action);
      
          expect(state).toEqual({
              ...initialStateWithCategories,
              loading: false,
              error: null,
              categories: initialStateWithCategories.categories.filter(category => category.id.toString() !== mockId),
          });
      });

      test("should create a category", async () => {
          const mockCategory = { id: 3, name: "newCategory", image: 'img3' };
          mockedAxios.post.mockResolvedValueOnce({ data: mockCategory });
          const formData = new FormData();
          const action = await createCategory.fulfilled(mockCategory, 'createCategory', formData);
          const state = categoryReducer(initialState, action);
      
          expect(state).toEqual({
              ...initialState,
              categories: [...initialState.categories, mockCategory],
              loading: false,
              error: null,
          });
      });
   })

   describe("pending", () => {
      test("should set loading to true while fetching categories", () => {
         const action = { type: fetchCategories.pending.type, meta: { requestId: '1', arg: '' } };
         const state = categoryReducer(initialState, action);
   
         expect(state).toEqual({
            ...initialState,
            loading: true,
         });
      });

      test("should set loading to true while fetching a single category", () => {
          const action = { type: fetchSingleCategory.pending.type, meta: { requestId: '1', arg: '1' } };
          const state = categoryReducer(initialState, action);
      
          expect(state).toEqual({
              ...initialState,
              loading: true,
          });
      });

      test("should set loading to true while updating a category", () => {
          const action = { type: updateCategory.pending.type, meta: { requestId: '1', arg: { id: '1', category: { name: "updatedCategory", image: "" } } } };
          const state = categoryReducer(initialState, action);
      
          expect(state).toEqual({
              ...initialState,
              loading: true,
          });
      });

      test("should set loading to true while deleting a category", () => {
          const action = { type: deleteCategory.pending.type, meta: { requestId: '1', arg: '1' } };
          const state = categoryReducer(initialState, action);
      
          expect(state).toEqual({
              ...initialState,
              loading: true,
          });
      });

      test("should set loading to true while creating a category", () => {
          const action = { type: createCategory.pending.type, meta: { requestId: 'requestId-placeholder', arg: {} } };
          const state = categoryReducer(initialState, action);
      
          expect(state).toEqual({
              ...initialState,
              loading: true,
          });
      });
   })

   describe("rejected", () => {
      test("should set error when fetching categories fails", () => {
         const error = 'Error fetching categories';
         const action = { type: fetchCategories.rejected.type, error: { message: error } };
   
         const state = categoryReducer(initialState, action);
   
         expect(state).toEqual({
            ...initialState,
            loading: false,
            error: error,
         });
      });

      test("should set error when fetching a single category", () => {
          const error = 'Error fetching single category';
          const action = { type: fetchSingleCategory.rejected.type, error: { message: error }, meta: { arg: '1', requestId: '1', rejectedWithValue: false } };
          const state = categoryReducer(initialState, action);
      
          expect(state).toEqual({
              ...initialState,
              loading: false,
              error: error,
          });
      });

      test("should set error when updating a category fails", () => {
          const error = 'Error updating category';
          const action = { type: updateCategory.rejected.type, error: { message: error }, meta: { requestId: '1', arg: { id: '1', category: { name: "updatedCategory", image: "" } } } };
          const state = categoryReducer(initialState, action);
      
          expect(state).toEqual({
              ...initialState,
              loading: false,
              error: error,
          });
      });

      test("should set error when deleting a category fails", () => {
          const error = 'Error deleting category';
          const action = { type: deleteCategory.rejected.type, error: { message: error }, meta: { requestId: '1', arg: '1' } };
          const state = categoryReducer(initialState, action);
      
          expect(state).toEqual({
              ...initialState,
              loading: false,
              error: error,
          });
      });

      test("should set error when creating a category fails", () => {
          const error = 'Error creating category';
          const action = { type: createCategory.rejected.type, error: { message: error }, meta: { requestId: '1', arg: {} } };
          const state = categoryReducer(initialState, action);
      
          expect(state).toEqual({
              ...initialState,
              loading: false,
              error: error,
          });
      });
   });
})