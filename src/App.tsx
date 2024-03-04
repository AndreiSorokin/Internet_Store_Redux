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
import { AppState, useAppSelector } from './redux/store';
import { LoggedInUser } from './misc/type';

function App() {
  const user = useAppSelector((state: AppState) => state.userRegister.user) as LoggedInUser;

  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path='/' element={<LandingPage/>}></Route>
        <Route
          path='/auth/profile'
          element={user ? <ProfilePage/> : <Navigate to="/" replace />}
        />
        <Route path="/auth/login" element={<LoginPage/>}/>
        <Route path="/registration" element={<RegisterPage/>}/>
        <Route path="/products" element={<ProductsPage/>}/>
        <Route path="/products/:id" element={<ItemPage/>}/>
        <Route
          path="/createNew"
          element={user ? <CreateProductPage /> : <Navigate to="/" replace />}
        />
        <Route
          path='cart'
          element={user ? <CartPage/> : <Navigate to="/" replace />}
        />
        <Route path='*' element={<Navigate to='/' replace/>}/>
      </Routes>
    </div>
  )
}

export default App;
