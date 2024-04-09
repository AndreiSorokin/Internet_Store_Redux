import { configureStore } from "@reduxjs/toolkit";

import productsReducer from "./slices/productSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import userReducer from "./slices/userSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";

const store = configureStore({
   reducer: {
      products: productsReducer,
      userRegister: userReducer,
      cart: cartReducer,
      orders: orderReducer
   }
});
export type AppState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;


store.subscribe(() => {
   const currentState = store.getState();
   const userInformation = currentState.userRegister.user;
   const cartInformation = currentState.cart.items;
   const orderInformation = currentState.orders.orders;

   localStorage.setItem("userInformation", JSON.stringify(userInformation));
   localStorage.setItem("cartInformation", JSON.stringify(cartInformation));
   localStorage.setItem("orderInformation", JSON.stringify(orderInformation));
});

export default store;