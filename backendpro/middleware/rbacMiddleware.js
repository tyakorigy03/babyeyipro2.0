const { Permission, Role } = require('../models');

// Check if user has specific permission
const authorize = (...requiredPermissions) => {
  return async (req, res, next) => {
    if (!req.user || !req.user.role_id) {
      return res.status(403).json({ message: 'Forbidden: No role assigned' });
    }

    try {
      // Get the user's role with associated permissions
      const role = await Role.findByPk(req.user.role_id, {
        include: [{
          model: Permission,
          as: 'permissions',
          attributes: ['name']
        }]
      });

      if (!role) {
        return res.status(403).json({ message: 'Forbidden: Role not found' });
      }

      // If user is a System Admin (you might want a specific flag for this), bypass
      if (role.is_system && role.name === 'SuperAdmin') {
        return next();
      }

      // Extract permission names into an array
      const userPermissions = role.permissions.map(p => p.name);

      // Check if user has ALL required permissions
      const hasAllPermissions = requiredPermissions.every(permission => 
        userPermissions.includes(permission)
      );

      if (!hasAllPermissions) {
        return res.status(403).json({ 
          message: 'Forbidden: Insufficient permissions',
          required: requiredPermissions
        });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error checking permissions' });
    }
  };
};

module.exports = { authorize };
