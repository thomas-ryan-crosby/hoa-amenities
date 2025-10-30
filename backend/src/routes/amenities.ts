import express from 'express';
import { Amenity } from '../models';

const router = express.Router();

// GET /api/amenities - List all amenities
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Fetching amenities from database...');
    const amenities = await Amenity.findAll({
      where: { isActive: true },
      attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity']
    });
    
    console.log('✅ Found amenities:', amenities.length, 'items');
    console.log('📋 Amenities data:', amenities);
    
    return res.json(amenities);
  } catch (error) {
    console.error('❌ Error fetching amenities:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/amenities/:id - Get specific amenity
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const amenity = await Amenity.findByPk(id, {
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
