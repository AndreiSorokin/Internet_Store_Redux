import React from 'react'
import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'
import "./App.css";

import ProductList from "./components/ProductList";
import ProductItem from "./components/ProductItem";
import Profile from "./components/Profile"
import Cart from "./components/Cart";
import NavBar from "./components/NavBar";
import Login from './components/Login';

function App() {
  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Profile/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/products" element={<ProductList/>}/>
        <Route path="/products/:id" element={<ProductItem/>}/>
        <Route path="/cart" element={<Cart/>}/>
      </Routes>
    </div>
  )
}

export default App;
