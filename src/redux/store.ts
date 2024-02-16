import { configureStore } from "@reduxjs/toolkit";

import productsReducer from "./slices/productSlice";
import singleProductReducer from "./slices/singleProductSlice"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const store = configureStore({
   reducer: {
      products: productsReducer,
      singleProduct: singleProductReducer
   },
});
export type AppState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export default store;