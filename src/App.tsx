import React from 'react'
import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'
import "./App.css";

import Profile from "./components/Profile"
import Cart from "./components/Cart";
import NavBar from "./components/NavBar";
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ItemPage from './pages/ItemPage';
import CreateProductPage from './pages/CreateProductPage';

function App() {
  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Profile/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/registration" element={<RegisterPage/>}/>
        <Route path="/products" element={<ProductsPage/>}/>
        <Route path="/products/:id" element={<ItemPage/>}/>
        <Route path="/createNew" element={<CreateProductPage/>}/>
        <Route path="/cart" element={<Cart/>}/>
      </Routes>
    </div>
  )
}

export default App;
