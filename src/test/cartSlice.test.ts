// import axios from "axios";
// import { CartItem } from "../misc/type";
// import cartReducer, { addProductToCart, addToCart, clearCart, getCart, getCartFromLocalStorage, removeFromCart, updateCartItemQuantity } from "../redux/slices/cartSlice";

// const initialState = {
//   items: getCartFromLocalStorage(),
//   loading: false,
//   error: null,
// };

// jest.mock('axios', () => ({
//   get: jest.fn(),
//   post: jest.fn(),
// }));

// const mockedAxios = jest.mocked(axios, true);

// describe('cart reducer', () => {

//   describe("fulfilled", () => {
//     test('should add product to cart', async () => {
//       const mockProductData = { productId: 2, quantity: 1 };
//       const userId = 1;
//       const mockResponseData = {
//         id: 1,
//         userId: userId,
//         items: [{ product: { id: 2, title: 'Product B' }, quantity: 1 }],
//       };
    
//       mockedAxios.post.mockResolvedValue({ data: mockResponseData });
    
//       const dispatch = jest.fn();
//       const getState = jest.fn();
    
//       await addProductToCart({ userId, productId: mockProductData.productId, quantity: mockProductData.quantity })(dispatch, getState, undefined);
    
//       expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
//         type: addProductToCart.fulfilled.type,
//         payload: mockResponseData,
//       }));
//     });

//     test('should handle fetching cart', async () => {
//       const userId = 1;
//       const mockCartData = [
//         { product: { id: 1, title: 'Product A' }, quantity: 2 },
//         { product: { id: 2, title: 'Product B' }, quantity: 3 },
//       ];
    
//       mockedAxios.get.mockResolvedValue({ data: mockCartData });
    
//       const dispatch = jest.fn();
//       const getState = jest.fn();
    
//       await getCart(userId)(dispatch, getState, undefined);
  
//       expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
//         type: getCart.fulfilled.type,
//         payload: mockCartData,
//       }));
//     });
  
//     test('should add item to cart if it does not exist', () => {
  
//       const action = {
//         payload: {
//           product: {
//             id: 1,
//             title: 'Product A',
//             price: 10,
//             description: 'Description of Product A',
//             category: { id: 1, name: 'Category A', image: 'image-url' },
//             images: ['image-url1', 'image-url2'],
//           },
//           quantity: 2,
//         },
//       };
  
//      const nextState = cartReducer(initialState, addToCart(action.payload as unknown as CartItem));
  
//       expect(nextState.items.length).toBe(1);
//       expect(nextState.items[0].product.id).toBe(1);
//       expect(nextState.items[0].quantity).toBe(2);
//     });
  
//     test('should remove item from cart if it exists', () => {
  
//       const addToCartAction = {
//         payload: {
//           product: {
//             id: 1,
//             title: 'Product A',
//             price: 10,
//             description: 'Description of Product A',
//             category: { id: 1, name: 'Category A', image: 'image-url' },
//             images: ['image-url1', 'image-url2'],
//           },
//           quantity: 2,
//         },
//       };
      
//       const stateAfterAddition = cartReducer(initialState, addToCart(addToCartAction.payload as unknown as CartItem));
  
//       const removeFromCartAction = {
//         payload: 1,
//       };
  
//       const stateAfterRemoval = cartReducer(stateAfterAddition, removeFromCart(removeFromCartAction.payload));
      
//       expect(stateAfterRemoval.items.length).toBe(0);
//     });
  
//     test('should update quantity of existing item in the cart', () => {
  
//       const addToCartAction = {
//         payload: {
//           product: {
//             id: 1,
//             title: 'Product A',
//             price: 10,
//             description: 'Description of Product A',
//             category: { id: 1, name: 'Category A', image: 'image-url' },
//             images: ['image-url1', 'image-url2'],
//           },
//           quantity: 2,
//         },
//       };
  
//       const stateAfterAddition = cartReducer(initialState, addToCart(addToCartAction.payload as unknown as CartItem));
  
//       const updateQuantityAction = {
//         payload: {
//           productId: 1,
//           quantity: 5,
//         },
//       };
  
//       const stateAfterUpdate = cartReducer(stateAfterAddition, updateCartItemQuantity(updateQuantityAction.payload));
  
//       expect(stateAfterUpdate.items.length).toBe(1);
//       expect(stateAfterUpdate.items[0].product.id).toBe(1);
//       expect(stateAfterUpdate.items[0].quantity).toBe(5);
//     });
  
//     test('should clear all items from the cart', () => {
  
//       const addToCartAction1 = {
//         payload: {
//           product: {
//             id: 1,
//             title: 'Product A',
//             price: 10,
//             description: 'Description of Product A',
//             category: { id: 1, name: 'Category A', image: 'image-url' },
//             images: ['image-url1', 'image-url2'],
//           },
//           quantity: 2,
//         },
//       };
  
//       const stateAfterAddition = cartReducer(initialState, addToCart(addToCartAction1.payload as unknown as CartItem));
  
//       const stateAfterClearing = cartReducer(stateAfterAddition, clearCart());
  
//       expect(stateAfterClearing.items.length).toBe(0);
//     });
//   })

//   describe("pending", () => {
//     test('should have loading when adding product to cart is pending', () => {
//       const action = { type: addProductToCart.pending.type };
//       const state = cartReducer(initialState, action);
//       expect(state.loading).toBe(true);
//     });

//     test('should set loading when fetching cart is pending', () => {
//       const action = { type: getCart.pending.type };
//       const state = cartReducer(initialState, action);
//       expect(state.loading).toBe(true);
//     });
//   })

//   describe("rejected", () => {
//     test('should have error when adding product to cart', () => {
//       const errorAction = {
//         type: addProductToCart.rejected.type,
//         error: { message: 'Failed to add product to cart' },
//       };
//       const state = cartReducer(initialState, errorAction);
//       expect(state.loading).toBe(false);
//       expect(state.error).toEqual(errorAction.error.message);
//     });

//     test('should have error fetching cart', () => {
//       const errorAction = {
//         type: getCart.rejected.type,
//         error: { message: 'Failed to fetch cart' },
//       };
//       const state = cartReducer(initialState, errorAction);
//       expect(state.loading).toBe(false);
//       expect(state.error).toEqual(errorAction.error.message);
//     });
//   })
// });

export default {}