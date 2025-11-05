import express from 'express';
import { Reservation, Amenity, User, sequelize } from '../models';
import { authenticateToken } from '../middleware/auth';
import { Op } from 'sequelize';

// Define interfaces for associated models
interface ReservationWithAssociations extends Reservation {
  amenity?: Amenity;
  user?: User;
}

const router = express.Router();

// GET /api/calendar/availability - Get availability for date range
router.get('/availability', authenticateToken, async (req: any, res) => {
  try {
    const { startDate, endDate, amenityId } = req.query;
    const communityId = req.user.currentCommunityId;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    console.log('🔍 Fetching availability for:', { startDate, endDate, amenityId, communityId });

    // Build where clause - filter by community
    const whereClause: any = {
      communityId,
      date: {
        [Op.between]: [startDate, endDate]
      },
      status: {
        [Op.in]: ['NEW', 'JANITORIAL_APPROVED', 'FULLY_APPROVED']
      }
    };

    if (amenityId) {
      whereClause.amenityId = amenityId;
    }

    const reservations = await Reservation.findAll({
      where: whereClause,
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      attributes: [
        'id', 'date', 'setupTimeStart', 'setupTimeEnd', 
        'partyTimeStart', 'partyTimeEnd', 'status', 'guestCount',
        'cleaningTimeStart', 'cleaningTimeEnd'
      ]
    }) as ReservationWithAssociations[];

    console.log('✅ Found reservations:', reservations.length);

    return res.json({
      availability: reservations,
      dateRange: { startDate, endDate },
      amenityId: amenityId || 'all'
    });

  } catch (error) {
    console.error('❌ Error fetching availability:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/calendar/events - Get events for calendar view
router.get('/events', authenticateToken, async (req: any, res) => {
  try {
    const { startDate, endDate, amenityId, calendarGroup } = req.query;
    const communityId = req.user.currentCommunityId;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    console.log('📅 Fetching calendar events for:', { startDate, endDate, amenityId, calendarGroup, communityId });

    // Build where clause - filter by community, exclude only cancelled reservations
    const whereClause: any = {
      communityId,
      date: {
        [Op.between]: [startDate, endDate]
      },
      status: {
        [Op.notIn]: ['CANCELLED'] // Include COMPLETED reservations
      }
    };

    if (amenityId) {
      whereClause.amenityId = amenityId;
    }

    // Build amenity filter for calendar group
    const amenityWhere: any = {};
    if (calendarGroup !== undefined) {
      if (calendarGroup === '') {
        // Filter for amenities with no calendar group (null)
        amenityWhere.calendarGroup = null;
      } else {
        amenityWhere.calendarGroup = calendarGroup;
      }
    }

    // Try to include eventName and isPrivate, but handle if they don't exist yet
    const attributes = [
      'id', 'date', 'setupTimeStart', 'setupTimeEnd', 
      'partyTimeStart', 'partyTimeEnd', 'status', 'guestCount',
      'specialRequirements', 'totalFee', 'totalDeposit',
      'cleaningTimeStart', 'cleaningTimeEnd'
    ];
    
    // Check if eventName and isPrivate columns exist before adding them
    try {
      const columnCheck = await sequelize.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'reservations' 
        AND column_name IN ('eventName', 'isPrivate')
      `) as any[];
      
      const existingColumns = columnCheck[0].map((row: any) => row.column_name);
      if (existingColumns.includes('eventName')) {
        attributes.push('eventName');
      }
      if (existingColumns.includes('isPrivate')) {
        attributes.push('isPrivate');
      }
    } catch (error) {
      // If check fails, continue without eventName/isPrivate
      console.log('⚠️ Could not check for eventName/isPrivate columns, continuing without them');
    }

    const reservations = await Reservation.findAll({
      where: whereClause,
      include: [
        {
          model: Amenity,
          as: 'amenity',
          where: Object.keys(amenityWhere).length > 0 ? amenityWhere : undefined,
          required: true,
          attributes: ['id', 'name', 'reservationFee', 'deposit', 'calendarGroup', 'displayColor']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      attributes: attributes,
      order: [['date', 'ASC'], ['partyTimeStart', 'ASC']]
    }) as ReservationWithAssociations[];

    // Transform data for calendar display
    const events = reservations.map(reservation => {
      // Convert date to YYYY-MM-DD string format for frontend consistency
      const dateStr = reservation.date instanceof Date 
        ? `${reservation.date.getFullYear()}-${String(reservation.date.getMonth() + 1).padStart(2, '0')}-${String(reservation.date.getDate()).padStart(2, '0')}`
        : reservation.date;
      
      // Determine display title based on privacy and event name
      // Check if eventName and isPrivate exist (may be undefined if columns don't exist yet)
      const eventName = (reservation as any).eventName;
      const isPrivate = (reservation as any).isPrivate === true || (reservation as any).isPrivate === 'true';
      
      let displayTitle;
      if (isPrivate) {
        displayTitle = 'Private Event';
      } else if (eventName) {
        displayTitle = eventName;
      } else {
        displayTitle = `${reservation.amenity?.name || 'Unknown'} - ${reservation.user?.firstName || ''} ${reservation.user?.lastName || ''}`;
      }
      
      return {
        id: reservation.id,
        title: displayTitle,
        start: reservation.setupTimeStart,
        end: reservation.partyTimeEnd,
        date: dateStr,
        amenityId: reservation.amenityId,
        amenityName: reservation.amenity?.name || 'Unknown',
        userName: `${reservation.user?.firstName || ''} ${reservation.user?.lastName || ''}`,
        userEmail: reservation.user?.email || '',
        guestCount: reservation.guestCount,
        status: reservation.status,
        eventName: eventName || null,
        isPrivate: isPrivate || false,
        setupTime: {
          start: reservation.setupTimeStart,
          end: reservation.setupTimeEnd
        },
        partyTime: {
          start: reservation.partyTimeStart,
          end: reservation.partyTimeEnd
        },
        cleaningTime: reservation.cleaningTimeStart && reservation.cleaningTimeEnd ? {
          start: reservation.cleaningTimeStart,
          end: reservation.cleaningTimeEnd
        } : undefined,
        specialRequirements: reservation.specialRequirements,
        totalFee: reservation.totalFee,
        totalDeposit: reservation.totalDeposit,
        color: getEventColor(reservation.status, reservation.amenityId, reservation.amenity?.displayColor)
      };
    });

    console.log('✅ Generated events:', events.length);

    return res.json({
      events,
      dateRange: { startDate, endDate },
      amenityId: amenityId || 'all'
    });

  } catch (error) {
    console.error('❌ Error fetching calendar events:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to get event colors
function getEventColor(status: string, amenityId: number, amenityDisplayColor?: string | null): string {
  // Use amenity's display color if available
  if (amenityDisplayColor) {
    return amenityDisplayColor;
  }

  const colors = {
    NEW: '#f59e0b',              // Orange
    JANITORIAL_APPROVED: '#3b82f6',  // Blue
    FULLY_APPROVED: '#10b981',   // Green
    CANCELLED: '#ef4444',        // Red
    COMPLETED: '#6b7280'         // Gray
  };

  const amenityColors = {
    1: '#3b82f6',  // Blue for Clubroom
    2: '#8b5cf6'   // Purple for Pool
  };

  return colors[status as keyof typeof colors] || amenityColors[amenityId as keyof typeof amenityColors] || '#6b7280';
}

// GET /api/calendar/time-slots - Get available time slots for a specific date
router.get('/time-slots', async (req, res) => {
  try {
    const { date, amenityId } = req.query;
    
    if (!date || !amenityId) {
      return res.status(400).json({ message: 'Date and amenity ID are required' });
    }

    console.log('⏰ Fetching time slots for:', { date, amenityId });

    // Get existing reservations for the date and amenity
    const existingReservations = await Reservation.findAll({
      where: {
        date: date as string,
        amenityId: parseInt(amenityId as string),
        status: {
          [Op.in]: ['NEW', 'JANITORIAL_APPROVED', 'FULLY_APPROVED']
        }
      },
      attributes: ['setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd']
    });

    // Generate available time slots (every 30 minutes from 6 AM to 11 PM)
    const timeSlots = [];
    const startHour = 6;
    const endHour = 23;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotStart = new Date(`${date}T${timeString}:00`);
        const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000); // 30 minutes later
        
        // Check if this slot conflicts with existing reservations
        const isAvailable = !existingReservations.some(reservation => {
          const setupStart = new Date(reservation.setupTimeStart);
          const partyEnd = new Date(reservation.partyTimeEnd);
          return (slotStart < partyEnd && slotEnd > setupStart);
        });

        timeSlots.push({
          time: timeString,
          start: slotStart,
          end: slotEnd,
          available: isAvailable
        });
      }
    }

    return res.json({
      date,
      amenityId,
      timeSlots,
      existingReservations: existingReservations.length
    });

  } catch (error) {
    console.error('❌ Error fetching time slots:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
