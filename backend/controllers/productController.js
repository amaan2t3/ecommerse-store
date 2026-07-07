const supabase = require('../config/supabase');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*');
      
    if (error) throw error;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();
      
    if (error) throw error;
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, brand, category, countInStock } = req.body;
    
    const token = req.headers.authorization?.split(' ')[1];
    const { createClient } = require('@supabase/supabase-js');
    const supabaseAuth = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data: createdProduct, error } = await supabaseAuth
      .from('products')
      .insert([
        {
          name: name || 'Sample name',
          price: price || 0,
          user_id: req.user.id,
          image: image || '/images/sample.jpg',
          brand: brand || 'Sample brand',
          category: category || 'Sample category',
          count_in_stock: countInStock || 0,
          description: description || 'Sample description',
        }
      ])
      .select();

    if (error) throw error;
    res.status(201).json(createdProduct[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      image,
      brand,
      category,
      countInStock,
    } = req.body;

    const token = req.headers.authorization?.split(' ')[1];
    const { createClient } = require('@supabase/supabase-js');
    const supabaseAuth = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data: updatedProduct, error } = await supabaseAuth
      .from('products')
      .update({
        name,
        price,
        description,
        image,
        brand,
        category,
        count_in_stock: countInStock,
      })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    
    if (updatedProduct.length > 0) {
      res.json(updatedProduct[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { createClient } = require('@supabase/supabase-js');
    const supabaseAuth = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data, error } = await supabaseAuth
      .from('products')
      .delete()
      .eq('id', req.params.id)
      .select();

    if (error) throw error;

    if (data.length > 0) {
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
