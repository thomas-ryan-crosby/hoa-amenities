import express from 'express';
import { Amenity, Community } from '../models';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// GET /api/amenities/public - Get all public amenities (no auth required)
router.get('/public', async (req: any, res) => {
  try {
    const publicAmenities = await Amenity.findAll({
      where: { 
        isPublic: true,
        isActive: true
      },
      include: [{
        model: Community,
        as: 'community',
        attributes: ['id', 'name', 'address']
      }],
      attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'calendarGroup', 'publicReservationFee', 'publicDeposit', 'communityId']
    });
    
    return res.json(publicAmenities);
  } catch (error) {
    console.error('Error fetching public amenities:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

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
      attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'calendarGroup', 'isPublic', 'publicReservationFee', 'publicDeposit', 'daysOfOperation', 'hoursOfOperation', 'displayColor', 'janitorialRequired', 'approvalRequired', 'isActive']
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
      attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'calendarGroup', 'isPublic', 'publicReservationFee', 'publicDeposit', 'daysOfOperation', 'hoursOfOperation', 'displayColor', 'janitorialRequired', 'approvalRequired']
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
    const { name, description, reservationFee, deposit, capacity, calendarGroup, isPublic, publicReservationFee, publicDeposit, daysOfOperation, hoursOfOperation, displayColor, janitorialRequired, approvalRequired } = req.body;

    if (!name || reservationFee === undefined || deposit === undefined || !capacity) {
      return res.status(400).json({ message: 'Name, reservation fee, deposit, and capacity are required' });
    }

    // Validate numeric values
    const fee = parseFloat(reservationFee);
    const depositAmount = parseFloat(deposit);
    const cap = parseInt(capacity);

    if (isNaN(fee) || fee < 0) {
      return res.status(400).json({ message: 'Reservation fee must be a non-negative number' });
    }
    if (isNaN(depositAmount) || depositAmount < 0) {
      return res.status(400).json({ message: 'Deposit must be a non-negative number' });
    }
    if (isNaN(cap) || cap < 1) {
      return res.status(400).json({ message: 'Capacity must be a positive number' });
    }

    // Verify user is admin of this community
    if (!communityId) {
      return res.status(403).json({ message: 'No community selected' });
    }

      const amenity = await Amenity.create({
        name,
        description: description || null,
        reservationFee: fee,
        deposit: depositAmount,
        capacity: cap,
        communityId,
        calendarGroup: calendarGroup || null,
        isPublic: isPublic === true,
        publicReservationFee: publicReservationFee !== undefined && publicReservationFee !== '' ? parseFloat(publicReservationFee) : null,
        publicDeposit: publicDeposit !== undefined && publicDeposit !== '' ? parseFloat(publicDeposit) : null,
        daysOfOperation: daysOfOperation ? (typeof daysOfOperation === 'string' ? daysOfOperation : JSON.stringify(daysOfOperation)) : null,
        hoursOfOperation: hoursOfOperation ? (typeof hoursOfOperation === 'string' ? hoursOfOperation : JSON.stringify(hoursOfOperation)) : null,
        displayColor: displayColor || '#355B45',
        janitorialRequired: janitorialRequired !== undefined ? janitorialRequired === true : true,
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
        calendarGroup: amenity.calendarGroup,
        isPublic: amenity.isPublic,
        publicReservationFee: amenity.publicReservationFee,
        publicDeposit: amenity.publicDeposit,
        daysOfOperation: amenity.daysOfOperation,
        hoursOfOperation: amenity.hoursOfOperation,
        displayColor: amenity.displayColor,
        janitorialRequired: amenity.janitorialRequired
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
    const { 
      name, 
      description, 
      reservationFee, 
      deposit, 
      capacity, 
      calendarGroup, 
      isPublic, 
      publicReservationFee, 
      publicDeposit, 
      daysOfOperation, 
      hoursOfOperation, 
      displayColor, 
      janitorialRequired, 
      isActive 
    } = req.body;

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
    if (reservationFee !== undefined) {
      const fee = parseFloat(reservationFee);
      if (isNaN(fee) || fee < 0) {
        return res.status(400).json({ message: 'Reservation fee must be a non-negative number' });
      }
      amenity.reservationFee = fee;
    }
    if (deposit !== undefined) {
      const depositAmount = parseFloat(deposit);
      if (isNaN(depositAmount) || depositAmount < 0) {
        return res.status(400).json({ message: 'Deposit must be a non-negative number' });
      }
      amenity.deposit = depositAmount;
    }
    if (capacity !== undefined) {
      const cap = parseInt(capacity);
      if (isNaN(cap) || cap < 1) {
        return res.status(400).json({ message: 'Capacity must be a positive number' });
      }
      amenity.capacity = cap;
    }
    if (calendarGroup !== undefined) amenity.calendarGroup = calendarGroup || null;
    if (isPublic !== undefined) amenity.isPublic = isPublic === true;
    if (publicReservationFee !== undefined) {
      amenity.publicReservationFee = publicReservationFee !== null && publicReservationFee !== '' ? parseFloat(publicReservationFee) : null;
    }
    if (publicDeposit !== undefined) {
      amenity.publicDeposit = publicDeposit !== null && publicDeposit !== '' ? parseFloat(publicDeposit) : null;
    }
    if (daysOfOperation !== undefined) {
      amenity.daysOfOperation = daysOfOperation ? (typeof daysOfOperation === 'string' ? daysOfOperation : JSON.stringify(daysOfOperation)) : null;
    }
    if (hoursOfOperation !== undefined) {
      amenity.hoursOfOperation = hoursOfOperation ? (typeof hoursOfOperation === 'string' ? hoursOfOperation : JSON.stringify(hoursOfOperation)) : null;
    }
    if (displayColor !== undefined) amenity.displayColor = displayColor || '#355B45';
    if (janitorialRequired !== undefined) amenity.janitorialRequired = janitorialRequired === true;
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
        isPublic: amenity.isPublic,
        publicReservationFee: amenity.publicReservationFee,
        publicDeposit: amenity.publicDeposit,
        daysOfOperation: amenity.daysOfOperation,
        hoursOfOperation: amenity.hoursOfOperation,
        displayColor: amenity.displayColor,
        janitorialRequired: amenity.janitorialRequired,
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
