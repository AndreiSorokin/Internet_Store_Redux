import {
  Routes, Route,
  Navigate
} from 'react-router-dom'
import "./App.css";

import NavBar from "./components/NavBar";
import ProductsPage from './pages/product/ProductsPage';
import LoginPage from './pages/user/LoginPage';
import RegisterPage from './pages/user/RegisterPage';
import ItemPage from './pages/product/ItemPage';
import CreateProductPage from './pages/product/CreateProductPage';
import ProfilePage from './pages/user/ProfilePage';
import CartPage from './pages/cart/CartPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path='/' element={<LandingPage/>}></Route>
        <Route path="/auth/profile" element={<ProfilePage/>}/>
        <Route path="/auth/login" element={<LoginPage/>}/>
        <Route path="/registration" element={<RegisterPage/>}/>
        <Route path="/products" element={<ProductsPage/>}/>
        <Route path="/products/:id" element={<ItemPage/>}/>
        <Route path="/createNew" element={<CreateProductPage/>}/>
        <Route path="/cart" element={<CartPage/>}/>
        <Route path='*' element={<Navigate to='/' replace/>}/>
      </Routes>
    </div>
  )
}

export default App;
