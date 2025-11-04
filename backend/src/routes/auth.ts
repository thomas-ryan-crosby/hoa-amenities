import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, CommunityUser, Community } from '../models';
import { authenticateToken } from '../middleware/auth';
import { buildPasswordResetEmail, buildVerificationEmail, sendEmail } from '../services/emailService';

const router = express.Router();

// POST /api/auth/register - User registration
router.post('/register', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      address, 
      role = 'resident',
      communitySelection,
      interestedRole,
      communityIds = [],
      communityInfo
    } = req.body;

    console.log('📝 Registration attempt:', { 
      email, 
      firstName, 
      lastName, 
      hasPhone: !!phone, 
      hasAddress: !!address,
      communitySelection,
      communityIds: communityIds.length
    });

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        message: 'Email, password, first name, and last name are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // Convert empty strings to null for optional fields
    const phoneValue = phone && phone.trim() ? phone.trim() : null;
    const addressValue = address && address.trim() ? address.trim() : null;

    const user = await User.create({
      email: email.trim(),
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phoneValue,
      address: addressValue,
      role: role as 'resident' | 'janitorial' | 'admin',
      isActive: true,
      emailVerified: false,
      emailVerificationToken,
      emailVerificationTokenExpires
    });

    // Handle new community registration
    if (communitySelection === 'new-community' && communityInfo) {
      // Create new community (pending approval)
      const newCommunity = await Community.create({
        name: communityInfo.communityName,
        address: communityInfo.communityAddress,
        description: `New community registration pending approval. Approximate households: ${communityInfo.approximateHouseholds || 'N/A'}. Primary contact: ${communityInfo.primaryContact}`,
        zipCode: null, // Will be set during approval process
        accessCode: null, // Will be generated during approval process
        isActive: false // Pending approval - admin will activate
      });

      // Add user as admin of the new community
      await CommunityUser.create({
        userId: user.id,
        communityId: newCommunity.id,
        role: 'admin',
        isActive: true,
        joinedAt: new Date()
      });

      console.log(`✅ New community created: ${newCommunity.name} (ID: ${newCommunity.id}) - Pending approval`);
    }

    // If user selected "existing" communities, add them to those communities
    if (communitySelection === 'existing' && Array.isArray(communityIds) && communityIds.length > 0) {
      // Validate that all communities exist and are active
      const communities = await Community.findAll({
        where: {
          id: communityIds,
          isActive: true
        }
      });

      if (communities.length !== communityIds.length) {
        console.warn(`⚠️ Some communities not found or inactive. Requested: ${communityIds.length}, Found: ${communities.length}`);
      }

      // Add user to each community as a resident (default role)
      for (const community of communities) {
        await CommunityUser.findOrCreate({
          where: {
            userId: user.id,
            communityId: community.id
          },
          defaults: {
            userId: user.id,
            communityId: community.id,
            role: 'resident',
            isActive: true
          }
        });
      }

      console.log(`✅ User added to ${communities.length} community(ies)`);
    }

    // Send verification email (non-blocking)
    try {
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const verifyUrl = `${baseUrl}/verify-email/${emailVerificationToken}`;
      const { subject, html } = buildVerificationEmail(user.firstName, verifyUrl);
      await sendEmail({ to: user.email, subject, html });
    } catch (e) {
      console.warn('Failed to send verification email:', e);
    }

    return res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Check for Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: error.errors.map((e: any) => e.message).join(', ') 
      });
    }
    
    // Check for Sequelize unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'An account with this email already exists or there was a database conflict' 
      });
    }
    
    // Check for other database errors
    if (error.name === 'SequelizeDatabaseError') {
      return res.status(400).json({ 
        message: `Database error: ${error.message || 'Please check your database configuration'}` 
      });
    }
    
    return res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});
// POST /api/auth/verify-email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }
    const user = await User.findOne({ where: { emailVerificationToken: token } });
    if (!user) return res.status(400).json({ message: 'Invalid verification token' });
    if (user.emailVerificationTokenExpires && user.emailVerificationTokenExpires < new Date()) {
      return res.status(400).json({ message: 'Verification token has expired' });
    }
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpires = null;
    await user.save();
    return res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('verify-email error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/resend-verification
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.json({ message: 'If an account exists, a verification email has been sent.' });
    if (user.emailVerified) return res.json({ message: 'Email already verified' });
    const token = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = token;
    user.emailVerificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verifyUrl = `${baseUrl}/verify-email/${token}`;
    const { subject, html } = buildVerificationEmail(user.firstName, verifyUrl);
    await sendEmail({ to: user.email, subject, html });
    return res.json({ message: 'Verification email sent' });
  } catch (err) {
    console.error('resend-verification error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const user = await User.findOne({ where: { email } });
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      user.passwordResetToken = token;
      user.passwordResetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h
      user.passwordResetRequestedAt = new Date();
      await user.save();
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const resetUrl = `${baseUrl}/reset-password/${token}`;
      const { subject, html } = buildPasswordResetEmail(user.firstName, resetUrl);
      try {
        await sendEmail({ to: user.email, subject, html });
      } catch (e) {
        console.warn('Failed to send password reset email:', e);
        // Do not fail the request; we always return a generic success message below
      }
    }
    return res.json({ message: 'If an account exists for that email, a reset link has been sent.' });
  } catch (err) {
    console.error('forgot-password error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Token and new password are required' });
    const user = await User.findOne({ where: { passwordResetToken: token } });
    if (!user) return res.status(400).json({ message: 'Invalid reset token' });
    if (user.passwordResetTokenExpires && user.passwordResetTokenExpires < new Date()) {
      return res.status(400).json({ message: 'Reset token has expired' });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    await user.save();
    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('reset-password error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/auth/check-verification-status
router.get('/check-verification-status', authenticateToken, async (req: any, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ emailVerified: !!user.emailVerified });
  } catch (err) {
    console.error('check-verification-status error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ where: { email, isActive: true } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Get all communities user belongs to
    const communityMemberships = await CommunityUser.findAll({
      where: { userId: user.id, isActive: true },
      include: [
        {
          model: Community,
          as: 'community',
          attributes: ['id', 'name', 'description', 'isActive']
        }
      ],
      attributes: ['role', 'communityId']
    });

    // Get communities with roles
    const communities = (communityMemberships as any[])
      .filter((cu: any) => cu.community && cu.community.isActive)
      .map((cu: any) => ({
        id: cu.communityId,
        name: cu.community.name,
        description: cu.community.description,
        role: cu.role as 'resident' | 'janitorial' | 'admin'
      }));

    if (communities.length === 0) {
      return res.status(403).json({ 
        message: 'User is not associated with any active communities. Please contact an administrator.' 
      });
    }

    // Default to first community (or could be stored in user preferences later)
    const currentCommunityId = communities[0].id;
    const currentCommunityRole = communities[0].role;

    // Generate JWT token with community info
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        currentCommunityId,
        communityRole: currentCommunityRole,
        allCommunities: communities.map(c => ({ id: c.id, name: c.name, role: c.role }))
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    return res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      communities,
      currentCommunity: {
        id: currentCommunityId,
        name: communities[0].name,
        role: currentCommunityRole
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/auth/profile - Get user profile (protected route)
router.get('/profile', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'address', 'role', 'isActive', 'createdAt', 'updatedAt']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user });

  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/auth/profile - Update user profile (protected route)
router.put('/profile', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, address } = req.body;

    // Validate required fields
    if (!firstName || !lastName) {
      return res.status(400).json({ 
        message: 'First name and last name are required' 
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user profile
    await user.update({
      firstName,
      lastName,
      phone: phone || null,
      address: address || null
    });

    // Return updated user data (without password)
    const updatedUser = await User.findByPk(userId, {
      attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'address', 'role', 'isActive', 'createdAt', 'updatedAt']
    });

    return res.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/auth/change-password - Change user password (protected route)
router.put('/change-password', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Current password and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'New password must be at least 6 characters long' 
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await user.update({ password: hashedNewPassword });

    return res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Password change error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
