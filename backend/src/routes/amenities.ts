import express from 'express';
import { Amenity } from '../models';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// GET /api/amenities - List all amenities for current community
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const communityId = req.user.currentCommunityId;
    
    console.log('🔍 Fetching amenities for community:', communityId);
    const amenities = await Amenity.findAll({
      where: { 
        communityId,
        isActive: true 
      },
      attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity']
    });
    
    console.log('✅ Found amenities:', amenities.length, 'items');
    
    return res.json(amenities);
  } catch (error) {
    console.error('❌ Error fetching amenities:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/amenities/:id - Get specific amenity (must belong to current community)
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const communityId = req.user.currentCommunityId;
    
    const amenity = await Amenity.findOne({
      where: { 
        id,
        communityId 
      },
      attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity']
    });
    
    if (!amenity) {
      return res.status(404).json({ message: 'Amenity not found' });
    }
    
    return res.json(amenity);
  } catch (error) {
    console.error('Error fetching amenity:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
