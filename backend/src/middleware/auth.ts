import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, CommunityUser, Community } from '../models';

// Extend Request interface to include user with community info
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        currentCommunityId: number | null;
        communityRole: 'resident' | 'janitorial' | 'admin';
        allCommunities: Array<{id: number, name: string, role: string}>;
      };
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    // Verify user still exists and is active
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'email', 'isActive']
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    // Extract community info from token
    const currentCommunityId = decoded.currentCommunityId;
    const communityRole = decoded.communityRole;
    const allCommunities = decoded.allCommunities || [];

    // Allow users without communities to access certain routes (profile, join community, etc.)
    if (!currentCommunityId || !communityRole) {
      // User has no communities - allow limited access
      req.user = {
        id: user.id,
        email: user.email,
        currentCommunityId: null as any, // Type assertion for compatibility
        communityRole: 'resident' as 'resident' | 'janitorial' | 'admin', // Default role
        allCommunities: []
      };
      return next();
    }

    // Verify user still has access to the current community
    const communityMembership = await CommunityUser.findOne({
      where: { 
        userId: user.id, 
        communityId: currentCommunityId,
        isActive: true 
      },
      include: [
        {
          model: Community,
          as: 'community',
          attributes: ['id', 'name', 'isActive']
        }
      ]
    });

    const membership = communityMembership as any;
    if (!membership || !membership.community || !membership.community.isActive) {
      return res.status(403).json({ 
        message: 'User no longer has access to the selected community' 
      });
    }

    // Verify the role in the token matches the database
    if (membership.role !== communityRole) {
      // Role changed, update token would require re-login
      return res.status(403).json({ 
        message: 'Your role has changed. Please log in again.' 
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      currentCommunityId,
      communityRole: communityRole as 'resident' | 'janitorial' | 'admin',
      allCommunities
    };

    return next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check communityRole instead of user.role
    if (!roles.includes(req.user.communityRole)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions',
        required: roles,
        current: req.user.communityRole
      });
    }

    return next();
  };
};

// Role-specific middleware
export const requireAdmin = requireRole(['admin']);
export const requireJanitorial = requireRole(['janitorial', 'admin']);
export const requireResident = requireRole(['resident', 'janitorial', 'admin']);
