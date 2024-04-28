import { configureStore } from "@reduxjs/toolkit";

import productsReducer from "./slices/productSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import userReducer from "./slices/userSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import categoryReducer from "./slices/categorySlice";
import { LoggedInUser } from "../misc/type";

const store = configureStore({
   reducer: {
      products: productsReducer,
      userRegister: userReducer,
      cart: cartReducer,
      orders: orderReducer,
      categories: categoryReducer
   }
});
export type AppState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;


store.subscribe(() => {
   const currentState = store.getState();
   // const userInformation = currentState.userRegister.user as LoggedInUser;
   const cartInformation = currentState.cart.items;
   const orderInformation = currentState.orders.orders;
   const categoryInformation = currentState.categories.categories;

   localStorage.setItem("cartInformation", JSON.stringify(cartInformation));
   localStorage.setItem("orderInformation", JSON.stringify(orderInformation));
   localStorage.setItem("categoryInformation", JSON.stringify(categoryInformation));
});

export default store;