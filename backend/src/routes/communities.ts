import express from 'express';
import multer from 'multer';
import { Community, CommunityUser, User } from '../models';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { sendEmail } from '../services/emailService';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// GET /api/communities - Get all communities user belongs to
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;

    const communityMemberships = await CommunityUser.findAll({
      where: { userId, isActive: true },
      include: [
        {
          model: Community,
          as: 'community',
          attributes: ['id', 'name', 'description', 'address', 'contactEmail', 'isActive', 'accessCode', 'onboardingCompleted', 'authorizationCertified', 'paymentSetup', 'memberListUploaded']
        }
      ],
      attributes: ['role', 'communityId', 'joinedAt']
    });

      const communities = (communityMemberships as any[])
      .filter((cu: any) => cu.community && cu.community.isActive)
      .map((cu: any) => ({
        id: cu.communityId,
        name: cu.community.name,
        description: cu.community.description,
        address: cu.community.address,
        contactEmail: cu.community.contactEmail,
        accessCode: cu.community.accessCode,
        onboardingCompleted: cu.community.onboardingCompleted,
        authorizationCertified: cu.community.authorizationCertified,
        paymentSetup: cu.community.paymentSetup,
        memberListUploaded: cu.community.memberListUploaded,
        role: cu.role as 'resident' | 'janitorial' | 'admin',
        joinedAt: cu.joinedAt,
        isCurrent: cu.communityId === req.user.currentCommunityId
      }));

    return res.json({
      communities,
      currentCommunityId: req.user.currentCommunityId
    });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/communities/search - Public endpoint to search communities by zip code
router.get('/search/by-zipcode', async (req: any, res) => {
  try {
    const { zipCode } = req.query;

    if (!zipCode) {
      return res.status(400).json({ message: 'Zip code is required' });
    }

    const communities = await Community.findAll({
      where: {
        zipCode: zipCode.toString().trim(),
        isActive: true
      },
      attributes: ['id', 'name', 'description', 'address', 'zipCode'],
      order: [['name', 'ASC']]
    });

    return res.json({
      communities: communities.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        address: c.address,
        zipCode: c.zipCode
      }))
    });
  } catch (error) {
    console.error('Error searching communities by zip code:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/communities/search/by-access-code - Public endpoint to find community by access code
router.get('/search/by-access-code', async (req: any, res) => {
  try {
    const { accessCode } = req.query;

    if (!accessCode) {
      return res.status(400).json({ message: 'Access code is required' });
    }

    const community = await Community.findOne({
      where: {
        accessCode: accessCode.toString().trim().toUpperCase(),
        isActive: true
      },
      attributes: ['id', 'name', 'description', 'address', 'zipCode']
    });

    if (!community) {
      return res.status(404).json({ message: 'Community not found with this access code' });
    }

    return res.json({
      community: {
        id: community.id,
        name: community.name,
        description: community.description,
        address: community.address,
        zipCode: community.zipCode
      }
    });
  } catch (error) {
    console.error('Error searching community by access code:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/communities/:id - Get specific community details
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify user belongs to this community
    const membership = await CommunityUser.findOne({
      where: { userId, communityId: id, isActive: true },
      include: [
        {
          model: Community,
          as: 'community',
          attributes: ['id', 'name', 'description', 'address', 'contactEmail', 'isActive', 'settings']
        }
      ]
    });

    const membershipData = membership as any;
    if (!membershipData || !membershipData.community) {
      return res.status(404).json({ message: 'Community not found or access denied' });
    }

    return res.json({
      community: {
        id: membershipData.community.id,
        name: membershipData.community.name,
        description: membershipData.community.description,
        address: membershipData.community.address,
        contactEmail: membershipData.community.contactEmail,
        settings: membershipData.community.settings
      },
      role: membershipData.role
    });
  } catch (error) {
    console.error('Error fetching community:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/communities/:id/switch - Switch to a different community
router.post('/:id/switch', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const communityId = parseInt(id);

    // Verify user belongs to this community
    const membership = await CommunityUser.findOne({
      where: { userId, communityId, isActive: true },
      include: [
        {
          model: Community,
          as: 'community',
          attributes: ['id', 'name', 'isActive']
        }
      ]
    });

    const membershipData = membership as any;
    if (!membershipData || !membershipData.community || !membershipData.community.isActive) {
      return res.status(403).json({ message: 'You do not have access to this community' });
    }

    // Get all user's communities for new token
    const allMemberships = await CommunityUser.findAll({
      where: { userId, isActive: true },
      include: [
        {
          model: Community,
          as: 'community',
          attributes: ['id', 'name', 'isActive']
        }
      ],
      attributes: ['role', 'communityId']
    });

    const communities = (allMemberships as any[])
      .filter((cu: any) => cu.community && cu.community.isActive)
      .map((cu: any) => ({
        id: cu.communityId,
        name: cu.community.name,
        role: cu.role as 'resident' | 'janitorial' | 'admin'
      }));

    // Generate new JWT token with switched community
    const token = jwt.sign(
      {
        userId,
        email: req.user.email,
        currentCommunityId: communityId,
        communityRole: membershipData.role as 'resident' | 'janitorial' | 'admin',
        allCommunities: communities.map(c => ({ id: c.id, name: c.name, role: c.role }))
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

      return res.json({
        message: 'Community switched successfully',
        currentCommunity: {
          id: communityId,
          name: membershipData.community.name,
          role: membershipData.role
        },
        token
      });
  } catch (error) {
    console.error('Error switching community:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/communities/:id/users - List users in community (admin only)
router.get('/:id/users', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    const { id } = req.params;
    const communityId = parseInt(id);

    // Verify user is admin of this community
    if (req.user.currentCommunityId !== communityId) {
      return res.status(403).json({ message: 'You can only manage users in your current community' });
    }

    const memberships = await CommunityUser.findAll({
      where: { communityId, isActive: true },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'address']
        }
      ],
      attributes: ['role', 'joinedAt', 'createdAt']
    });

    const users = (memberships as any[])
      .filter((m: any) => m.user)
      .map((m: any) => ({
        id: m.user.id,
        email: m.user.email,
        firstName: m.user.firstName,
        lastName: m.user.lastName,
        phone: m.user.phone,
        address: m.user.address,
        role: m.role,
        joinedAt: m.joinedAt
      }));

    return res.json({ users, total: users.length });
  } catch (error) {
    console.error('Error fetching community users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/communities - Create new community (admin only, future feature)
// For now, communities are created via migration or admin panel
router.post('/', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    const { name, description, address, contactEmail } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Community name is required' });
    }

    // Check if community name already exists
    const existing = await Community.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ message: 'Community with this name already exists' });
    }

    const community = await Community.create({
      name,
      description: description || null,
      address: address || null,
      contactEmail: contactEmail || null,
      isActive: true
    });

    // Add creator as admin of the new community
    await CommunityUser.create({
      userId: req.user.id,
      communityId: community.id,
      role: 'admin',
      isActive: true
    });

    return res.status(201).json({
      message: 'Community created successfully',
      community: {
        id: community.id,
        name: community.name,
        description: community.description
      }
    });
  } catch (error) {
    console.error('Error creating community:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/communities/:id - Update community (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    const { id } = req.params;
    const communityId = parseInt(id);

    // Verify user is admin of this community
    if (req.user.currentCommunityId !== communityId) {
      return res.status(403).json({ message: 'You can only update your current community' });
    }

    const { name, description, address, contactEmail, isActive } = req.body;

    const community = await Community.findByPk(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Update allowed fields
    if (name !== undefined) community.name = name;
    if (description !== undefined) community.description = description;
    if (address !== undefined) community.address = address;
    if (contactEmail !== undefined) community.contactEmail = contactEmail;
    if (isActive !== undefined) community.isActive = isActive;

    await community.save();

    return res.json({
      message: 'Community updated successfully',
      community: {
        id: community.id,
        name: community.name,
        description: community.description,
        address: community.address,
        contactEmail: community.contactEmail,
        isActive: community.isActive
      }
    });
  } catch (error) {
    console.error('Error updating community:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/communities/:id/onboarding/certify - Certify authorization
router.put('/:id/onboarding/certify', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    const { id } = req.params;
    const communityId = parseInt(id);
    const { certified } = req.body;

    // Verify user is admin of this community
    const membership = await CommunityUser.findOne({
      where: {
        userId: req.user.id,
        communityId,
        role: 'admin',
        isActive: true
      }
    });

    if (!membership) {
      return res.status(403).json({ message: 'You must be an admin of this community' });
    }

    const community = await Community.findByPk(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    community.authorizationCertified = certified;
    await community.save();

    return res.json({
      message: 'Authorization certification updated',
      community: {
        id: community.id,
        authorizationCertified: community.authorizationCertified
      }
    });
  } catch (error) {
    console.error('Error updating authorization certification:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/communities/:id/onboarding/complete - Mark onboarding as complete
router.put('/:id/onboarding/complete', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    const { id } = req.params;
    const communityId = parseInt(id);

    // Verify user is admin of this community
    const membership = await CommunityUser.findOne({
      where: {
        userId: req.user.id,
        communityId,
        role: 'admin',
        isActive: true
      }
    });

    if (!membership) {
      return res.status(403).json({ message: 'You must be an admin of this community' });
    }

    const community = await Community.findByPk(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Generate access code if not already set
    if (!community.accessCode) {
      const accessCode = crypto.randomBytes(4).toString('hex').toUpperCase();
      community.accessCode = accessCode;
    }

    community.onboardingCompleted = true;
    community.memberListUploaded = true;
    await community.save();

    return res.json({
      message: 'Onboarding completed',
      community: {
        id: community.id,
        onboardingCompleted: community.onboardingCompleted,
        accessCode: community.accessCode
      }
    });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/communities/:id/onboarding/send-access-codes - Send access codes via email
router.post('/:id/onboarding/send-access-codes', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    const { id } = req.params;
    const communityId = parseInt(id);
    const { emails } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: 'Email addresses are required' });
    }

    // Verify user is admin of this community
    const membership = await CommunityUser.findOne({
      where: {
        userId: req.user.id,
        communityId,
        role: 'admin',
        isActive: true
      }
    });

    if (!membership) {
      return res.status(403).json({ message: 'You must be an admin of this community' });
    }

    const community = await Community.findByPk(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Generate access code if not already set
    if (!community.accessCode) {
      const accessCode = crypto.randomBytes(4).toString('hex').toUpperCase();
      community.accessCode = accessCode;
      await community.save();
    }

    const baseUrl = process.env.FRONTEND_URL || 'https://www.neighbri.com';
    const registrationUrl = `${baseUrl}/register`;

    // Send emails to all addresses
    const emailPromises = emails.map(async (email: string) => {
      try {
        const { subject, html } = buildAccessCodeEmail(community.name, community.accessCode!, registrationUrl);
        await sendEmail({ to: email.trim(), subject, html });
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
      }
    });

    await Promise.all(emailPromises);

    return res.json({
      message: `Access codes sent to ${emails.length} email address(es)`,
      accessCode: community.accessCode
    });
  } catch (error) {
    console.error('Error sending access codes:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/communities/:id/onboarding/upload-member-list - Upload member list CSV
router.post('/:id/onboarding/upload-member-list', authenticateToken, requireAdmin, upload.single('memberList'), async (req: any, res) => {
  try {
    const { id } = req.params;
    const communityId = parseInt(id);

    // Verify user is admin of this community
    const membership = await CommunityUser.findOne({
      where: {
        userId: req.user.id,
        communityId,
        role: 'admin',
        isActive: true
      }
    });

    if (!membership) {
      return res.status(403).json({ message: 'You must be an admin of this community' });
    }

    const community = await Community.findByPk(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    // Parse CSV file
    const csvContent = req.file.buffer.toString('utf-8');
    const lines = csvContent.split('\n').filter((line: string) => line.trim());
    const emails: string[] = [];

    // Simple CSV parsing - assumes first column is email or looks for email column
    lines.forEach((line: string, index: number) => {
      if (index === 0) {
        // Skip header row
        return;
      }
      const columns = line.split(',').map((col: string) => col.trim().replace(/^"|"$/g, ''));
      // Try to find email column (look for @ symbol)
      const emailColumn = columns.find((col: string) => col.includes('@'));
      if (emailColumn) {
        emails.push(emailColumn);
      } else if (columns[0] && columns[0].includes('@')) {
        emails.push(columns[0]);
      }
    });

    if (emails.length === 0) {
      return res.status(400).json({ message: 'No email addresses found in CSV file' });
    }

    // Generate access code if not already set
    if (!community.accessCode) {
      const accessCode = crypto.randomBytes(4).toString('hex').toUpperCase();
      community.accessCode = accessCode;
      await community.save();
    }

    const baseUrl = process.env.FRONTEND_URL || 'https://www.neighbri.com';
    const registrationUrl = `${baseUrl}/register`;

    // Send emails to all addresses
    const emailPromises = emails.map(async (email: string) => {
      try {
        const { subject, html } = buildAccessCodeEmail(community.name, community.accessCode!, registrationUrl);
        await sendEmail({ to: email.trim(), subject, html });
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
      }
    });

    await Promise.all(emailPromises);

    return res.json({
      message: `Member list processed and access codes sent to ${emails.length} email address(es)`,
      accessCode: community.accessCode,
      emailsProcessed: emails.length
    });
  } catch (error) {
    console.error('Error uploading member list:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

function buildAccessCodeEmail(communityName: string, accessCode: string, registrationUrl: string) {
  return {
    subject: `Welcome to ${communityName} on Neighbri`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <h2>Welcome to Neighbri, ${communityName}!</h2>
        <p>Your community has been set up on Neighbri. Use the access code below to register your account:</p>
        <div style="background:#f0f9f4;border:2px solid #355B45;border-radius:8px;padding:20px;text-align:center;margin:20px 0;">
          <div style="font-size:14px;color:#6b7280;margin-bottom:8px;">Your Access Code</div>
          <div style="font-size:32px;font-weight:700;color:#355B45;letter-spacing:4px;">${accessCode}</div>
        </div>
        <p>Click the button below to register your account:</p>
        <p><a href="${registrationUrl}" style="background:#355B45;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;">Register Now</a></p>
        <p>Or visit <a href="${registrationUrl}">${registrationUrl}</a> and enter your access code: <strong>${accessCode}</strong></p>
        <p>If you have any questions, please contact your community administrator.</p>
      </div>
    `
  };
}

export default router;

