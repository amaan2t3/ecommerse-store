import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { Toaster } from 'react-hot-toast';

const Home = lazy(() => import('./pages/Home/Home'));
const Shop = lazy(() => import('./pages/Shop/Shop'));
const ProductDetails = lazy(() => import('./pages/Product/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Checkout = lazy(() => import('./pages/Checkout/Checkout'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const UserDashboard = lazy(() => import('./pages/User/Dashboard'));
const Categories = lazy(() => import('./pages/Categories/Categories'));
const About = lazy(() => import('./pages/About/About'));

function App() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow pt-20">
          <Suspense fallback={<div className="h-[80vh] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/about" element={<About />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route 
                path="/admin" 
                element={userInfo?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
              />
              <Route path="/profile" element={<UserDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
