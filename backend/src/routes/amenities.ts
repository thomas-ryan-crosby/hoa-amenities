import express from 'express';
import { Amenity } from '../models';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// GET /api/amenities - List all amenities for current community
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const communityId = req.user.currentCommunityId;
    
    console.log('🔍 Fetching amenities for community:', communityId);
    
    // Check if user is admin - if so, return all amenities (including inactive)
    const isAdmin = req.user.communityRole === 'admin';
    
    const whereClause: any = { communityId };
    if (!isAdmin) {
      whereClause.isActive = true;
    }

    const amenities = await Amenity.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'calendarGroup', 'isActive']
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
      attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'calendarGroup']
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

// POST /api/amenities - Create new amenity (admin only)
router.post('/', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    const communityId = req.user.currentCommunityId;
    const { name, description, reservationFee, deposit, capacity, calendarGroup } = req.body;

    if (!name || !reservationFee || !deposit || !capacity) {
      return res.status(400).json({ message: 'Name, reservation fee, deposit, and capacity are required' });
    }

    // Verify user is admin of this community
    if (!communityId) {
      return res.status(403).json({ message: 'No community selected' });
    }

    const amenity = await Amenity.create({
      name,
      description: description || null,
      reservationFee: parseFloat(reservationFee),
      deposit: parseFloat(deposit),
      capacity: parseInt(capacity),
      communityId,
      calendarGroup: calendarGroup || null,
      isActive: true
    });

    return res.status(201).json({
      message: 'Amenity created successfully',
      amenity: {
        id: amenity.id,
        name: amenity.name,
        description: amenity.description,
        reservationFee: amenity.reservationFee,
        deposit: amenity.deposit,
        capacity: amenity.capacity,
        calendarGroup: amenity.calendarGroup
      }
    });
  } catch (error) {
    console.error('Error creating amenity:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/amenities/:id - Update amenity (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    const { id } = req.params;
    const communityId = req.user.currentCommunityId;
    const { name, description, reservationFee, deposit, capacity, calendarGroup, isActive } = req.body;

    if (!communityId) {
      return res.status(403).json({ message: 'No community selected' });
    }

    const amenity = await Amenity.findOne({
      where: { id, communityId }
    });

    if (!amenity) {
      return res.status(404).json({ message: 'Amenity not found' });
    }

    // Update fields
    if (name !== undefined) amenity.name = name;
    if (description !== undefined) amenity.description = description;
    if (reservationFee !== undefined) amenity.reservationFee = parseFloat(reservationFee);
    if (deposit !== undefined) amenity.deposit = parseFloat(deposit);
    if (capacity !== undefined) amenity.capacity = parseInt(capacity);
    if (calendarGroup !== undefined) amenity.calendarGroup = calendarGroup || null;
    if (isActive !== undefined) amenity.isActive = isActive;

    await amenity.save();

    return res.json({
      message: 'Amenity updated successfully',
      amenity: {
        id: amenity.id,
        name: amenity.name,
        description: amenity.description,
        reservationFee: amenity.reservationFee,
        deposit: amenity.deposit,
        capacity: amenity.capacity,
        calendarGroup: amenity.calendarGroup,
        isActive: amenity.isActive
      }
    });
  } catch (error) {
    console.error('Error updating amenity:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/amenities/:id - Delete amenity (admin only, soft delete by setting isActive to false)
router.delete('/:id', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    const { id } = req.params;
    const communityId = req.user.currentCommunityId;

    if (!communityId) {
      return res.status(403).json({ message: 'No community selected' });
    }

    const amenity = await Amenity.findOne({
      where: { id, communityId }
    });

    if (!amenity) {
      return res.status(404).json({ message: 'Amenity not found' });
    }

    // Soft delete by setting isActive to false
    amenity.isActive = false;
    await amenity.save();

    return res.json({
      message: 'Amenity deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting amenity:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
