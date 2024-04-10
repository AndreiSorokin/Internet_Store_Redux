import orderReducer, { fetchOrders, deleteOrder, createOrder, fetchSingleOrder } from '../redux/slices/orderSlice';
import { Order, OrderState, Size } from '../misc/type'

const initialState: OrderState = {
   orders: [
      { id: 1, items: [
            { product: {
               id: 101,
               name: "name1",
               price: 1200.00,
               description: "description",
               category: { id: 1, name: "Electronics", image: "img" },
               images: ["img1", "img2"],
               size: Size.Medium
            }, quantity: 1 }
         ] },
      { id: 2, items: [
            { product: {
               id: 102,
               name: "name2",
               price: 800.00,
               description: "description",
               category: { id: 2, name: "Clothes", image: "img" },
               images: ["img1", "img2"],
               size: Size.Medium
            }, quantity: 1 }
         ] }
   ],
   loading: false,
   error: null,
};

describe('fulfilled', () => {
   test('should delete an order', () => {
      const action = { type: deleteOrder.fulfilled.type, payload: '1' };
      const state = orderReducer(initialState, action);
      expect(state.orders.length).toBe(1);
      expect(state.orders.find(order => order.id === 1)).toBeUndefined();
   });

   test('should create a new order', () => {
      const newOrderItems = [
         { product: {
            id: 103,
            name: "Tablet",
            price: 600.00,
            description: "Latest model tablet with high-resolution display",
            category: { id: 3, name: "Tablets", image: "tablet-category-image-url" },
            images: ["tablet-image1-url", "tablet-image2-url"],
            size: Size.Medium
         }, quantity: 2 }
      ];
   
      const newOrder: Order = { id: 3, items: newOrderItems };
      const action = { type: createOrder.fulfilled.type, payload: newOrder };
      const state = orderReducer(initialState, action);
   
      expect(state.orders.length).toBe(3);
      expect(state.orders.find(order => order.id === newOrder.id)).toEqual(newOrder);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
   });

   test('should fetch orders', () => {
      const fetchedOrders = [
         { id: 1, items: [
               { product: {
                  id: 101,
                  name: "name1",
                  price: 1200.00,
                  description: "description",
                  category: { id: 1, name: "Electronics", image: "img" },
                  images: ["img1", "img2"],
                  size: Size.Medium
               }, quantity: 1 }
            ] },
         { id: 2, items: [
               { product: {
                  id: 102,
                  name: "name2",
                  price: 800.00,
                  description: "description",
                  category: { id: 2, name: "Clothes", image: "img" },
                  images: ["img1", "img2"],
                  size: Size.Medium
               }, quantity: 1 }
            ] }
      ];

      const action = { type: fetchOrders.fulfilled.type, payload: fetchedOrders };
      const state = orderReducer(initialState, action);

      expect(state.orders).toEqual(fetchedOrders);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
   });

   test('should update the fetched order in the state', () => {
      const singleOrder = {
         id: 1,
         items: [
            { product: {
               id: 101,
               name: "name1",
               price: 1200.00,
               description: "description",
               category: { id: 1, name: "Electronics", image: "img" },
               images: ["img1", "img2"],
               size: Size.Medium
            }, quantity: 1 }
         ]
      };
   
      const action = { type: fetchSingleOrder.fulfilled.type, payload: singleOrder };
      const state = orderReducer(initialState, action);
   
      expect(state.orders).toContainEqual(singleOrder);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
   });

});

describe('pending', () => {
   test('should set loading to true on deleteOrder', () => {
      const action = { type: deleteOrder.pending.type };
      const state = orderReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
   });

   test('should set loading to true on createOrder', () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
   });

   test('should set loading to true on fetchOrders', () => {
      const action = { type: fetchOrders.pending.type };
      const state = orderReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
   });

   test('should set loading to true on fetchSingleOrder', () => {
      const action = { type: fetchSingleOrder.pending.type };
      const state = orderReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
   });
})

describe('rejected', () => {
   test('should set error on deleteOrder', () => {
      const errorMessage = "Error";
      const action = { type: deleteOrder.rejected.type, error: { message: errorMessage } };
      const state = orderReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
   });

   test('should set error on createOrder', () => {
      const errorMessage = "Error";
      const action = { type: createOrder.rejected.type, error: { message: errorMessage } };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
   });

   test('should set error on fetchOrders', () => {
      const errorMessage = "Error";
      const action = { type: fetchOrders.rejected.type, error: { message: errorMessage } };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
   });

   test('should set error on fetchSingleOrder', () => {
      const errorMessage = "Failed to fetch order";
      const action = { type: fetchSingleOrder.rejected.type, error: { message: errorMessage } };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
   });
})