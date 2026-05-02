const jwt = require('jsonwebtoken');
const { User, School, Role } = require('../models');

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

      // Get user from the token (exclude password)
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
        include: [
          { model: School, as: 'school' },
          { model: Role, as: 'role' }
        ]
      });

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      if (req.user.status !== 'active') {
        return res.status(401).json({ message: 'Not authorized, account is inactive or suspended' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
