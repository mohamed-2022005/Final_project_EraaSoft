import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import ContactPage from './pages/ContactPage/ContactPage';
import AboutPage from './pages/AboutPage/AboutPage';
import MenuPage from './pages/Menu/MenuPage';
import CartPage from './pages/Cart/CartPage';
import SignUpPage from './components/SignUp/SignUpPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import CheckOutPage from './pages/CheckOutPage/CheckOutPage';
import MyOrderPage from './pages/MyOrderPage/MyOrderPage';

function App() {
  // بنشيك لو المستخدم مسجل عشان لو حاول يروح للوجن وهو مسجل نرجعه للهوم
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');

  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/menu' element={<MenuPage />} />

        {/* لو هو مسجل فعلا وحاول يفتح اللوجن، ابعته للهوم */}
        <Route path='/login' element={token ? <Navigate to="/" /> : <HomePage />} />
        <Route path='/signup' element={<SignUpPage />} />


        {/* المسارات المحمية */}
        <Route path='/cart' element={
          <PrivateRoute>
            <CartPage />
          </PrivateRoute>
        } />
        
        {/* تم إزالة الحماية من هنا كما طلبت */}
        <Route path='/checkout' element={<CheckOutPage />} />

        <Route path='/myorder' element={<MyOrderPage />} />

        {/* مسار احتياطي لو كتب لينك غلط */}
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;