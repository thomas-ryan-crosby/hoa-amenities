import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, CommunityUser, Community } from '../models';
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

    if (!communityInfo.communityName || !communityInfo.communityAddress || !communityInfo.primaryContact) {
      return res.status(400).json({ 
        message: 'Community name, address, and primary contact are required' 
      });
    }

    if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.email) {
      return res.status(400).json({ 
        message: 'First name, last name, and email are required' 
      });
    }

    // Create a pending community entry (inactive, for admin review)
    const pendingCommunity = await Community.create({
      name: communityInfo.communityName,
      address: communityInfo.communityAddress,
      description: `Interest registration - Pending review. Approximate households: ${communityInfo.approximateHouseholds || 'N/A'}. Primary contact: ${communityInfo.primaryContact}. Contact person: ${personalInfo.firstName} ${personalInfo.lastName} (${personalInfo.email})`,
      zipCode: undefined,
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
      // Create new community (pending approval)
      const newCommunity = await Community.create({
        name: communityInfo.communityName,
        address: communityInfo.communityAddress,
        description: `New community registration pending approval. Approximate households: ${communityInfo.approximateHouseholds || 'N/A'}. Primary contact: ${communityInfo.primaryContact}`,
        zipCode: undefined, // Will be set during approval process
        accessCode: undefined, // Will be generated during approval process
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

// Rest of the auth routes...