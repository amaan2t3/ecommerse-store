const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    default: 0.0
  },
  images: [{
    url: String,
    public_id: String
  }],
  brand: {
    type: String,
    required: [true, 'Please add a brand']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0
  },
  variants: [{
    color: String,
    size: String,
    stock: Number
  }],
  reviews: [reviewSchema],
  rating: {
    type: Number,
    required: true,
    default: 0
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
