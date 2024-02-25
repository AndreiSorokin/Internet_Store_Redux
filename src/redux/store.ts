import { configureStore } from "@reduxjs/toolkit";

import productsReducer from "./slices/productSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import userReducer from "./slices/userSlice";

const store = configureStore({
   reducer: {
      products: productsReducer,
      userRegister: userReducer
   },
});
export type AppState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

store.subscribe(() => {
   const currentState = store.getState();
   const userInformation = currentState.userRegister.user;
   localStorage.setItem("userInformation", JSON.stringify(userInformation));
});

export default store;