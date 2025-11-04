import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, CommunityUser, Community, Prospect } from '../models';
import { authenticateToken } from '../middleware/auth';
import { buildPasswordResetEmail, buildVerificationEmail, sendEmail } from '../services/emailService';

const router = express.Router();

// POST /api/auth/register-interest - Register interest without creating account
router.post('/register-interest', async (req, res) => {
  try {
    const { 
      communityInfo,
      personalInfo
    } = req.body;

    console.log('📝 Interest registration:', { 
      communityName: communityInfo?.communityName,
      email: personalInfo?.email
    });

    // Validate required fields
    if (!communityInfo || !personalInfo) {
      return res.status(400).json({ 
        message: 'Community info and personal info are required' 
      });
    }

    if (!communityInfo.communityName || !communityInfo.communityStreet || !communityInfo.communityZipCode || 
        !communityInfo.primaryContactName || !communityInfo.primaryContactTitle) {
      return res.status(400).json({ 
        message: 'Community name, street, zip code, primary contact name, and title are required' 
      });
    }

    if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.email) {
      return res.status(400).json({ 
        message: 'First name, last name, and email are required' 
      });
    }

    // Store prospect information in prospects table
    const prospect = await Prospect.create({
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      email: personalInfo.email,
      phone: personalInfo.phone || null,
      street: personalInfo.street || null,
      zipCode: personalInfo.zipCode || null,
      city: personalInfo.city || null,
      state: personalInfo.state || null,
      communityName: communityInfo.communityName,
      communityStreet: communityInfo.communityStreet,
      communityZipCode: communityInfo.communityZipCode,
      communityCity: communityInfo.communityCity || null,
      communityState: communityInfo.communityState || null,
      approximateHouseholds: communityInfo.approximateHouseholds || null,
      primaryContactName: communityInfo.primaryContactName,
      primaryContactTitle: communityInfo.primaryContactTitle,
      primaryContactInfo: communityInfo.primaryContactInfo || null
    });

    // Create a pending community entry (inactive, for admin review)
    const fullAddress = `${communityInfo.communityStreet}, ${communityInfo.communityCity || ''}, ${communityInfo.communityState || ''} ${communityInfo.communityZipCode}`.trim();
    const pendingCommunity = await Community.create({
      name: communityInfo.communityName,
      address: fullAddress,
      description: `Interest registration - Pending review. Approximate households: ${communityInfo.approximateHouseholds || 'N/A'}. Primary contact: ${communityInfo.primaryContactName} (${communityInfo.primaryContactTitle}). Contact person: ${personalInfo.firstName} ${personalInfo.lastName} (${personalInfo.email})`,
      zipCode: communityInfo.communityZipCode,
      accessCode: undefined,
      isActive: false // Pending review
    });

    console.log(`✅ Interest registration received for community: ${pendingCommunity.name} (ID: ${pendingCommunity.id})`);

    // TODO: Send email notification to admin about new interest registration
    // TODO: Optionally send confirmation email to the interested party

    return res.status(201).json({
      message: 'Thank you for your interest! Someone will reach out to you shortly.',
      communityId: pendingCommunity.id
    });

  } catch (error: any) {
    console.error('Interest registration error:', error);
    
    // Check for Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: error.errors.map((e: any) => e.message).join(', ') 
      });
    }
    
    return res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

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
      // Generate access code
      const accessCode = crypto.randomBytes(4).toString('hex').toUpperCase();
      
      // Build full address
      const fullAddress = `${communityInfo.communityStreet || ''}, ${communityInfo.communityCity || ''}, ${communityInfo.communityState || ''} ${communityInfo.communityZipCode || ''}`.trim();
      
      // Create new community (activated if authorization and payment are set)
      const newCommunity = await Community.create({
        name: communityInfo.communityName,
        address: fullAddress,
        description: `New community registration. Approximate households: ${communityInfo.approximateHouseholds || 'N/A'}. Primary contact: ${communityInfo.primaryContactName || ''} (${communityInfo.primaryContactTitle || ''})`,
        zipCode: communityInfo.communityZipCode || undefined,
        accessCode: accessCode,
        isActive: !!(communityInfo.authorizationCertified && communityInfo.paymentSetup), // Activate if both are true
        authorizationCertified: communityInfo.authorizationCertified || false,
        paymentSetup: communityInfo.paymentSetup || false,
        onboardingCompleted: false // Will be completed after member list is uploaded
      });

      // Add user as admin of the new community
      await CommunityUser.create({
        userId: user.id,
        communityId: newCommunity.id,
        role: 'admin',
        isActive: true,
        joinedAt: new Date()
      });

      console.log(`✅ New community created: ${newCommunity.name} (ID: ${newCommunity.id}) - Active: ${newCommunity.isActive}`);
      
      // Store prospect information (extract personal info from request if available)
      const personalStreet = req.body.street || req.body.address || null;
      const personalZipCode = req.body.zipCode || null;
      const personalCity = req.body.city || null;
      const personalState = req.body.state || null;
      
      await Prospect.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phoneValue,
        street: personalStreet,
        zipCode: personalZipCode,
        city: personalCity,
        state: personalState,
        communityName: communityInfo.communityName,
        communityStreet: communityInfo.communityStreet || '',
        communityZipCode: communityInfo.communityZipCode || '',
        communityCity: communityInfo.communityCity || null,
        communityState: communityInfo.communityState || null,
        approximateHouseholds: communityInfo.approximateHouseholds || null,
        primaryContactName: communityInfo.primaryContactName || '',
        primaryContactTitle: communityInfo.primaryContactTitle || '',
        primaryContactInfo: communityInfo.primaryContactInfo || null
      });
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

    // If new community was created, auto-login the user
    if (communitySelection === 'new-community' && communityInfo) {
      // Get the newly created community with user's membership
      const communityUser = await CommunityUser.findOne({
        where: { userId: user.id, role: 'admin' },
        include: [{
          model: Community,
          as: 'community',
          where: { name: communityInfo.communityName }
        }]
      });

      if (communityUser && (communityUser as any).community) {
        const newCommunity = (communityUser as any).community;
        
        // Get all user's communities for token
        const allCommunityUsers = await CommunityUser.findAll({
          where: { userId: user.id, isActive: true },
          include: [{
            model: Community,
            as: 'community',
            attributes: ['id', 'name', 'address', 'description', 'isActive', 'accessCode', 'onboardingCompleted', 'authorizationCertified', 'paymentSetup', 'memberListUploaded']
          }]
        });

        const communities = (allCommunityUsers as any[])
          .filter((cu: any) => cu.community && cu.community.isActive)
          .map((cu: any) => ({
            id: cu.community.id,
            name: cu.community.name,
            role: cu.role,
            onboardingCompleted: cu.community.onboardingCompleted
          }));

        // Generate JWT token for auto-login
        const token = jwt.sign(
          {
            userId: user.id,
            email: user.email,
            currentCommunityId: newCommunity.id,
            communityRole: 'admin',
            communityRoles: communities.reduce((acc: any, comm: any) => {
              acc[comm.id] = comm.role;
              return acc;
            }, {})
          },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );

        return res.status(201).json({
          message: 'Registration successful. Community created and activated.',
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          },
          community: {
            id: newCommunity.id,
            name: newCommunity.name
          }
        });
      }
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

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is inactive. Please contact support.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Get user's communities and roles
    const communityUsers = await CommunityUser.findAll({
      where: { userId: user.id, isActive: true },
      include: [{
        model: Community,
        as: 'community',
        attributes: ['id', 'name', 'address', 'description']
      }]
    });

    const communities = communityUsers.map((cu: any) => ({
      id: cu.community.id,
      name: cu.community.name,
      address: cu.community.address,
      description: cu.community.description,
      role: cu.role
    }));

    // Determine default community (first active community, or null if none)
    const defaultCommunity = communities.length > 0 ? communities[0] : null;
    const defaultCommunityId = defaultCommunity?.id || null;
    const defaultCommunityRole = defaultCommunity?.role || null;

    // Create JWT token with user info and community info
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        currentCommunityId: defaultCommunityId,
        communityRole: defaultCommunityRole,
        communityRoles: communities.reduce((acc: any, comm: any) => {
          acc[comm.id] = comm.role;
          return acc;
        }, {})
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        emailVerified: user.emailVerified
      },
      communities,
      currentCommunity: defaultCommunity
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/auth/verify-email/:token - Verify email address
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: {
        emailVerificationToken: token,
        emailVerificationTokenExpires: {
          [require('sequelize').Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    await user.update({
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpires: null
    });

    return res.json({ message: 'Email verified successfully' });

  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/resend-verification - Resend verification email
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await user.update({
      emailVerificationToken,
      emailVerificationTokenExpires
    });

    // Send verification email
    try {
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const verifyUrl = `${baseUrl}/verify-email/${emailVerificationToken}`;
      const { subject, html } = buildVerificationEmail(user.firstName, verifyUrl);
      await sendEmail({ to: user.email, subject, html });
    } catch (e) {
      console.warn('Failed to send verification email:', e);
      return res.status(500).json({ message: 'Failed to send verification email' });
    }

    return res.json({ message: 'Verification email sent' });

  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: 'If an account exists with this email, a password reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.update({
      passwordResetToken: resetToken,
      passwordResetTokenExpires: resetTokenExpires
    });

    // Send reset email
    try {
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const resetUrl = `${baseUrl}/reset-password/${resetToken}`;
      const { subject, html } = buildPasswordResetEmail(user.firstName, resetUrl);
      await sendEmail({ to: user.email, subject, html });
    } catch (e) {
      console.warn('Failed to send password reset email:', e);
      return res.status(500).json({ message: 'Failed to send password reset email' });
    }

    return res.json({ message: 'If an account exists with this email, a password reset link has been sent.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const user = await User.findOne({
      where: {
        passwordResetToken: token,
        passwordResetTokenExpires: {
          [require('sequelize').Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await user.update({
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpires: null
    });

    return res.json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/auth/profile - Get user profile (protected route)
router.get('/profile', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetTokenExpires'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/auth/profile - Update user profile (protected route)
router.put('/profile', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, address } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (firstName !== undefined) user.firstName = firstName.trim();
    if (lastName !== undefined) user.lastName = lastName.trim();
    if (phone !== undefined) user.phone = phone && phone.trim() ? phone.trim() : null;
    if (address !== undefined) user.address = address && address.trim() ? address.trim() : null;

    await user.save();

    return res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address
      }
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