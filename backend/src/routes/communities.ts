import express from 'express';
import { Community, CommunityUser, User } from '../models';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import jwt from 'jsonwebtoken';

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
          attributes: ['id', 'name', 'description', 'address', 'contactEmail', 'isActive']
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

export default router;

