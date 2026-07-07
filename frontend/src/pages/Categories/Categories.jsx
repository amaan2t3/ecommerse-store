import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Men', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80', items: '24' },
  { name: 'Women', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500&q=80', items: '38' },
  { name: 'Kids', image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=500&q=80', items: '15' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=500&q=80', items: '42' },
  { name: 'Shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80', items: '18' },
];

const Categories = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">Shop by Category</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Explore our wide range of premium collections handpicked just for you.</p>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full mt-6"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category, idx) => (
          <Link to="/shop" key={idx}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-soft transition-all"
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors z-10"></div>
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute bottom-0 left-0 p-8 z-20">
                <h3 className="text-3xl font-bold text-white mb-2">{category.name}</h3>
                <p className="text-white/80 font-medium">{category.items} Items</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
