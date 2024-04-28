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
import AdminPage from './pages/admin/AdminPage';
import Orders from './pages/Orders';
import SingleUserPage from './pages/user/SingleUserPage';
import parseJwt from './helpers/decode';
import ResetPassword from './pages/user/ResetPassword';

function App() {
  const userData = parseJwt(localStorage.getItem('token'));

  const isAdmin = userData?.role === 'ADMIN';

  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path='/' element={<LandingPage/>}></Route>
        <Route
          path='/auth/profile'
          element={userData ? <ProfilePage/> : <Navigate to="/" replace />}
        />
        <Route path="/auth/login" element={<LoginPage/>}/>
        <Route path="/registration" element={<RegisterPage/>}/>
        <Route path="/products" element={<ProductsPage/>}/>
        <Route path="/products/:id" element={<ItemPage/>}/>
        <Route
          path="/createNew"
          element={isAdmin ? <CreateProductPage /> : <Navigate to="/" replace />}
        />
        <Route
          path='cart'
          element={userData ? <CartPage/> : <Navigate to="/" replace />}
        />
        <Route
          path='orders'
          element={userData ? <Orders/> : <Navigate to="/" replace />}
        />
        <Route 
          path='auth/admin'
          element={isAdmin ? <AdminPage/> : <Navigate to="/" replace />}
        />
        <Route 
          path='user/:id'
          element={isAdmin ? <SingleUserPage/> : <Navigate to="/" replace />}
        />
        <Route 
          path='reset-password'
          element={<ResetPassword/>}  
        />
        <Route path='*' element={<Navigate to='/' replace/>}/>
      </Routes>
    </div>
  )
}

export default App;
