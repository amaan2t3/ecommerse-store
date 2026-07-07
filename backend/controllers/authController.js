const supabase = require('../config/supabase');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (role === 'admin') {
      return res.status(403).json({ message: 'Security Alert: Admin registration is strictly prohibited. Only one master admin is allowed.' });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: role || 'customer'
        }
      }
    });

    if (error) throw error;

    res.status(201).json({
      _id: data.user.id,
      name: data.user.user_metadata.name,
      email: data.user.email,
      role: data.user.user_metadata.role,
      token: data.session?.access_token || 'Please verify your email'
    });
  } catch (error) {
    console.error('SUPABASE SIGNUP ERROR:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    res.json({
      _id: data.user.id,
      name: data.user.user_metadata.name,
      email: data.user.email,
      role: data.user.user_metadata.role,
      token: data.session.access_token
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // req.user is populated by our updated middleware
    res.json({
      _id: req.user.id,
      email: req.user.email,
      name: req.user.user_metadata.name,
      role: req.user.user_metadata.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
