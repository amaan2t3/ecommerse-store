import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/2 w-[500px] h-[500px] bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="text-accent font-semibold tracking-wider uppercase text-sm mb-4 block">Spring Collection 2026</span>
          <h1 className="text-5xl md:text-7xl font-bold text-text mb-6 leading-tight">
            Discover True <br />
            <span className="text-primary italic font-serif">Elegance.</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-lg leading-relaxed">
            Curated pieces designed to elevate your everyday lifestyle. Experience the perfect blend of modern aesthetic and timeless quality.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/shop" className="btn-primary flex items-center gap-2 group">
              Shop Now
              <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/collections" className="px-6 py-3 bg-white text-text font-medium rounded-xl hover:bg-gray-50 transition-all duration-300 ease-in-out shadow-sm border border-gray-100">
              View Collections
            </Link>
          </div>
          
          <div className="mt-12 flex items-center gap-8">
            <div>
              <p className="text-3xl font-bold text-text">10k+</p>
              <p className="text-sm text-gray-500">Happy Customers</p>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div>
              <p className="text-3xl font-bold text-text">High</p>
              <p className="text-sm text-gray-500">Quality Materials</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative hidden md:block h-[600px] w-full"
        >
          <div className="absolute inset-0 bg-secondary/10 rounded-3xl transform rotate-3 scale-105"></div>
          <img 
            src="https://images.unsplash.com/photo-1434389678278-be43e4aa318b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Fashion Model" 
            className="w-full h-full object-cover rounded-3xl shadow-xl transform -rotate-3 transition-transform duration-500 hover:rotate-0"
          />
          
          {/* Floating badge */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg flex items-center gap-4"
          >
            <div className="bg-success/10 p-3 rounded-full">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div>
              <p className="font-semibold text-text">100% Authentic</p>
              <p className="text-xs text-gray-500">Guaranteed Quality</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
