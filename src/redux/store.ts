import { configureStore } from "@reduxjs/toolkit";

import productsReducer from "./slices/productSlice";
import { useDispatch } from "react-redux";

// store all states
const store = configureStore({
   reducer: {
      products: productsReducer
   },
});
export type AppState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();

export default store;