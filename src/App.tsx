import {
  Routes, Route,
  Navigate
} from 'react-router-dom'
import "./App.css";

import NavBar from "./components/NavBar";
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ItemPage from './pages/ItemPage';
import CreateProductPage from './pages/CreateProductPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
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
