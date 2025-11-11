import express from 'express';
import { Reservation, Amenity, User } from '../models';
import { authenticateToken } from '../middleware/auth';
import { Op, QueryTypes, col } from 'sequelize';
import { sequelize } from '../models';

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

    const whereClause: any = { 
      userId,
      communityId: req.user.currentCommunityId 
    };
    
    if (status) {
      whereClause.status = status;
    }
    
    if (amenityId) {
      whereClause.amenityId = amenityId;
    }

    // Build attributes list - include modification fields since columns exist in database
    // Use explicit column mapping to ensure camelCase attributes map to lowercase database columns
    const attributes: any[] = [
      'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
      'guestCount', 'specialRequirements', 'status', 'totalFee', 'totalDeposit',
      'damageAssessed', 'damageAssessmentPending', 'damageAssessmentStatus', 'damageCharge', 'damageChargeAmount',
      'eventName', 'isPrivate', 'communityId', 'amenityId', 'userId',
      // Modification fields - explicitly map camelCase to lowercase database columns
      [col('modificationstatus'), 'modificationStatus'],
      [col('proposeddate'), 'proposedDate'],
      [col('proposedpartytimestart'), 'proposedPartyTimeStart'],
      [col('proposedpartytimeend'), 'proposedPartyTimeEnd'],
      [col('modificationreason'), 'modificationReason'],
      [col('modificationproposedby'), 'modificationProposedBy'],
      [col('modificationproposedat'), 'modificationProposedAt']
    ];
    
    const reservations = await Reservation.findAll({
      where: whereClause,
      attributes: attributes,
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'calendarGroup', 'displayColor', 'janitorialRequired', 'approvalRequired']
        }
      ],
      order: [['date', 'ASC'], ['partyTimeStart', 'ASC']],
      raw: false // Ensure Sequelize includes all fields in response
    });

    // DEBUG: Log what fields are actually present
    if (reservations.length > 0) {
      const sample = reservations[0];
      const sampleJson = sample.toJSON ? sample.toJSON() : sample;
      console.log('🔍 Sample reservation fields:', Object.keys(sampleJson));
      console.log('🔍 Sample modificationStatus:', sampleJson.modificationStatus);
      console.log('🔍 Sample proposedPartyTimeStart:', sampleJson.proposedPartyTimeStart);
    }

    console.log('✅ Found reservations:', reservations.length);

    return res.json({
      reservations,
      total: reservations.length
    });

  } catch (error: any) {
    console.error('❌ Error fetching reservations:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error original:', error.original);
    return res.status(500).json({ 
      message: 'Internal server error',
      details: error.message || 'Unknown error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// GET /api/reservations/all - Get all reservations (janitorial and admin)
router.get('/all', authenticateToken, async (req: any, res) => {
  try {
    // Check if user is janitorial or admin in current community
    if (!['janitorial', 'admin'].includes(req.user.communityRole)) {
      return res.status(403).json({ message: 'Janitorial or admin access required' });
    }

    const communityId = req.user.currentCommunityId;
    const { calendarGroup, amenityId, startDate, endDate } = req.query;
    console.log('🔍 Admin fetching all reservations for community:', communityId);

    // Build where clause for reservations
    const whereClause: any = {
      communityId
    };

    // Filter by date range if provided
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    // Build amenity filter
    const amenityWhere: any = {};
    if (calendarGroup !== undefined) {
      if (calendarGroup === '') {
        // Filter for amenities with no calendar group (null)
        amenityWhere.calendarGroup = null;
      } else {
        amenityWhere.calendarGroup = calendarGroup;
      }
    }
    if (amenityId) {
      amenityWhere.id = amenityId;
    }

    // Build attributes list - include modification fields since columns exist in database
    // Use explicit column mapping to ensure camelCase attributes map to lowercase database columns
    const attributes: any[] = [
      'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
      'guestCount', 'specialRequirements', 'status', 'totalFee', 'totalDeposit',
      'damageAssessed', 'damageAssessmentPending', 'damageAssessmentStatus', 'damageCharge', 'damageChargeAmount',
      'eventName', 'isPrivate', 'communityId', 'amenityId', 'userId',
      // Modification fields - explicitly map camelCase to lowercase database columns
      [col('modificationstatus'), 'modificationStatus'],
      [col('proposeddate'), 'proposedDate'],
      [col('proposedpartytimestart'), 'proposedPartyTimeStart'],
      [col('proposedpartytimeend'), 'proposedPartyTimeEnd'],
      [col('modificationreason'), 'modificationReason'],
      [col('modificationproposedby'), 'modificationProposedBy'],
      [col('modificationproposedat'), 'modificationProposedAt']
    ];
    
    const reservations = await Reservation.findAll({
      where: whereClause,
      attributes: attributes,
      include: [
        {
          model: Amenity,
          as: 'amenity',
          where: Object.keys(amenityWhere).length > 0 ? amenityWhere : undefined,
          required: true,
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'calendarGroup', 'displayColor', 'janitorialRequired', 'approvalRequired']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        }
      ],
      order: [['date', 'ASC'], ['partyTimeStart', 'ASC']],
      raw: false // Ensure Sequelize includes all fields in response
    });

    // DEBUG: Log what fields are actually present
    if (reservations.length > 0) {
      const sample = reservations[0];
      const sampleJson = sample.toJSON ? sample.toJSON() : sample;
      console.log('🔍 Sample reservation fields (all):', Object.keys(sampleJson));
      console.log('🔍 Sample modificationStatus:', sampleJson.modificationStatus);
      console.log('🔍 Sample proposedPartyTimeStart:', sampleJson.proposedPartyTimeStart);
    }

    console.log('✅ Found reservations:', reservations.length);

    return res.json({
      reservations: reservations,
      total: reservations.length
    });

  } catch (error: any) {
    console.error('❌ Error fetching all reservations:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error original:', error.original);
    return res.status(500).json({ 
      message: 'Internal server error',
      details: error.message || 'Unknown error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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
        userId: userId, // Ensure user can only access their own reservations
        communityId: req.user.currentCommunityId // Ensure reservation belongs to current community
      },
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'janitorialRequired', 'approvalRequired']
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

    // Validate amenity exists and belongs to current community
    const amenity = await Amenity.findOne({
      where: {
        id: amenityId,
        communityId: req.user.currentCommunityId
      }
    });
    if (!amenity) {
      return res.status(404).json({ message: 'Amenity not found or does not belong to your community' });
    }

    // Validate guest count
    if (guestCount > amenity.capacity) {
      return res.status(400).json({ 
        message: `Guest count (${guestCount}) exceeds amenity capacity (${amenity.capacity})` 
      });
    }

    // Check for time conflicts (within same community)
    // Use explicit attributes to avoid loading modification fields that don't exist
    const conflictingReservation = await Reservation.findOne({
      where: {
        amenityId: amenityId,
        communityId: req.user.currentCommunityId,
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
      },
      attributes: [
        'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
        'guestCount', 'status', 'amenityId', 'communityId'
        // Explicitly exclude modification fields
      ]
    });

    if (conflictingReservation) {
      return res.status(409).json({ 
        message: 'Time conflict: Another reservation exists during this time period' 
      });
    }

    // Calculate totals
    const totalFee = amenity.reservationFee;
    const totalDeposit = amenity.deposit;

    // Create reservation using raw SQL to avoid Sequelize trying to access modificationStatus column
    const now = new Date().toISOString();
    const [insertResult] = await sequelize.query(`
      INSERT INTO reservations (
        "userId", "amenityId", "communityId", date,
        "setupTimeStart", "setupTimeEnd", "partyTimeStart", "partyTimeEnd",
        "guestCount", "eventName", "isPrivate", "specialRequirements",
        status, "totalFee", "totalDeposit", "createdAt", "updatedAt"
      ) VALUES (
        :userId, :amenityId, :communityId, :date,
        :setupTimeStart, :setupTimeEnd, :partyTimeStart, :partyTimeEnd,
        :guestCount, :eventName, :isPrivate, :specialRequirements,
        :status, :totalFee, :totalDeposit, :now, :now
      ) RETURNING id
    `, {
      replacements: {
        userId,
        amenityId,
        communityId: amenity.communityId,
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
        totalDeposit,
        now
      },
      type: QueryTypes.INSERT
    }) as any[];

    const reservationId = insertResult[0].id;

    // Fetch the created reservation with amenity details
    // Explicitly exclude modification fields since they may not exist in the database
    const createdReservation = await Reservation.findByPk(reservationId, {
      attributes: [
        'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
        'guestCount', 'specialRequirements', 'status', 'totalFee', 'totalDeposit',
        'eventName', 'isPrivate', 'communityId', 'amenityId', 'userId'
        // Explicitly exclude modification fields to avoid "column does not exist" errors
      ],
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'approvalRequired']
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

  } catch (error: any) {
    console.error('❌ Error creating reservation:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error original:', error.original);
    console.error('❌ Error stack:', error.stack);
    
    const originalError = error.original || error;
    const errorMessage = originalError.message || error.message || 'Unknown error';
    const errorCode = originalError.code || error.code || 'UNKNOWN';
    
    return res.status(500).json({ 
      message: 'Internal server error',
      details: errorMessage,
      errorCode: errorCode,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'janitorialRequired', 'approvalRequired']
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

// Helper function to calculate cancellation fee based on amenity fee structure
function calculateCancellationFee(
  reservationDate: Date, 
  totalFee: number, 
  deposit: number,
  amenity: any
): { fee: number; reason: string; refundAmount: number } {
  // Check if cancellation fees are enabled
  if (!amenity?.cancellationFeeEnabled) {
    return { fee: 0, reason: 'Cancellation fees disabled for this amenity', refundAmount: totalFee + deposit };
  }

  const now = new Date();
  const reservationDateTime = new Date(reservationDate);
  reservationDateTime.setHours(0, 0, 0, 0);
  const nowDate = new Date(now);
  nowDate.setHours(0, 0, 0, 0);
  
  const hoursUntilReservation = (reservationDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  const daysUntilReservation = Math.floor(hoursUntilReservation / 24);

  // Parse fee structure (default if not set)
  let feeStructure: any;
  if (amenity.cancellationFeeStructure) {
    try {
      feeStructure = JSON.parse(amenity.cancellationFeeStructure);
    } catch (e) {
      console.error('Error parsing cancellation fee structure:', e);
      feeStructure = null;
    }
  }

  // Use default structure if not set
  if (!feeStructure) {
    feeStructure = {
      cancelOver14Days: { fee: 0, type: 'refund' },
      cancel7To14Days: { fee: 50, type: 'fixed' },
      cancelUnder7Days: { fee: 0, type: 'full_fee' },
      noShow: { fee: 0, type: 'full_fee' }
    };
  }

  let fee = 0;
  let reason = '';
  let refundAmount = 0;

  if (daysUntilReservation > 14) {
    // Cancel >14 days: Full refund
    const rule = feeStructure.cancelOver14Days || { fee: 0, type: 'refund' };
    fee = 0;
    refundAmount = totalFee + deposit;
    reason = 'Cancel >14 days - Full refund';
  } else if (daysUntilReservation >= 7 && daysUntilReservation <= 14) {
    // Cancel 7–14 days: $50 admin fee
    const rule = feeStructure.cancel7To14Days || { fee: 50, type: 'fixed' };
    fee = rule.fee || 50;
    refundAmount = (totalFee + deposit) - fee;
    reason = `Cancel 7–14 days - $${fee.toFixed(2)} admin fee`;
  } else {
    // Cancel <7 days: Full rental fee / deposit forfeited
    const rule = feeStructure.cancelUnder7Days || { fee: 0, type: 'full_fee' };
    if (rule.type === 'full_fee') {
      fee = totalFee + deposit;
      refundAmount = 0;
      reason = 'Cancel <7 days - Full rental fee / deposit forfeited';
    } else {
      fee = rule.fee || (totalFee + deposit);
      refundAmount = (totalFee + deposit) - fee;
      reason = `Cancel <7 days - $${fee.toFixed(2)} fee`;
    }
  }

  return { fee, reason, refundAmount };
}

// Helper function to calculate modification fee based on amenity fee structure
function calculateModificationFee(
  reservationDate: Date, 
  totalFee: number,
  amenity: any,
  isFirstChange: boolean = true
): { fee: number; reason: string } {
  // Check if modification fees are enabled
  if (!amenity?.modificationFeeEnabled) {
    return { fee: 0, reason: 'Modification fees disabled for this amenity' };
  }

  const now = new Date();
  const reservationDateTime = new Date(reservationDate);
  reservationDateTime.setHours(0, 0, 0, 0);
  
  const hoursUntilReservation = (reservationDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  const daysUntilReservation = Math.floor(hoursUntilReservation / 24);

  // Parse fee structure (default if not set)
  let feeStructure: any;
  if (amenity.modificationFeeStructure) {
    try {
      feeStructure = JSON.parse(amenity.modificationFeeStructure);
    } catch (e) {
      console.error('Error parsing modification fee structure:', e);
      feeStructure = null;
    }
  }

  // Use default structure if not set
  if (!feeStructure) {
    feeStructure = {
      firstChangeOver7Days: { fee: 0, type: 'free' },
      additionalChange: { fee: 25, type: 'fixed' }
    };
  }

  let fee = 0;
  let reason = '';

  if (daysUntilReservation > 7) {
    // One date/time change >7 days: No charge (first change only)
    if (isFirstChange) {
      const rule = feeStructure.firstChangeOver7Days || { fee: 0, type: 'free' };
      fee = 0;
      reason = 'One date/time change >7 days - No charge';
    } else {
      // Additional change: $25 each
      const rule = feeStructure.additionalChange || { fee: 25, type: 'fixed' };
      fee = rule.fee || 25;
      reason = `Additional change - $${fee.toFixed(2)} each`;
    }
  } else {
    // Changes within 7 days - use additional change fee
    const rule = feeStructure.additionalChange || { fee: 25, type: 'fixed' };
    fee = rule.fee || 25;
    reason = `Change within 7 days - $${fee.toFixed(2)} fee`;
  }

  return { fee, reason };
}

// PUT /api/reservations/:id/modify - Modify reservation with fee calculation
router.put('/:id/modify', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    console.log('📝 Modifying reservation:', id, 'for user:', userId);

    // Find reservation
    const reservation = await Reservation.findOne({
      where: { 
        id: id,
        userId: userId // Ensure user can only modify their own reservations
      },
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'reservationFee', 'deposit', 'modificationFeeEnabled', 'modificationFeeStructure']
        }
      ]
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Don't allow modification of completed/cancelled reservations
    if (reservation.status === 'COMPLETED' || reservation.status === 'CANCELLED') {
      return res.status(400).json({ 
        message: 'Cannot modify completed or cancelled reservations' 
      });
    }

    // Calculate modification fee using amenity fee structure
    // TODO: Track modification count to determine if this is first change or additional
    // For now, assume it's the first change
    const modificationFee = calculateModificationFee(
      new Date(reservation.date),
      parseFloat(String(reservation.totalFee)),
      reservation.amenity,
      true // isFirstChange - TODO: implement modification count tracking
    );

    // Update reservation
    await reservation.update(updateData);

    // Fetch updated reservation with details
    const updatedReservation = await Reservation.findByPk(id, {
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'janitorialRequired', 'approvalRequired']
        }
      ]
    });

    console.log('✅ Reservation modified:', id);

    return res.json({
      message: 'Reservation modified successfully',
      reservation: updatedReservation,
      modificationFee: modificationFee.fee,
      modificationFeeReason: modificationFee.reason
    });

  } catch (error) {
    console.error('❌ Error modifying reservation:', error);
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
      },
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'reservationFee', 'deposit', 'cancellationFeeEnabled', 'cancellationFeeStructure']
        }
      ]
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

    // Calculate cancellation fee using amenity fee structure
    const cancellationFee = calculateCancellationFee(
      new Date(reservation.date),
      parseFloat(String(reservation.totalFee)),
      parseFloat(String(reservation.totalDeposit)),
      reservation.amenity
    );

    // Update status to cancelled
    await reservation.update({ status: 'CANCELLED' });

    console.log('✅ Reservation cancelled:', id);

    return res.json({
      message: 'Reservation cancelled successfully',
      cancellationFee: cancellationFee.fee,
      cancellationFeeReason: cancellationFee.reason,
      refundAmount: cancellationFee.refundAmount
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
    const communityRole = req.user.communityRole;

    console.log('✅ Janitorial approval for reservation:', id, 'by user:', userId);

    // Check if user is janitorial or admin in current community
    if (communityRole !== 'janitorial' && communityRole !== 'admin') {
      return res.status(403).json({ message: 'Janitorial access required' });
    }

    // Validate cleaning time parameters (required for janitorial approval)
    if (communityRole === 'janitorial' && (!cleaningTimeStart || !cleaningTimeEnd)) {
      return res.status(400).json({ 
        message: 'Cleaning time start and end are required for janitorial approval' 
      });
    }

    // Find reservation (must belong to current community) - use explicit attributes to avoid modification fields
    const reservation = await Reservation.findOne({
      where: {
        id,
        communityId: req.user.currentCommunityId
      },
      attributes: [
        'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
        'guestCount', 'specialRequirements', 'status', 'totalFee', 'totalDeposit',
        'eventName', 'isPrivate', 'communityId', 'amenityId', 'userId',
        'cleaningTimeStart', 'cleaningTimeEnd'
        // Explicitly exclude modification fields
      ],
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'approvalRequired']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        }
      ]
    }) as ReservationWithAssociations;

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found or does not belong to your community' });
    }

    // Validate cleaning time is after reservation end time
    if (cleaningTimeStart && cleaningTimeEnd) {
      const partyEndTime = new Date(reservation.partyTimeEnd);
      const cleaningStartTime = new Date(cleaningTimeStart);
      
      // Ensure we're comparing times correctly - add a small buffer (1 minute) to account for timezone/parsing differences
      const oneMinute = 60 * 1000;
      if (cleaningStartTime.getTime() <= (partyEndTime.getTime() + oneMinute)) {
        return res.status(400).json({ 
          message: `Cleaning time must start after the reservation ends. Reservation ends at ${partyEndTime.toLocaleString()}, cleaning starts at ${cleaningStartTime.toLocaleString()}` 
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

    // Determine new status based on current status and amenity approval requirements
    let newStatus: 'JANITORIAL_APPROVED' | 'FULLY_APPROVED';
    if (reservation.status === 'NEW') {
      // If admin approval is not required, skip directly to FULLY_APPROVED
      if (!reservation.amenity?.approvalRequired) {
        newStatus = 'FULLY_APPROVED';
      } else {
        newStatus = 'JANITORIAL_APPROVED';
      }
    } else if (reservation.status === 'JANITORIAL_APPROVED' && communityRole === 'admin') {
      newStatus = 'FULLY_APPROVED';
    } else {
      return res.status(400).json({ 
        message: `Cannot approve reservation with status: ${reservation.status}` 
      });
    }

    // Update reservation using raw SQL to avoid accessing modification fields
    const now = new Date().toISOString();
    if (cleaningTimeStart && cleaningTimeEnd) {
      await sequelize.query(`
        UPDATE reservations
        SET status = :newStatus,
            "cleaningTimeStart" = :cleaningTimeStart,
            "cleaningTimeEnd" = :cleaningTimeEnd,
            "updatedAt" = :now
        WHERE id = :reservationId
      `, {
        replacements: {
          newStatus,
          cleaningTimeStart: new Date(cleaningTimeStart).toISOString(),
          cleaningTimeEnd: new Date(cleaningTimeEnd).toISOString(),
          now,
          reservationId: id
        },
        type: QueryTypes.UPDATE
      });
    } else {
      await sequelize.query(`
        UPDATE reservations
        SET status = :newStatus,
            "updatedAt" = :now
        WHERE id = :reservationId
      `, {
        replacements: {
          newStatus,
          now,
          reservationId: id
        },
        type: QueryTypes.UPDATE
      });
    }

    // Fetch updated reservation to return
    const updatedReservation = await Reservation.findByPk(id, {
      attributes: [
        'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
        'guestCount', 'specialRequirements', 'status', 'totalFee', 'totalDeposit',
        'eventName', 'isPrivate', 'communityId', 'amenityId', 'userId',
        'cleaningTimeStart', 'cleaningTimeEnd'
      ],
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'approvalRequired']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        }
      ]
    });

    console.log('✅ Reservation approved:', id, 'new status:', newStatus);

    return res.json({
      message: 'Reservation approved successfully',
      reservation: updatedReservation?.toJSON() || { id: parseInt(id), status: newStatus }
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
    const communityRole = req.user.communityRole;
    const { reason } = req.body;

    console.log('❌ Janitorial rejection for reservation:', id, 'by user:', userId);

    // Check if user is janitorial or admin in current community
    if (communityRole !== 'janitorial' && communityRole !== 'admin') {
      return res.status(403).json({ message: 'Janitorial access required' });
    }

    // Find reservation (must belong to current community) - use explicit attributes to avoid modification fields
    const reservation = await Reservation.findOne({
      where: {
        id,
        communityId: req.user.currentCommunityId
      },
      attributes: [
        'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
        'guestCount', 'specialRequirements', 'status', 'totalFee', 'totalDeposit',
        'eventName', 'isPrivate', 'communityId', 'amenityId', 'userId'
        // Explicitly exclude modification fields
      ],
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'approvalRequired']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        }
      ]
    }) as ReservationWithAssociations;

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found or does not belong to your community' });
    }

    // Only allow rejection of NEW or JANITORIAL_APPROVED reservations
    if (reservation.status !== 'NEW' && reservation.status !== 'JANITORIAL_APPROVED') {
      return res.status(400).json({ 
        message: `Cannot reject reservation with status: ${reservation.status}` 
      });
    }

    // Update reservation using raw SQL to avoid accessing modification fields
    const now = new Date().toISOString();
    const updatedSpecialRequirements = reason 
      ? `${reservation.specialRequirements || ''}\n\nRejection reason: ${reason}`.trim() 
      : reservation.specialRequirements;

    await sequelize.query(`
      UPDATE reservations
      SET status = 'CANCELLED',
          "specialRequirements" = :specialRequirements,
          "updatedAt" = :now
      WHERE id = :reservationId
    `, {
      replacements: {
        specialRequirements: updatedSpecialRequirements,
        now,
        reservationId: id
      },
      type: QueryTypes.UPDATE
    });

    // Fetch updated reservation to return
    const updatedReservation = await Reservation.findByPk(id, {
      attributes: [
        'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
        'guestCount', 'specialRequirements', 'status', 'totalFee', 'totalDeposit',
        'eventName', 'isPrivate', 'communityId', 'amenityId', 'userId'
      ],
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'approvalRequired']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        }
      ]
    });

    console.log('✅ Reservation rejected:', id);

    return res.json({
      message: 'Reservation rejected successfully',
      reservation: updatedReservation?.toJSON() || { id: parseInt(id), status: 'CANCELLED' }
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
    const communityRole = req.user.communityRole;

    // Check if user is janitorial or admin in current community
    if (communityRole !== 'janitorial' && communityRole !== 'admin') {
      return res.status(403).json({ message: 'Janitorial access required' });
    }

    // Find reservation (must belong to current community) - use explicit attributes to avoid modification fields
    const reservation = await Reservation.findOne({
      where: {
        id,
        communityId: req.user.currentCommunityId
      },
      attributes: [
        'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
        'guestCount', 'specialRequirements', 'status', 'totalFee', 'totalDeposit',
        'eventName', 'isPrivate', 'communityId', 'amenityId', 'userId',
        'damageAssessed', 'damageAssessmentPending', 'damageAssessmentStatus'
        // Explicitly exclude modification fields
      ],
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'approvalRequired']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        }
      ]
    }) as ReservationWithAssociations;

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found or does not belong to your community' });
    }

    // Check if reservation is in a completable state
    if (reservation.status !== 'FULLY_APPROVED' && reservation.status !== 'JANITORIAL_APPROVED') {
      return res.status(400).json({ 
        message: `Cannot complete reservation with status: ${reservation.status}` 
      });
    }

    // Update reservation using raw SQL to avoid accessing modification fields
    const now = new Date().toISOString();
    if (damagesFound === false || damagesFound === 'false') {
      // No damages found
      await sequelize.query(`
        UPDATE reservations
        SET status = 'COMPLETED',
            "damageAssessed" = false,
            "damageAssessmentPending" = false,
            "damageAssessmentStatus" = NULL,
            "updatedAt" = :now
        WHERE id = :reservationId
      `, {
        replacements: {
          reservationId: id,
          now
        },
        type: QueryTypes.UPDATE
      });
    } else {
      // Damages found - set pending flag for assessment
      await sequelize.query(`
        UPDATE reservations
        SET status = 'COMPLETED',
            "damageAssessed" = false,
            "damageAssessmentPending" = true,
            "updatedAt" = :now
        WHERE id = :reservationId
      `, {
        replacements: {
          reservationId: id,
          now
        },
        type: QueryTypes.UPDATE
      });
    }

    // Fetch updated reservation to return
    const updatedReservation = await Reservation.findByPk(id, {
      attributes: [
        'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
        'guestCount', 'specialRequirements', 'status', 'totalFee', 'totalDeposit',
        'eventName', 'isPrivate', 'communityId', 'amenityId', 'userId',
        'damageAssessed', 'damageAssessmentPending', 'damageAssessmentStatus'
      ],
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'approvalRequired']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        }
      ]
    });

    console.log('✅ Party marked as complete:', id, 'damagesFound:', damagesFound);

    return res.json({
      message: 'Party marked as complete',
      reservation: updatedReservation?.toJSON() || { id: parseInt(id) },
      requiresDamageAssessment: damagesFound === true || damagesFound === 'true'
    });

  } catch (error: any) {
    console.error('❌ Error marking party complete:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    return res.status(500).json({ 
      message: 'Internal server error',
      details: error.message || 'Unknown error'
    });
  }
});

// Assess damages (janitorial)
router.post('/:id/assess-damages', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { amount, description, notes } = req.body;
    const userId = req.user.id;
    const communityRole = req.user.communityRole;

    // Check if user is janitorial or admin in current community
    if (communityRole !== 'janitorial' && communityRole !== 'admin') {
      return res.status(403).json({ message: 'Janitorial access required' });
    }

    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Damage amount must be greater than 0' });
    }
    if (!description || description.trim() === '') {
      return res.status(400).json({ message: 'Damage description is required' });
    }

    // Find reservation (must belong to current community) - use explicit attributes to avoid modification fields
    const reservation = await Reservation.findOne({
      where: {
        id,
        communityId: req.user.currentCommunityId
      },
      attributes: [
        'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
        'guestCount', 'specialRequirements', 'status', 'totalFee', 'totalDeposit',
        'eventName', 'isPrivate', 'communityId', 'amenityId', 'userId',
        'damageAssessed', 'damageAssessmentPending', 'damageAssessmentStatus',
        'damageChargeAmount', 'damageDescription', 'damageNotes'
        // Explicitly exclude modification fields
      ],
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'approvalRequired']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        }
      ]
    }) as ReservationWithAssociations;

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found or does not belong to your community' });
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

    // Update reservation using raw SQL to avoid accessing modification fields
    const now = new Date().toISOString();
    const damageAssessedAt = new Date().toISOString();
    
    await sequelize.query(`
      UPDATE reservations
      SET "damageAssessed" = true,
          "damageAssessmentPending" = true,
          "damageAssessmentStatus" = 'PENDING',
          "damageChargeAmount" = :damageAmount,
          "damageDescription" = :damageDescription,
          "damageNotes" = :damageNotes,
          "damageAssessedBy" = :damageAssessedBy,
          "damageAssessedAt" = :damageAssessedAt,
          "updatedAt" = :now
      WHERE id = :reservationId
    `, {
      replacements: {
        damageAmount,
        damageDescription: description.trim(),
        damageNotes: notes ? notes.trim() : null,
        damageAssessedBy: userId,
        damageAssessedAt,
        now,
        reservationId: id
      },
      type: QueryTypes.UPDATE
    });

    // Fetch updated reservation to return
    const updatedReservation = await Reservation.findByPk(id, {
      attributes: [
        'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
        'guestCount', 'specialRequirements', 'status', 'totalFee', 'totalDeposit',
        'eventName', 'isPrivate', 'communityId', 'amenityId', 'userId',
        'damageAssessed', 'damageAssessmentPending', 'damageAssessmentStatus',
        'damageChargeAmount', 'damageDescription', 'damageNotes',
        'damageAssessedBy', 'damageAssessedAt'
      ],
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'approvalRequired']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        }
      ]
    });

    console.log('✅ Damage assessment submitted:', id, 'amount:', damageAmount);

    return res.json({
      message: 'Damage assessment submitted for admin review',
      reservation: updatedReservation?.toJSON() || { id: parseInt(id) }
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
    const communityRole = req.user.communityRole;

    // Check if user is admin in current community
    if (communityRole !== 'admin') {
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

    // Find reservation (must belong to current community) - use explicit attributes to avoid modification fields
    const reservation = await Reservation.findOne({
      where: {
        id,
        communityId: req.user.currentCommunityId
      },
      attributes: [
        'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
        'guestCount', 'specialRequirements', 'status', 'totalFee', 'totalDeposit',
        'eventName', 'isPrivate', 'communityId', 'amenityId', 'userId',
        'damageAssessed', 'damageAssessmentPending', 'damageAssessmentStatus',
        'damageCharge', 'damageChargeAmount', 'damageChargeAdjusted',
        'damageDescription', 'damageNotes', 'adminDamageNotes',
        'damageAssessedBy', 'damageReviewedBy', 'damageAssessedAt', 'damageReviewedAt'
        // Explicitly exclude modification fields
      ],
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'approvalRequired']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        }
      ]
    }) as ReservationWithAssociations;

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found or does not belong to your community' });
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
    const now = new Date().toISOString();
    const damageReviewedAt = new Date().toISOString();
    
    let updateQuery = '';
    let replacements: any = {
      damageReviewedBy: userId,
      damageReviewedAt,
      now,
      reservationId: id
    };

    if (action === 'approve') {
      newStatus = 'APPROVED';
      finalCharge = parseFloat(String(reservation.damageChargeAmount || 0));
      updateQuery = `
        UPDATE reservations
        SET "damageAssessmentStatus" = 'APPROVED',
            "damageCharge" = :finalCharge,
            "damageReviewedBy" = :damageReviewedBy,
            "damageReviewedAt" = :damageReviewedAt,
            "damageAssessmentPending" = false,
            "updatedAt" = :now
        WHERE id = :reservationId
      `;
      replacements.finalCharge = finalCharge;
      
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
      updateQuery = `
        UPDATE reservations
        SET "damageAssessmentStatus" = 'ADJUSTED',
            "damageCharge" = :finalCharge,
            "damageChargeAdjusted" = :adjustedAmount,
            "adminDamageNotes" = :adminNotes,
            "damageReviewedBy" = :damageReviewedBy,
            "damageReviewedAt" = :damageReviewedAt,
            "damageAssessmentPending" = false,
            "updatedAt" = :now
        WHERE id = :reservationId
      `;
      replacements.finalCharge = finalCharge;
      replacements.adjustedAmount = adjustedAmount;
      replacements.adminNotes = adminNotes ? adminNotes.trim() : null;
      
    } else if (action === 'deny') {
      newStatus = 'DENIED';
      finalCharge = 0;
      updateQuery = `
        UPDATE reservations
        SET "damageAssessmentStatus" = 'DENIED',
            "damageCharge" = NULL,
            "adminDamageNotes" = :adminNotes,
            "damageReviewedBy" = :damageReviewedBy,
            "damageReviewedAt" = :damageReviewedAt,
            "damageAssessmentPending" = false,
            "updatedAt" = :now
        WHERE id = :reservationId
      `;
      replacements.adminNotes = adminNotes ? adminNotes.trim() : null;
    }

    // Update using raw SQL to avoid accessing modification fields
    await sequelize.query(updateQuery, {
      replacements,
      type: QueryTypes.UPDATE
    });

    // Fetch updated reservation to return
    const updatedReservation = await Reservation.findByPk(id, {
      attributes: [
        'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
        'guestCount', 'specialRequirements', 'status', 'totalFee', 'totalDeposit',
        'eventName', 'isPrivate', 'communityId', 'amenityId', 'userId',
        'damageAssessed', 'damageAssessmentPending', 'damageAssessmentStatus',
        'damageCharge', 'damageChargeAmount', 'damageChargeAdjusted',
        'damageDescription', 'damageNotes', 'adminDamageNotes',
        'damageAssessedBy', 'damageReviewedBy', 'damageAssessedAt', 'damageReviewedAt'
      ],
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'approvalRequired']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        }
      ]
    });

    console.log('✅ Damage assessment reviewed:', id, 'action:', action, 'charge:', finalCharge);

    // TODO: Integrate with Square here to charge the damage fee if approved/adjusted
    // For now, we just update the database

    return res.json({
      message: `Damage assessment ${action}d successfully`,
      reservation: updatedReservation?.toJSON() || { id: parseInt(id) },
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
    const communityRole = req.user.communityRole;
    const communityId = req.user.currentCommunityId;

    // Check if user is admin in current community
    if (communityRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Find all reservations with pending damage assessments for current community
    // Use explicit attributes to avoid modification fields
    const reservations = await Reservation.findAll({
      where: {
        communityId,
        damageAssessmentPending: true,
        damageAssessmentStatus: 'PENDING'
      },
      attributes: [
        'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
        'guestCount', 'specialRequirements', 'status', 'totalFee', 'totalDeposit',
        'eventName', 'isPrivate', 'communityId', 'amenityId', 'userId',
        'damageAssessed', 'damageAssessmentPending', 'damageAssessmentStatus',
        'damageCharge', 'damageChargeAmount', 'damageChargeAdjusted',
        'damageDescription', 'damageNotes', 'adminDamageNotes',
        'damageAssessedBy', 'damageReviewedBy', 'damageAssessedAt', 'damageReviewedAt'
        // Explicitly exclude modification fields
      ],
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity', 'approvalRequired']
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

// GET /api/reservations/diagnostic/columns - Diagnostic endpoint to check if modification columns exist
router.get('/diagnostic/columns', authenticateToken, async (req: any, res) => {
  try {
    // Check if user is admin or janitorial
    if (req.user.communityRole !== 'admin' && req.user.communityRole !== 'janitorial') {
      return res.status(403).json({ message: 'Admin or janitorial access required' });
    }

    const columnCheck = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      AND table_name = 'reservations' 
      AND LOWER(column_name) IN ('modificationstatus', 'proposeddate', 'proposedpartytimestart', 'proposedpartytimeend', 'modificationreason', 'modificationproposedby', 'modificationproposedat')
      ORDER BY column_name
    `) as any[];

    const columns = columnCheck[0] || [];
    
    return res.json({
      columnsFound: columns.length,
      columns: columns.map((row: any) => ({
        name: row.column_name,
        type: row.data_type,
        nullable: row.is_nullable === 'YES',
        default: row.column_default
      })),
      expectedColumns: [
        'modificationStatus',
        'proposedDate',
        'proposedPartyTimeStart',
        'proposedPartyTimeEnd',
        'modificationReason',
        'modificationProposedBy',
        'modificationProposedAt'
      ],
      allColumnsExist: columns.length === 7
    });
  } catch (error: any) {
    console.error('❌ Error checking columns:', error);
    return res.status(500).json({ 
      message: 'Error checking columns',
      details: error.message 
    });
  }
});

// POST /api/reservations/:id/propose-modification - Propose modification to reservation
router.post('/:id/propose-modification', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const communityRole = req.user.communityRole;
    const { proposedDate, proposedPartyTimeStart, proposedPartyTimeEnd, modificationReason } = req.body;

    console.log('📝 Proposing modification for reservation:', id, 'by user:', userId);

    // Check if user is janitorial or admin in current community
    if (communityRole !== 'janitorial' && communityRole !== 'admin') {
      return res.status(403).json({ message: 'Janitorial or admin access required' });
    }

    // Validate required fields
    if (!proposedPartyTimeStart || !proposedPartyTimeEnd || !modificationReason) {
      return res.status(400).json({ 
        message: 'Missing required fields: proposedPartyTimeStart, proposedPartyTimeEnd, modificationReason' 
      });
    }

    // Build attributes list - we'll try to update modification fields and catch errors if columns don't exist
    const attributes = [
      'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
      'guestCount', 'specialRequirements', 'status', 'totalFee', 'totalDeposit',
      'damageAssessed', 'damageAssessmentPending', 'damageAssessmentStatus', 'damageCharge', 'damageChargeAmount',
      'eventName', 'isPrivate', 'communityId', 'amenityId', 'userId'
    ];

    // Add modification fields if they exist
    try {
      const modificationColumns = await sequelize.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'reservations' 
        AND column_name IN ('modificationStatus', 'proposedDate', 'proposedPartyTimeStart', 'proposedPartyTimeEnd', 'modificationReason', 'modificationProposedBy', 'modificationProposedAt')
      `) as any[];
      
      if (modificationColumns && modificationColumns[0] && Array.isArray(modificationColumns[0])) {
        const existingModColumns = modificationColumns[0].map((row: any) => row.column_name);
        existingModColumns.forEach((col: string) => attributes.push(col));
      }
    } catch (error) {
      // If check fails, continue without modification fields
      console.log('⚠️ Could not check for modification columns, continuing without them');
    }

    // Find reservation (must belong to current community and be unconfirmed)
    const reservation = await Reservation.findOne({
      where: {
        id,
        communityId: req.user.currentCommunityId,
        status: 'NEW' // Only allow modifications for NEW (unconfirmed) reservations
      },
      attributes: attributes,
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
      return res.status(404).json({ 
        message: 'Reservation not found, does not belong to your community, or is not in NEW status' 
      });
    }

    // PRE-FLIGHT CHECK: Verify modification columns exist in database
    // This prevents cryptic errors and gives clear feedback
    // Use LOWER() for case-insensitive comparison since PostgreSQL stores unquoted identifiers in lowercase
    try {
      const columnCheck = await sequelize.query(`
        SELECT LOWER(column_name) as column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'reservations' 
        AND LOWER(column_name) IN ('modificationstatus', 'proposeddate', 'proposedpartytimestart', 'proposedpartytimeend', 'modificationreason', 'modificationproposedby', 'modificationproposedat')
      `) as any[];
      
      const existingColumns = columnCheck[0] || [];
      const columnNames = existingColumns.map((row: any) => row.column_name.toLowerCase());
      const requiredColumns = [
        'modificationstatus',
        'proposeddate',
        'proposedpartytimestart',
        'proposedpartytimeend',
        'modificationreason',
        'modificationproposedby',
        'modificationproposedat'
      ];
      
      const missingColumns = requiredColumns.filter(col => !columnNames.includes(col.toLowerCase()));
      
      if (missingColumns.length > 0) {
        console.error('❌ Missing modification columns:', missingColumns);
        console.error('❌ Existing columns:', columnNames);
        // Map back to camelCase for display
        const displayMissing = missingColumns.map(col => {
          const mapping: { [key: string]: string } = {
            'modificationstatus': 'modificationStatus',
            'proposeddate': 'proposedDate',
            'proposedpartytimestart': 'proposedPartyTimeStart',
            'proposedpartytimeend': 'proposedPartyTimeEnd',
            'modificationreason': 'modificationReason',
            'modificationproposedby': 'modificationProposedBy',
            'modificationproposedat': 'modificationProposedAt'
          };
          return mapping[col] || col;
        });
        const displayFound = columnNames.map((col: string) => {
          const mapping: { [key: string]: string } = {
            'modificationstatus': 'modificationStatus',
            'proposeddate': 'proposedDate',
            'proposedpartytimestart': 'proposedPartyTimeStart',
            'proposedpartytimeend': 'proposedPartyTimeEnd',
            'modificationreason': 'modificationReason',
            'modificationproposedby': 'modificationProposedBy',
            'modificationproposedat': 'modificationProposedAt'
          };
          return mapping[col] || col;
        });
        const displayRequired = requiredColumns.map(col => {
          const mapping: { [key: string]: string } = {
            'modificationstatus': 'modificationStatus',
            'proposeddate': 'proposedDate',
            'proposedpartytimestart': 'proposedPartyTimeStart',
            'proposedpartytimeend': 'proposedPartyTimeEnd',
            'modificationreason': 'modificationReason',
            'modificationproposedby': 'modificationProposedBy',
            'modificationproposedat': 'modificationProposedAt'
          };
          return mapping[col] || col;
        });
        return res.status(500).json({
          message: 'Modification feature is not available. Please run the database migration first.',
          details: `Missing columns: ${displayMissing.join(', ')}. Found ${columnNames.length} of ${requiredColumns.length} required columns.`,
          missingColumns: displayMissing,
          foundColumns: displayFound,
          requiredColumns: displayRequired
        });
      }
      
      console.log('✅ All modification columns verified:', columnNames);
    } catch (checkError: any) {
      console.error('❌ Error checking for modification columns:', checkError);
      return res.status(500).json({
        message: 'Error verifying database schema',
        details: `Could not verify if modification columns exist: ${checkError.message || 'Unknown error'}`,
        error: checkError.message
      });
    }

    // Check if there's already a pending modification
    // Use raw SQL to safely check this since the column might not be in the model attributes
    try {
      const pendingCheck = await sequelize.query(`
        SELECT modificationstatus 
        FROM reservations 
        WHERE id = :reservationId
      `, {
        replacements: { reservationId: id },
        type: QueryTypes.SELECT
      }) as any[];
      
      if (pendingCheck && pendingCheck.length > 0 && pendingCheck[0]?.modificationstatus === 'PENDING') {
        return res.status(400).json({ 
          message: 'A modification proposal is already pending for this reservation' 
        });
      }
    } catch (checkError: any) {
      // If we can't check, continue - the update will fail if there's an issue
      console.log('⚠️ Could not check for pending modification, continuing');
    }

    // Try to update reservation with proposed modification
    // Use raw SQL with quoted identifiers to handle case sensitivity correctly
    // PostgreSQL stores unquoted identifiers in lowercase, but we need to match the exact case
    try {
      // Use raw SQL with lowercase column names
      // PostgreSQL stores unquoted identifiers in lowercase, so we need to match that
      await sequelize.query(`
        UPDATE reservations
        SET modificationstatus = :modificationStatus,
            proposeddate = :proposedDate,
            proposedpartytimestart = :proposedPartyTimeStart,
            proposedpartytimeend = :proposedPartyTimeEnd,
            modificationreason = :modificationReason,
            modificationproposedby = :modificationProposedBy,
            modificationproposedat = :modificationProposedAt
        WHERE id = :reservationId
      `, {
        replacements: {
          modificationStatus: 'PENDING',
          proposedDate: proposedDate || reservation.date,
          proposedPartyTimeStart: new Date(proposedPartyTimeStart).toISOString(),
          proposedPartyTimeEnd: new Date(proposedPartyTimeEnd).toISOString(),
          modificationReason: modificationReason,
          modificationProposedBy: userId,
          modificationProposedAt: new Date().toISOString(),
          reservationId: id
        },
        type: QueryTypes.UPDATE
      });
      
      // Don't reload - the reservation object doesn't have modification fields in its attributes
      // The update was successful, we can return the reservation as-is
    } catch (updateError: any) {
      // Log the full error for debugging
      console.error('❌ Error updating reservation with modification:', updateError);
      console.error('❌ Error message:', updateError.message);
      console.error('❌ Error name:', updateError.name);
      console.error('❌ Error original:', updateError.original);
      console.error('❌ Error stack:', updateError.stack);
      
      // Check if error is due to missing columns (PostgreSQL error format)
      // Sequelize wraps database errors in error.original
      const updateOriginalError = updateError.original || updateError;
      const updateErrorMessage = String(updateOriginalError.message || updateError.message || '');
      const updateErrorCode = updateOriginalError.code || '';
      
      // PostgreSQL error code 42703 = undefined_column
      // PostgreSQL error message typically includes "column ... does not exist"
      const isColumnMissingError = 
        updateErrorCode === '42703' ||
        updateErrorMessage.toLowerCase().includes('column') && updateErrorMessage.toLowerCase().includes('does not exist') ||
        updateErrorMessage.toLowerCase().includes('column') && updateErrorMessage.toLowerCase().includes('doesn\'t exist');
      
      if (isColumnMissingError) {
        console.error('❌ Modification columns not found in database');
        console.error('❌ PostgreSQL error code:', updateErrorCode);
        console.error('❌ Full error message:', updateErrorMessage);
        return res.status(500).json({ 
          message: 'Modification feature is not available. Please run the database migration first.',
          details: `Database error: ${updateErrorMessage.substring(0, 200)}`,
          errorCode: updateErrorCode
        });
      }
      
      // If it's not a column missing error, return the actual error
      console.error('❌ Unexpected error during update - not a column missing error');
      return res.status(500).json({ 
        message: 'Error proposing modification',
        details: updateErrorMessage.substring(0, 500),
        errorCode: updateErrorCode || updateError.code || 'UNKNOWN'
      });
    }

    console.log('✅ Modification proposed successfully');

    return res.json({
      message: 'Modification proposal created successfully',
      reservation: reservation.toJSON()
    });

  } catch (error: any) {
    console.error('❌ Error proposing modification:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error original:', error.original);
    console.error('❌ Error stack:', error.stack);
    
    const catchOriginalError = error.original || error;
    const catchErrorMessage = String(catchOriginalError.message || error.message || 'Internal server error');
    
    return res.status(500).json({ 
      message: catchErrorMessage.substring(0, 200),
      details: catchErrorMessage.substring(0, 500),
      errorCode: catchOriginalError.code || error.code || 'UNKNOWN'
    });
  }
});

// PUT /api/reservations/:id/accept-modification - Accept proposed modification
router.put('/:id/accept-modification', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log('✅ Accepting modification for reservation:', id, 'by user:', userId);

    // Find reservation (must belong to user and have pending modification)
    // Use raw SQL to query by modificationStatus since Sequelize might not map it correctly
    const reservationResult = await sequelize.query(`
      SELECT * FROM reservations
      WHERE id = :reservationId
        AND "userId" = :userId
        AND LOWER(modificationstatus) = 'pending'
    `, {
      replacements: {
        reservationId: id,
        userId: userId
      },
      type: QueryTypes.SELECT
    }) as any[];

    if (!reservationResult || reservationResult.length === 0) {
      return res.status(404).json({ 
        message: 'Reservation not found, does not belong to you, or has no pending modification' 
      });
    }

    // Get the reservation using Sequelize with modification fields included
    const reservation = await Reservation.findOne({
      where: {
        id,
        userId
      },
      attributes: [
        'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
        'guestCount', 'specialRequirements', 'status', 'totalFee', 'totalDeposit',
        'eventName', 'isPrivate', 'communityId', 'amenityId', 'userId',
        [col('modificationstatus'), 'modificationStatus'],
        [col('proposeddate'), 'proposedDate'],
        [col('proposedpartytimestart'), 'proposedPartyTimeStart'],
        [col('proposedpartytimeend'), 'proposedPartyTimeEnd'],
        [col('modificationreason'), 'modificationReason']
      ],
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity']
        }
      ]
    }) as ReservationWithAssociations;

    if (!reservation) {
      return res.status(404).json({ 
        message: 'Reservation not found, does not belong to you, or has no pending modification' 
      });
    }

    // Check for conflicts with new proposed time
    // Get proposed times - they might be accessed via getDataValue if using col() mapping
    const proposedPartyTimeStart = (reservation as any).getDataValue 
      ? (reservation as any).getDataValue('proposedPartyTimeStart') 
      : reservation.proposedPartyTimeStart;
    const proposedPartyTimeEnd = (reservation as any).getDataValue 
      ? (reservation as any).getDataValue('proposedPartyTimeEnd') 
      : reservation.proposedPartyTimeEnd;
    
    if (!proposedPartyTimeStart || !proposedPartyTimeEnd) {
      console.error('❌ Proposed times missing:', {
        proposedPartyTimeStart,
        proposedPartyTimeEnd,
        reservationKeys: Object.keys(reservation.toJSON ? reservation.toJSON() : reservation)
      });
      return res.status(400).json({ 
        message: 'Proposed times are missing',
        details: 'The reservation does not have proposed party times set'
      });
    }

    // Store in variables with type assertions after null check
    const proposedStart: Date = new Date(proposedPartyTimeStart);
    const proposedEnd: Date = new Date(proposedPartyTimeEnd);
    // proposedDate should be a Date object or string - format it properly for PostgreSQL
    const proposedDate = reservation.proposedDate 
      ? (reservation.proposedDate instanceof Date ? reservation.proposedDate.toISOString().split('T')[0] : String(reservation.proposedDate))
      : (reservation.date instanceof Date ? reservation.date.toISOString().split('T')[0] : String(reservation.date));

    // Check for conflicts using raw SQL to avoid column name issues
    // Use quoted camelCase column names (Sequelize creates columns with quotes, preserving camelCase)
    const conflictingReservationResult = await sequelize.query(`
      SELECT id FROM reservations
      WHERE "amenityId" = :amenityId
        AND "communityId" = :communityId
        AND date = :proposedDate
        AND status IN ('NEW', 'JANITORIAL_APPROVED', 'FULLY_APPROVED')
        AND id != :reservationId
        AND "partyTimeStart" < :proposedEnd 
        AND "partyTimeEnd" > :proposedStart
      LIMIT 1
    `, {
      replacements: {
        amenityId: reservation.amenityId,
        communityId: reservation.communityId,
        proposedDate: proposedDate,
        proposedStart: proposedStart.toISOString(),
        proposedEnd: proposedEnd.toISOString(),
        reservationId: reservation.id
      },
      type: QueryTypes.SELECT
    }) as any[];

    const conflictingReservation = conflictingReservationResult && conflictingReservationResult.length > 0 ? { id: conflictingReservationResult[0].id } : null;

    if (conflictingReservation) {
      return res.status(400).json({ 
        message: 'The proposed time conflicts with an existing reservation' 
      });
    }

    // Apply the modification: update reservation with proposed values using raw SQL
    // At this point, we've already verified proposedPartyTimeStart and proposedPartyTimeEnd are not null
    // Try both quoted (camelCase) and unquoted (lowercase) column names to handle different table schemas
    try {
      await sequelize.query(`
        UPDATE reservations
        SET date = :proposedDate,
            "partyTimeStart" = :proposedStart,
            "partyTimeEnd" = :proposedEnd,
            "setupTimeStart" = :proposedStart,
            "setupTimeEnd" = :proposedStart,
            modificationstatus = 'ACCEPTED',
            proposeddate = NULL,
            proposedpartytimestart = NULL,
            proposedpartytimeend = NULL,
            modificationreason = NULL,
            modificationproposedby = NULL,
            modificationproposedat = NULL
        WHERE id = :reservationId
      `, {
        replacements: {
          proposedDate: proposedDate,
          proposedStart: proposedStart.toISOString(),
          proposedEnd: proposedEnd.toISOString(),
          reservationId: id
        },
        type: QueryTypes.UPDATE
      });
    } catch (updateError: any) {
      // If quoted columns fail, try lowercase (unquoted) column names
      const errorMessage = String(updateError.message || '').toLowerCase();
      const originalError = updateError.original || updateError;
      const pgErrorCode = originalError.code || '';
      
      console.error('❌ First UPDATE attempt failed:', {
        message: updateError.message,
        code: pgErrorCode,
        original: originalError.message
      });
      
      if (errorMessage.includes('column') && (errorMessage.includes('does not exist') || errorMessage.includes('undefined')) || pgErrorCode === '42703') {
        console.log('⚠️ Quoted column names failed, trying lowercase...');
        try {
          await sequelize.query(`
            UPDATE reservations
            SET date = :proposedDate,
                partytimestart = :proposedStart,
                partytimeend = :proposedEnd,
                setuptimestart = :proposedStart,
                setuptimeend = :proposedStart,
                modificationstatus = 'ACCEPTED',
                proposeddate = NULL,
                proposedpartytimestart = NULL,
                proposedpartytimeend = NULL,
                modificationreason = NULL,
                modificationproposedby = NULL,
                modificationproposedat = NULL
            WHERE id = :reservationId
          `, {
            replacements: {
              proposedDate: proposedDate,
              proposedStart: proposedStart.toISOString(),
              proposedEnd: proposedEnd.toISOString(),
              reservationId: id
            },
            type: QueryTypes.UPDATE
          });
        } catch (fallbackError: any) {
          console.error('❌ Fallback UPDATE also failed:', {
            message: fallbackError.message,
            code: fallbackError.original?.code || '',
            original: fallbackError.original?.message || ''
          });
          throw fallbackError;
        }
      } else {
        throw updateError;
      }
    }

    // Fetch updated reservation to return
    const updatedReservation = await Reservation.findOne({
      where: { id },
      attributes: [
        'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
        'guestCount', 'specialRequirements', 'status', 'totalFee', 'totalDeposit',
        'eventName', 'isPrivate', 'communityId', 'amenityId', 'userId',
        [col('modificationstatus'), 'modificationStatus']
      ],
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name', 'description', 'reservationFee', 'deposit', 'capacity']
        }
      ]
    });

    console.log('✅ Modification accepted successfully');

    return res.json({
      message: 'Modification accepted successfully',
      reservation: updatedReservation?.toJSON() || { id: parseInt(id) }
    });

  } catch (error: any) {
    console.error('❌ Error accepting modification:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error original:', error.original);
    console.error('❌ Error stack:', error.stack);
    
    const originalError = error.original || error;
    const errorMessage = originalError.message || error.message || 'Unknown error';
    const errorCode = originalError.code || error.code || 'UNKNOWN';
    
    return res.status(500).json({ 
      message: 'Internal server error',
      details: errorMessage,
      errorCode: errorCode,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/reservations/:id/reject-modification - Reject proposed modification (cancels reservation)
router.put('/:id/reject-modification', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log('❌ Rejecting modification for reservation:', id, 'by user:', userId);

    // Verify reservation exists and belongs to user with pending modification using raw SQL
    const reservationCheck = await sequelize.query(`
      SELECT id FROM reservations
      WHERE id = :reservationId
        AND "userId" = :userId
        AND LOWER(modificationstatus) = 'pending'
    `, {
      replacements: {
        reservationId: id,
        userId: userId
      },
      type: QueryTypes.SELECT
    }) as any[];

    if (!reservationCheck || reservationCheck.length === 0) {
      return res.status(404).json({ 
        message: 'Reservation not found, does not belong to you, or has no pending modification' 
      });
    }

    // When rejecting modification, cancel the entire reservation using raw SQL
    // User will need to book a new reservation if they want to proceed
    await sequelize.query(`
      UPDATE reservations
      SET status = 'CANCELLED',
          modificationstatus = 'REJECTED',
          proposeddate = NULL,
          proposedpartytimestart = NULL,
          proposedpartytimeend = NULL,
          modificationreason = NULL
      WHERE id = :reservationId
    `, {
      replacements: {
        reservationId: id
      },
      type: QueryTypes.UPDATE
    });

    // Fetch updated reservation to return
    const updatedReservation = await Reservation.findOne({
      where: { id },
      attributes: [
        'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
        'guestCount', 'specialRequirements', 'status', 'totalFee', 'totalDeposit',
        'eventName', 'isPrivate', 'communityId', 'amenityId', 'userId',
        [col('modificationstatus'), 'modificationStatus']
      ]
    });

    console.log('✅ Modification rejected - reservation cancelled');

    return res.json({
      message: 'Modification rejected. Reservation has been cancelled. You can book a new reservation if needed.',
      reservation: updatedReservation?.toJSON() || { id: parseInt(id) }
    });

  } catch (error: any) {
    console.error('❌ Error rejecting modification:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    return res.status(500).json({ 
      message: 'Internal server error',
      details: error.message || 'Unknown error'
    });
  }
});

// PUT /api/reservations/:id/cancel-modification - Cancel proposed modification (janitorial/admin only)
router.put('/:id/cancel-modification', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const communityRole = req.user.communityRole;

    console.log('🔄 Canceling modification proposal for reservation:', id, 'by user:', userId);

    // Check if user is janitorial or admin in current community
    if (communityRole !== 'janitorial' && communityRole !== 'admin') {
      return res.status(403).json({ message: 'Janitorial or admin access required' });
    }

    // Use raw SQL to clear modification fields
    // Use quoted column name for communityId since it was created with camelCase
    await sequelize.query(`
      UPDATE reservations
      SET modificationstatus = 'NONE',
          proposeddate = NULL,
          proposedpartytimestart = NULL,
          proposedpartytimeend = NULL,
          modificationreason = NULL,
          modificationproposedby = NULL,
          modificationproposedat = NULL
      WHERE id = :reservationId
        AND "communityId" = :communityId
        AND LOWER(modificationstatus) = 'pending'
    `, {
      replacements: {
        reservationId: id,
        communityId: req.user.currentCommunityId
      },
      type: QueryTypes.UPDATE
    });

    console.log('✅ Modification proposal canceled successfully');

    return res.json({
      message: 'Modification proposal canceled. Reservation returned to original time.',
      reservation: { id: parseInt(id) }
    });

  } catch (error: any) {
    console.error('❌ Error canceling modification:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    return res.status(500).json({ 
      message: 'Internal server error',
      details: error.message || 'Unknown error'
    });
  }
});

export default router;
