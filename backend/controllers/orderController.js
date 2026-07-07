const fs = require('fs');
const path = require('path');
const ordersFilePath = path.join(__dirname, '../data/orders.json');

const getOrdersData = () => {
  try {
    return JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
  } catch (error) {
    return [];
  }
};

const saveOrdersData = (data) => {
  fs.writeFileSync(ordersFilePath, JSON.stringify(data, null, 2));
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    const order = {
      id: Date.now().toString(),
      user: {
        id: req.user.id,
        name: req.user.user_metadata?.name || 'Customer',
        email: req.user.email
      },
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: true,
      paidAt: new Date(),
      isDelivered: false,
      createdAt: new Date()
    };

    const orders = getOrdersData();
    orders.push(order);
    saveOrdersData(orders);
    
    res.status(201).json(order);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = (req, res) => {
  const orders = getOrdersData();
  const userOrders = orders.filter(o => o.user.id === req.user.id);
  res.json(userOrders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = (req, res) => {
  const orders = getOrdersData();
  res.json(orders);
};

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrders
};
