import express from 'express';
import { Reservation, Amenity, User } from '../models';
import { authenticateToken } from '../middleware/auth';
import { Op } from 'sequelize';

// Define interfaces for associated models
interface ReservationWithAssociations extends Reservation {
  amenity?: Amenity;
  user?: User;
}

const router = express.Router();

// GET /api/reservations - Get user's reservations
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { status, amenityId } = req.query;

    console.log('🔍 Fetching reservations for user:', userId);

    const whereClause: any = { userId };
    
    if (status) {
      whereClause.status = status;
    }
    
    if (amenityId) {
      whereClause.amenityId = amenityId;
    }

    const reservations = await Reservation.findAll({
      where: whereClause,
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity']
        }
      ],
      order: [['date', 'ASC'], ['partyTimeStart', 'ASC']]
    });

    console.log('✅ Found reservations:', reservations.length);

    return res.json({
      reservations,
      total: reservations.length
    });

  } catch (error) {
    console.error('❌ Error fetching reservations:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/reservations/all - Get all reservations (janitorial and admin)
router.get('/all', authenticateToken, async (req: any, res) => {
  try {
    // Check if user is janitorial or admin
    if (!['janitorial', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Janitorial or admin access required' });
    }

    console.log('🔍 Admin fetching all reservations for user:', req.user.role);

    // Fetch reservations with associations
    const reservations = await Reservation.findAll({
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        }
      ],
      order: [['date', 'ASC'], ['partyTimeStart', 'ASC']]
    });

    console.log('✅ Found reservations:', reservations.length);

    return res.json({
      reservations: reservations,
      total: reservations.length
    });

  } catch (error: any) {
    console.error('❌ Error fetching all reservations:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/reservations/:id - Get specific reservation
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log('🔍 Fetching reservation:', id, 'for user:', userId);

    const reservation = await Reservation.findOne({
      where: { 
        id: id,
        userId: userId // Ensure user can only access their own reservations
      },
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity']
        }
      ]
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    return res.json(reservation);

  } catch (error) {
    console.error('❌ Error fetching reservation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/reservations - Create new reservation
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const {
      amenityId,
      date,
      setupTimeStart,
      setupTimeEnd,
      partyTimeStart,
      partyTimeEnd,
      guestCount,
      eventName,
      isPrivate,
      specialRequirements
    } = req.body;

    console.log('📝 Creating reservation for user:', userId, 'data:', req.body);

    // Validate required fields
    if (!amenityId || !date || !setupTimeStart || !setupTimeEnd || !partyTimeStart || !partyTimeEnd || !guestCount) {
      return res.status(400).json({ 
        message: 'Missing required fields: amenityId, date, setupTimeStart, setupTimeEnd, partyTimeStart, partyTimeEnd, guestCount' 
      });
    }

    // Validate amenity exists
    const amenity = await Amenity.findByPk(amenityId);
    if (!amenity) {
      return res.status(404).json({ message: 'Amenity not found' });
    }

    // Validate guest count
    if (guestCount > amenity.capacity) {
      return res.status(400).json({ 
        message: `Guest count (${guestCount}) exceeds amenity capacity (${amenity.capacity})` 
      });
    }

    // Check for time conflicts
    const conflictingReservation = await Reservation.findOne({
      where: {
        amenityId: amenityId,
        date: date,
        status: {
          [Op.in]: ['NEW', 'JANITORIAL_APPROVED', 'FULLY_APPROVED']
        },
        [Op.or]: [
          {
            setupTimeStart: {
              [Op.lt]: partyTimeEnd
            },
            partyTimeEnd: {
              [Op.gt]: setupTimeStart
            }
          }
        ]
      }
    });

    if (conflictingReservation) {
      return res.status(409).json({ 
        message: 'Time conflict: Another reservation exists during this time period' 
      });
    }

    // Calculate totals
    const totalFee = amenity.reservationFee;
    const totalDeposit = amenity.deposit;

    // Create reservation
    const reservation = await Reservation.create({
      userId,
      amenityId,
      date,
      setupTimeStart,
      setupTimeEnd,
      partyTimeStart,
      partyTimeEnd,
      guestCount,
      eventName: eventName || null,
      isPrivate: isPrivate === true || isPrivate === 'true',
      specialRequirements: specialRequirements || null,
      status: 'NEW',
      totalFee,
      totalDeposit
    });

    // Fetch the created reservation with amenity details
    const createdReservation = await Reservation.findByPk(reservation.id, {
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        }
      ]
    }) as ReservationWithAssociations;

    console.log('✅ Reservation created:', createdReservation.id);

    return res.status(201).json({
      message: 'Reservation created successfully',
      reservation: createdReservation
    });

  } catch (error) {
    console.error('❌ Error creating reservation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/reservations/:id - Update reservation
router.put('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    console.log('📝 Updating reservation:', id, 'for user:', userId);

    // Find reservation
    const reservation = await Reservation.findOne({
      where: { 
        id: id,
        userId: userId // Ensure user can only update their own reservations
      }
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Don't allow updates to fully approved/completed reservations
    if (reservation.status === 'FULLY_APPROVED' || reservation.status === 'COMPLETED') {
      return res.status(400).json({ 
        message: 'Cannot update fully approved or completed reservations' 
      });
    }

    // Update reservation
    await reservation.update(updateData);

    // Fetch updated reservation with details
    const updatedReservation = await Reservation.findByPk(id, {
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity']
        }
      ]
    });

    console.log('✅ Reservation updated:', id);

    return res.json({
      message: 'Reservation updated successfully',
      reservation: updatedReservation
    });

  } catch (error) {
    console.error('❌ Error updating reservation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/reservations/:id - Cancel reservation
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log('🗑️ Cancelling reservation:', id, 'for user:', userId);

    // Find reservation
    const reservation = await Reservation.findOne({
      where: { 
        id: id,
        userId: userId // Ensure user can only cancel their own reservations
      }
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Don't allow cancellation of completed reservations
    if (reservation.status === 'COMPLETED') {
      return res.status(400).json({ 
        message: 'Cannot cancel completed reservations' 
      });
    }

    // Update status to cancelled
    await reservation.update({ status: 'CANCELLED' });

    console.log('✅ Reservation cancelled:', id);

    return res.json({
      message: 'Reservation cancelled successfully'
    });

  } catch (error) {
    console.error('❌ Error cancelling reservation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// PUT /api/reservations/:id/approve - Janitorial approval
router.put('/:id/approve', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { cleaningTimeStart, cleaningTimeEnd } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    console.log('✅ Janitorial approval for reservation:', id, 'by user:', userId);

    // Check if user is janitorial or admin
    if (userRole !== 'janitorial' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Janitorial access required' });
    }

    // Validate cleaning time parameters (required for janitorial approval)
    if (userRole === 'janitorial' && (!cleaningTimeStart || !cleaningTimeEnd)) {
      return res.status(400).json({ 
        message: 'Cleaning time start and end are required for janitorial approval' 
      });
    }

    // Find reservation
    const reservation = await Reservation.findByPk(id, {
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        }
      ]
    }) as ReservationWithAssociations;

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Validate cleaning time is after party end time
    if (cleaningTimeStart && cleaningTimeEnd) {
      const partyEndTime = new Date(reservation.partyTimeEnd);
      const cleaningStartTime = new Date(cleaningTimeStart);
      
      if (cleaningStartTime <= partyEndTime) {
        return res.status(400).json({ 
          message: 'Cleaning time must start after the party ends' 
        });
      }

      // Validate cleaning time duration (default 2 hours)
      const cleaningDuration = new Date(cleaningTimeEnd).getTime() - new Date(cleaningTimeStart).getTime();
      const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
      
      if (cleaningDuration < twoHours) {
        return res.status(400).json({ 
          message: 'Cleaning time must be at least 2 hours' 
        });
      }
    }

    // Determine new status based on current status
    let newStatus: 'JANITORIAL_APPROVED' | 'FULLY_APPROVED';
    if (reservation.status === 'NEW') {
      newStatus = 'JANITORIAL_APPROVED';
    } else if (reservation.status === 'JANITORIAL_APPROVED' && userRole === 'admin') {
      newStatus = 'FULLY_APPROVED';
    } else {
      return res.status(400).json({ 
        message: `Cannot approve reservation with status: ${reservation.status}` 
      });
    }

    // Update reservation status and cleaning time
    const updateData: any = { status: newStatus };
    if (cleaningTimeStart && cleaningTimeEnd) {
      updateData.cleaningTimeStart = new Date(cleaningTimeStart);
      updateData.cleaningTimeEnd = new Date(cleaningTimeEnd);
    }
    
    await reservation.update(updateData);

    console.log('✅ Reservation approved:', id, 'new status:', newStatus);

    return res.json({
      message: 'Reservation approved successfully',
      reservation: {
        ...reservation.toJSON(),
        status: newStatus
      }
    });

  } catch (error) {
    console.error('❌ Error approving reservation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/reservations/:id/reject - Janitorial rejection
router.put('/:id/reject', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const { reason } = req.body;

    console.log('❌ Janitorial rejection for reservation:', id, 'by user:', userId);

    // Check if user is janitorial or admin
    if (userRole !== 'janitorial' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Janitorial access required' });
    }

    // Find reservation
    const reservation = await Reservation.findByPk(id, {
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        }
      ]
    }) as ReservationWithAssociations;

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Only allow rejection of NEW or JANITORIAL_APPROVED reservations
    if (reservation.status !== 'NEW' && reservation.status !== 'JANITORIAL_APPROVED') {
      return res.status(400).json({ 
        message: `Cannot reject reservation with status: ${reservation.status}` 
      });
    }

    // Update reservation status to cancelled
    await reservation.update({ 
      status: 'CANCELLED',
      specialRequirements: reason ? `${reservation.specialRequirements || ''}\n\nRejection reason: ${reason}`.trim() : reservation.specialRequirements
    });

    console.log('✅ Reservation rejected:', id);

    return res.json({
      message: 'Reservation rejected successfully',
      reservation: {
        ...reservation.toJSON(),
        status: 'CANCELLED'
      }
    });

  } catch (error) {
    console.error('❌ Error rejecting reservation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Mark party as complete (janitorial)
router.put('/:id/complete', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { damagesFound } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if user is janitorial or admin
    if (userRole !== 'janitorial' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Janitorial access required' });
    }

    // Find reservation
    const reservation = await Reservation.findByPk(id, {
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        }
      ]
    }) as ReservationWithAssociations;

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if reservation is in a completable state
    if (reservation.status !== 'FULLY_APPROVED' && reservation.status !== 'JANITORIAL_APPROVED') {
      return res.status(400).json({ 
        message: `Cannot complete reservation with status: ${reservation.status}` 
      });
    }

    // Update reservation
    if (damagesFound === false || damagesFound === 'false') {
      // No damages found
      await reservation.update({
        status: 'COMPLETED',
        damageAssessed: false,
        damageAssessmentPending: false,
        damageAssessmentStatus: null
      });
    } else {
      // Damages found - set pending flag for assessment
      await reservation.update({
        status: 'COMPLETED',
        damageAssessed: false,
        damageAssessmentPending: true
        // Don't set damageAssessmentStatus yet - wait for assessment
      });
    }

    console.log('✅ Party marked as complete:', id, 'damagesFound:', damagesFound);

    return res.json({
      message: 'Party marked as complete',
      reservation: reservation.toJSON(),
      requiresDamageAssessment: damagesFound === true || damagesFound === 'true'
    });

  } catch (error) {
    console.error('❌ Error marking party complete:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Assess damages (janitorial)
router.post('/:id/assess-damages', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { amount, description, notes } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if user is janitorial or admin
    if (userRole !== 'janitorial' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Janitorial access required' });
    }

    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Damage amount must be greater than 0' });
    }
    if (!description || description.trim() === '') {
      return res.status(400).json({ message: 'Damage description is required' });
    }

    // Find reservation
    const reservation = await Reservation.findByPk(id, {
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        }
      ]
    }) as ReservationWithAssociations;

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if reservation is completed and needs damage assessment
    if (reservation.status !== 'COMPLETED') {
      return res.status(400).json({ 
        message: 'Reservation must be completed before assessing damages' 
      });
    }

    // Validate amount doesn't exceed potential damage fee
    const maxDamageFee = parseFloat(String(reservation.amenity?.deposit || reservation.totalDeposit));
    const damageAmount = parseFloat(String(amount));
    
    if (damageAmount > maxDamageFee) {
      return res.status(400).json({ 
        message: `Damage amount cannot exceed potential damage fee of $${maxDamageFee.toFixed(2)}` 
      });
    }

    // Update reservation with damage assessment
    await reservation.update({
      damageAssessed: true,
      damageAssessmentPending: true,
      damageAssessmentStatus: 'PENDING',
      damageChargeAmount: damageAmount,
      damageDescription: description.trim(),
      damageNotes: notes ? notes.trim() : null,
      damageAssessedBy: userId,
      damageAssessedAt: new Date()
    });

    console.log('✅ Damage assessment submitted:', id, 'amount:', damageAmount);

    return res.json({
      message: 'Damage assessment submitted for admin review',
      reservation: reservation.toJSON()
    });

  } catch (error) {
    console.error('❌ Error assessing damages:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Review damage assessment (admin)
router.put('/:id/review-damage-assessment', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { action, amount, adminNotes } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if user is admin
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Validate action
    if (!['approve', 'adjust', 'deny'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action. Must be approve, adjust, or deny' });
    }

    // If adjust, validate amount
    if (action === 'adjust' && (!amount || amount <= 0)) {
      return res.status(400).json({ message: 'Adjusted amount is required and must be greater than 0' });
    }

    // Find reservation
    const reservation = await Reservation.findByPk(id, {
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        }
      ]
    }) as ReservationWithAssociations;

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if damage assessment is pending
    if (!reservation.damageAssessmentPending || reservation.damageAssessmentStatus !== 'PENDING') {
      return res.status(400).json({ 
        message: 'No pending damage assessment found for this reservation' 
      });
    }

    // Process action
    let finalCharge = 0;
    let newStatus: 'APPROVED' | 'ADJUSTED' | 'DENIED';
    const updateData: any = {
      damageReviewedBy: userId,
      damageReviewedAt: new Date(),
      damageAssessmentPending: false
    };

    if (action === 'approve') {
      newStatus = 'APPROVED';
      finalCharge = parseFloat(String(reservation.damageChargeAmount || 0));
      updateData.damageAssessmentStatus = 'APPROVED';
      updateData.damageCharge = finalCharge;
      
    } else if (action === 'adjust') {
      newStatus = 'ADJUSTED';
      const adjustedAmount = parseFloat(String(amount));
      const maxDamageFee = parseFloat(String(reservation.amenity?.deposit || reservation.totalDeposit));
      
      if (adjustedAmount > maxDamageFee) {
        return res.status(400).json({ 
          message: `Adjusted amount cannot exceed potential damage fee of $${maxDamageFee.toFixed(2)}` 
        });
      }
      
      finalCharge = adjustedAmount;
      updateData.damageAssessmentStatus = 'ADJUSTED';
      updateData.damageCharge = finalCharge;
      updateData.damageChargeAdjusted = adjustedAmount;
      if (adminNotes) {
        updateData.adminDamageNotes = adminNotes.trim();
      }
      
    } else if (action === 'deny') {
      newStatus = 'DENIED';
      finalCharge = 0;
      updateData.damageAssessmentStatus = 'DENIED';
      updateData.damageCharge = null;
      if (adminNotes) {
        updateData.adminDamageNotes = adminNotes.trim();
      }
    }

    await reservation.update(updateData);

    console.log('✅ Damage assessment reviewed:', id, 'action:', action, 'charge:', finalCharge);

    // TODO: Integrate with Square here to charge the damage fee if approved/adjusted
    // For now, we just update the database

    return res.json({
      message: `Damage assessment ${action}d successfully`,
      reservation: reservation.toJSON(),
      chargeAmount: finalCharge,
      charged: action !== 'deny'
    });

  } catch (error) {
    console.error('❌ Error reviewing damage assessment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get pending damage reviews (admin)
router.get('/admin/damage-reviews', authenticateToken, async (req: any, res) => {
  try {
    const userRole = req.user.role;

    // Check if user is admin
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Find all reservations with pending damage assessments
    const reservations = await Reservation.findAll({
      where: {
        damageAssessmentPending: true,
        damageAssessmentStatus: 'PENDING'
      },
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        }
      ],
      order: [['damageAssessedAt', 'ASC']]
    });

    return res.json({
      reservations: reservations.map(r => r.toJSON())
    });

  } catch (error) {
    console.error('❌ Error fetching pending damage reviews:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
