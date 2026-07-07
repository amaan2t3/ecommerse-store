import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBagIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" 
          alt="About Lumina" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Our Story
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            Redefining e-commerce with premium quality, sustainable practices, and unparalleled customer service.
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-3xl font-bold text-text mb-6">Who We Are</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Founded in 2026, Lumina started with a simple vision: to make high-quality, sustainable fashion and accessories accessible to everyone. We believe that what you wear is an extension of your personality, which is why we meticulously curate every item in our store. From our humble beginnings in a small design studio to serving thousands of happy customers globally, our commitment to excellence has never wavered.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-6"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              <ShoppingBagIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-text mb-4">Premium Quality</h3>
            <p className="text-gray-600">Every product is handpicked and quality-tested to ensure it meets our rigorous standards of excellence.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center p-6"
          >
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-secondary">
              <TruckIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-text mb-4">Fast Delivery</h3>
            <p className="text-gray-600">We partner with the best logistics networks to get your favorite items delivered to your doorstep swiftly.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center p-6"
          >
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
              <ShieldCheckIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-text mb-4">Secure Shopping</h3>
            <p className="text-gray-600">Your security is our priority. We use military-grade encryption to protect your data and transactions.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
