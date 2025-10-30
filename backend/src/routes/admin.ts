import express from 'express';
import { User } from '../models';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/users - Get all users
router.get('/users', async (req: any, res) => {
  try {
    console.log('🔍 Admin fetching all users');

    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address', 'role', 'isActive', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    console.log('✅ Found users:', users.length);

    return res.json({
      users,
      total: users.length
    });

  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/admin/users/:id/role - Update user role
router.put('/users/:id/role', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    console.log('🔄 Admin updating user role:', id, 'to', role);

    // Validate role
    if (!['resident', 'janitorial', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be resident, janitorial, or admin.' });
    }

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from changing their own role
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    // Update role
    await user.update({ role });

    console.log('✅ User role updated successfully');

    return res.json({
      message: 'User role updated successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Error updating user role:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/admin/users/:id/status - Update user status (active/inactive)
router.put('/users/:id/status', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    console.log('🔄 Admin updating user status:', id, 'to', isActive);

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deactivating themselves
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }

    // Update status
    await user.update({ isActive });

    console.log('✅ User status updated successfully');

    return res.json({
      message: 'User status updated successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error('❌ Error updating user status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/admin/users/:id/password - Reset user password
router.put('/users/:id/password', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    console.log('🔄 Admin resetting password for user:', id);

    // Validate password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await user.update({ password: hashedPassword });

    console.log('✅ User password reset successfully');

    return res.json({
      message: 'User password reset successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ Error resetting user password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/admin/users/:id - Delete user (soft delete by setting inactive)
router.delete('/users/:id', async (req: any, res) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Admin deleting user:', id);

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Soft delete by setting inactive
    await user.update({ isActive: false });

    console.log('✅ User deleted successfully');

    return res.json({
      message: 'User deleted successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
