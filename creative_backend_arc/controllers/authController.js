const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, School, Role } = require('../models');

// Generate JWT
const generateToken = (id, school_id, role_id) => {
  return jwt.sign(
    { id, school_id, role_id },
    process.env.JWT_SECRET || 'fallback_secret_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { identifier, email, phone, password } = req.body;
    const loginValue = identifier || email || phone;

    // Validate input
    if (!loginValue || !password) {
      return res.status(400).json({ message: 'Please provide an identifier (email/phone) and password' });
    }

    // Check for user by email OR phone
    const user = await User.findOne({ 
      where: {
        [Op.or]: [
          { email: loginValue },
          { phone: loginValue }
        ]
      },
      include: [
        { model: School, as: 'school' },
        { model: Role, as: 'role' }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status !== 'active') {
      return res.status(401).json({ message: 'Account is inactive or suspended' });
    }

    // Check if password matches
    // In production, users table should have hashed passwords. 
    // Assuming bcrypt is used when creating users.
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id, user.school_id, user.role_id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        school: user.school ? user.school.name : null,
        role: user.role ? user.role.name : null,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user is set in the authMiddleware
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
};

// @desc    Register a new user (Usually restricted to Admin, but keeping open for initial setup)
// @route   POST /api/auth/register
// @access  Public (or Private depending on use case)
const register = async (req, res) => {
  try {
    const { name, email, phone, password, school_id, role_id } = req.body;

    if (!name || (!email && !phone) || !password) {
      return res.status(400).json({ message: 'Please add name, password, and either email or phone' });
    }

    // Check if user exists by email or phone
    const userExists = await User.findOne({ 
      where: {
        [Op.or]: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : [])
        ]
      } 
    });

    if (userExists) {
      return res.status(400).json({ message: 'User with this email or phone already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email: email || null,
      phone: phone || null,
      password: hashedPassword,
      school_id: school_id || null, 
      role_id: role_id || null,
      status: 'active'
    });

    if (user) {
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token: generateToken(user.id, user.school_id, user.role_id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

module.exports = {
  login,
  getMe,
  register
};
