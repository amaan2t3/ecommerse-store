import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBagIcon, UserIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import logo from '../../assets/b2b-logo.png';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Store Logo" className="h-16 w-auto object-contain max-w-[200px]" />
        </Link>
        
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-text hover:text-primary transition-colors font-medium">Home</Link>
          <Link to="/shop" className="text-text hover:text-primary transition-colors font-medium">Shop</Link>
          <Link to="/categories" className="text-text hover:text-primary transition-colors font-medium">Categories</Link>
          <Link to="/about" className="text-text hover:text-primary transition-colors font-medium">About</Link>
        </div>

        <div className="flex items-center space-x-5">
          <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-100/50 border border-transparent text-sm rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-48 focus:bg-white"
            />
            <button type="submit" className="absolute left-3">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-500 hover:text-primary transition-colors" />
            </button>
          </form>
          {userInfo ? (
            <div className="flex items-center gap-4">
              {userInfo.role === 'admin' && (
                <Link to="/admin" className="text-sm font-medium text-text hover:text-primary transition-colors hidden md:block">
                  Admin Panel
                </Link>
              )}
              <Link to="/profile" className="text-text hover:text-primary transition-colors flex items-center gap-1">
                <UserIcon className="h-6 w-6" />
                <span className="hidden sm:block text-sm font-medium">{userInfo.name?.split(' ')[0]}</span>
              </Link>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Login
            </Link>
          )}
          <Link to="/cart" className="text-text hover:text-primary transition-colors relative">
            <ShoppingBagIcon className="h-6 w-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            )}
          </Link>
          <button className="md:hidden text-text" onClick={() => setMobileMenuOpen(true)}>
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-50 flex flex-col p-6 md:hidden"
          >
            <div className="flex justify-between items-center mb-10">
              <img src={logo} alt="Store Logo" className="h-12 w-auto object-contain max-w-[150px]" />
              <button onClick={() => setMobileMenuOpen(false)}>
                <XMarkIcon className="h-8 w-8 text-text" />
              </button>
            </div>
            <div className="flex flex-col space-y-6 text-xl">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-text font-medium">Home</Link>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="text-text font-medium">Shop</Link>
              <Link to="/categories" onClick={() => setMobileMenuOpen(false)} className="text-text font-medium">Categories</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-text font-medium">About</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
