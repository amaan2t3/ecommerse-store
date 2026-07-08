const supabase = require('../config/supabase');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    const token = req.headers.authorization?.split(' ')[1];
    const { createClient } = require('@supabase/supabase-js');
    const supabaseAuth = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data: order, error } = await supabaseAuth
      .from('orders')
      .insert([
        {
          user_id: req.user.id,
          user_details: {
            name: req.user.user_metadata?.name || 'Customer',
            email: req.user.email
          },
          order_items: orderItems,
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
          items_price: itemsPrice,
          tax_price: taxPrice,
          shipping_price: shippingPrice,
          total_price: totalPrice,
          is_paid: true,
          paid_at: new Date().toISOString(),
          is_delivered: false
        }
      ])
      .select();

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
        return res.status(500).json({ message: 'Database table "orders" does not exist in Supabase. Please create it.' });
      }
      throw error;
    }
    
    res.status(201).json(order[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { createClient } = require('@supabase/supabase-js');
    const supabaseAuth = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data: orders, error } = await supabaseAuth
      .from('orders')
      .select('*')
      .eq('user_id', req.user.id);

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) return res.json([]);
      throw error;
    }
    
    res.json(orders || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { createClient } = require('@supabase/supabase-js');
    const supabaseAuth = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data: orders, error } = await supabaseAuth
      .from('orders')
      .select('*');

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) return res.json([]);
      throw error;
    }
    
    res.json(orders || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrders
};
