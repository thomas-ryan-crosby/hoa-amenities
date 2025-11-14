import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useMobile } from '../hooks/useMobile';
import { formatDate, formatTime, formatTimeRange, formatDateTime, parseDateString } from '../utils/dateTimeUtils';
import SimpleTimeSelector from './SimpleTimeSelector';

interface Reservation {
  id: number;
  date: string;
  setupTimeStart: string;
  setupTimeEnd: string;
  partyTimeStart: string;
  partyTimeEnd: string;
  guestCount: number;
  eventName?: string | null;
  isPrivate?: boolean;
  specialRequirements?: string;
  status: 'NEW' | 'JANITORIAL_APPROVED' | 'FULLY_APPROVED' | 'CANCELLED' | 'COMPLETED';
  totalFee: number | string;
  totalDeposit: number | string;
  cleaningTimeStart?: string;
  cleaningTimeEnd?: string;
  // Modification Proposal Fields
  modificationStatus?: 'NONE' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | null;
  proposedDate?: string | null;
  proposedPartyTimeStart?: string | null;
  proposedPartyTimeEnd?: string | null;
  modificationReason?: string | null;
  // Damage Assessment Fields
  damageAssessed?: boolean;
  damageAssessmentPending?: boolean;
  damageAssessmentStatus?: 'PENDING' | 'APPROVED' | 'ADJUSTED' | 'DENIED' | null;
  damageCharge?: number | null;
  damageChargeAmount?: number | null;
  damageChargeAdjusted?: number | null;
  damageDescription?: string | null;
  damageNotes?: string | null;
  adminDamageNotes?: string | null;
  amenity: {
    id: number;
    name: string;
    description: string;
    reservationFee: number | string;
    deposit: number | string;
    capacity: number;
    janitorialRequired?: boolean;
    approvalRequired?: boolean;
  };
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const JanitorialPage: React.FC = () => {
  const { currentCommunity, isAdmin, isJanitorial } = useAuth();
  const isMobile = useMobile();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'NEW' | 'JANITORIAL_APPROVED' | 'FULLY_APPROVED'>('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showCleaningTimeModal, setShowCleaningTimeModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [cleaningTime, setCleaningTime] = useState({
    startDate: '', // Format: "YYYY-MM-DD"
    startTime: '', // Format: "HH:MM" (24-hour)
    endDate: '',   // Format: "YYYY-MM-DD"
    endTime: ''    // Format: "HH:MM" (24-hour)
  });
  const [showPartyCompleteModal, setShowPartyCompleteModal] = useState(false);
  const [showDamageAssessmentModal, setShowDamageAssessmentModal] = useState(false);
  const [damageAssessment, setDamageAssessment] = useState({
    amount: '',
    description: '',
    notes: ''
  });
  const [showModificationModal, setShowModificationModal] = useState(false);
  const [modificationProposal, setModificationProposal] = useState({
    proposedDate: '',
    proposedPartyTimeStart: '',
    proposedPartyTimeEnd: '',
    modificationReason: ''
  });
  const [showPastReservations, setShowPastReservations] = useState(false);
  
  // Damage Review state (admin only)
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Reservation | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'adjust' | 'deny'>('approve');
  const [adjustedAmount, setAdjustedAmount] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  
  // Damage Review View state (for viewing completed damage assessments)
  const [showDamageViewModal, setShowDamageViewModal] = useState(false);
  const [selectedDamageView, setSelectedDamageView] = useState<Reservation | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${apiUrl}/api/reservations/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Debug: Log the first reservation to verify amenity data is included
      if (response.data.reservations && response.data.reservations.length > 0) {
        const firstReservation = response.data.reservations[0];
        console.log('Fetched reservation sample:', {
          id: firstReservation.id,
          status: firstReservation.status,
          amenity: firstReservation.amenity ? {
            id: firstReservation.amenity.id,
            name: firstReservation.amenity.name,
            janitorialRequired: firstReservation.amenity.janitorialRequired,
            approvalRequired: firstReservation.amenity.approvalRequired,
            allKeys: Object.keys(firstReservation.amenity)
          } : 'NO AMENITY'
        });
      }
      
      setReservations(response.data.reservations);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load reservations');
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewDamageAssessment = async () => {
    if (!selectedReview) return;

    // Validate if adjusting
    if (reviewAction === 'adjust') {
      if (!adjustedAmount || parseFloat(adjustedAmount) <= 0) {
        setError('Adjusted amount must be greater than 0');
        return;
      }
    }

    try {
      setActionLoading(selectedReview.id);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await axios.put(
        `${apiUrl}/api/reservations/${selectedReview.id}/review-damage-assessment`,
        {
          action: reviewAction,
          amount: reviewAction === 'adjust' ? parseFloat(adjustedAmount) : undefined,
          adminNotes: adminNotes.trim() || undefined
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Close modal and refresh
      setShowReviewModal(false);
      setSelectedReview(null);
      setReviewAction('approve');
      setAdjustedAmount('');
      setAdminNotes('');
      fetchReservations(); // Refresh reservations to update status
    } catch (error: any) {
      console.error('❌ Error reviewing damage assessment:', error);
      setError(error.response?.data?.message || 'Failed to review damage assessment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async (reservationId: number) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) return;

    // Helper functions to format dates and times
    const formatTimeForSelector = (date: Date): string => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };
    
    const formatDateForInput = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // For janitorial users, show cleaning time modal
    if (isJanitorial) {
      setSelectedReservation(reservation);
      // Set default cleaning time (30 minutes after reservation ends, then 2 hours later)
      const reservationEndTime = new Date(reservation.partyTimeEnd);
      const defaultCleaningStart = new Date(reservationEndTime.getTime() + 30 * 60 * 1000); // 30 minutes after reservation
      const defaultCleaningEnd = new Date(defaultCleaningStart.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
      
      setCleaningTime({
        startDate: formatDateForInput(defaultCleaningStart),
        startTime: formatTimeForSelector(defaultCleaningStart),
        endDate: formatDateForInput(defaultCleaningEnd),
        endTime: formatTimeForSelector(defaultCleaningEnd)
      });
      setShowCleaningTimeModal(true);
    } else if (isAdmin) {
      // For admin users approving JANITORIAL_APPROVED reservations
      if (reservation.status === 'JANITORIAL_APPROVED') {
        setSelectedReservation(reservation);
        
        console.log('Admin approving JANITORIAL_APPROVED reservation:', {
          reservationId: reservation.id,
          cleaningTimeStart: reservation.cleaningTimeStart,
          cleaningTimeEnd: reservation.cleaningTimeEnd,
          hasCleaningTime: !!(reservation.cleaningTimeStart && reservation.cleaningTimeEnd)
        });
        
        // If cleaning time exists, use it; otherwise use defaults
        if (reservation.cleaningTimeStart && reservation.cleaningTimeEnd) {
          // Use existing janitorial cleaning time as default
          const existingCleaningStart = new Date(reservation.cleaningTimeStart);
          const existingCleaningEnd = new Date(reservation.cleaningTimeEnd);
          
          console.log('Using existing cleaning time:', {
            start: existingCleaningStart.toISOString(),
            end: existingCleaningEnd.toISOString()
          });
          
          setCleaningTime({
            startDate: formatDateForInput(existingCleaningStart),
            startTime: formatTimeForSelector(existingCleaningStart),
            endDate: formatDateForInput(existingCleaningEnd),
            endTime: formatTimeForSelector(existingCleaningEnd)
          });
        } else {
          // No cleaning time set yet, use defaults (30 minutes after reservation ends, then 2 hours later)
          const reservationEndTime = new Date(reservation.partyTimeEnd);
          const defaultCleaningStart = new Date(reservationEndTime.getTime() + 30 * 60 * 1000);
          const defaultCleaningEnd = new Date(defaultCleaningStart.getTime() + 2 * 60 * 60 * 1000);
          
          console.log('Using default cleaning time:', {
            start: defaultCleaningStart.toISOString(),
            end: defaultCleaningEnd.toISOString()
          });
          
          setCleaningTime({
            startDate: formatDateForInput(defaultCleaningStart),
            startTime: formatTimeForSelector(defaultCleaningStart),
            endDate: formatDateForInput(defaultCleaningEnd),
            endTime: formatTimeForSelector(defaultCleaningEnd)
          });
        }
        setShowCleaningTimeModal(true);
      } else {
        // For NEW reservations, approve directly (or show modal if needed)
        await approveReservation(reservationId);
      }
    }
  };

  const approveReservation = async (reservationId: number, cleaningTimeData?: { start: string; end: string }) => {
    try {
      setActionLoading(reservationId);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const requestData = cleaningTimeData ? {
        cleaningTimeStart: cleaningTimeData.start,
        cleaningTimeEnd: cleaningTimeData.end
      } : {};
      
      await axios.put(`${apiUrl}/api/reservations/${reservationId}/approve`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh reservations
      fetchReservations();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve reservation');
      console.error('Error approving reservation:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCleaningTimeSubmit = async () => {
    if (!selectedReservation) return;
    
    // Validate cleaning time
    if (!cleaningTime.startDate || !cleaningTime.startTime || !cleaningTime.endDate || !cleaningTime.endTime) {
      setError('Please select both cleaning dates and times');
      return;
    }
    
    // Parse time strings (HH:MM format)
    const parseTime = (timeStr: string): { hours: number; minutes: number } => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return { hours, minutes };
    };
    
    const startTimeParts = parseTime(cleaningTime.startTime);
    const endTimeParts = parseTime(cleaningTime.endTime);
    
    // Create full datetime by combining selected date with selected time
    const startDateTime = parseDateString(cleaningTime.startDate);
    startDateTime.setHours(startTimeParts.hours, startTimeParts.minutes, 0, 0);
    
    const endDateTime = parseDateString(cleaningTime.endDate);
    endDateTime.setHours(endTimeParts.hours, endTimeParts.minutes, 0, 0);
    
    // Validate end time is after start time
    if (endDateTime <= startDateTime) {
      setError('Cleaning end time must be after start time');
      return;
    }
    
    // No minimum duration requirement - janitorial can set cleaning time as needed
    // No validation that cleaning must start after reservation ends - can be on different day
    
    // Format as ISO strings for backend
    const cleaningTimeData = {
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString()
    };
    
    // Close modal and approve with cleaning time
    setShowCleaningTimeModal(false);
    await approveReservation(selectedReservation.id, cleaningTimeData);
  };

  const handleCleaningTimeCancel = () => {
    setShowCleaningTimeModal(false);
    setSelectedReservation(null);
    setCleaningTime({ startDate: '', startTime: '', endDate: '', endTime: '' });
  };

  const handlePartyComplete = async (damagesFound: boolean) => {
    if (!selectedReservation) return;
    
    try {
      setActionLoading(selectedReservation.id);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await axios.put(`${apiUrl}/api/reservations/${selectedReservation.id}/complete`, {
        damagesFound
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // If damages found, open damage assessment modal
      if (damagesFound) {
        setShowPartyCompleteModal(false);
        setShowDamageAssessmentModal(true);
      } else {
        // No damages - close modal and refresh
        setShowPartyCompleteModal(false);
        setSelectedReservation(null);
        fetchReservations();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark party complete');
      console.error('Error marking party complete:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDamageAssessment = async () => {
    if (!selectedReservation) return;
    
    // Validate input
    if (!damageAssessment.amount || parseFloat(damageAssessment.amount) <= 0) {
      setError('Damage amount must be greater than 0');
      return;
    }
    if (!damageAssessment.description || damageAssessment.description.trim() === '') {
      setError('Damage description is required');
      return;
    }
    
    const maxDamageFee = parseFloat(String(selectedReservation.amenity?.deposit || selectedReservation.totalDeposit));
    const damageAmount = parseFloat(damageAssessment.amount);
    
    if (damageAmount > maxDamageFee) {
      setError(`Damage amount cannot exceed potential damage fee of $${maxDamageFee.toFixed(2)}`);
      return;
    }
    
    try {
      setActionLoading(selectedReservation.id);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await axios.post(`${apiUrl}/api/reservations/${selectedReservation.id}/assess-damages`, {
        amount: damageAmount,
        description: damageAssessment.description.trim(),
        notes: damageAssessment.notes.trim() || null
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Close modal and refresh
      setShowDamageAssessmentModal(false);
      setSelectedReservation(null);
      setDamageAssessment({ amount: '', description: '', notes: '' });
      fetchReservations();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to assess damages');
      console.error('Error assessing damages:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reservationId: number) => {
    const reason = window.prompt('Please provide a reason for rejection (optional):');
    if (reason === null) return; // User cancelled

    try {
      setActionLoading(reservationId);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await axios.put(`${apiUrl}/api/reservations/${reservationId}/reject`, {
        reason: reason || undefined
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh reservations
      fetchReservations();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject reservation');
      console.error('Error rejecting reservation:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleProposeModification = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    // Pre-fill with current reservation times
    const currentStart = new Date(reservation.partyTimeStart);
    const currentEnd = new Date(reservation.partyTimeEnd);
    const startTime = `${String(currentStart.getHours()).padStart(2, '0')}:${String(currentStart.getMinutes()).padStart(2, '0')}`;
    const endTime = `${String(currentEnd.getHours()).padStart(2, '0')}:${String(currentEnd.getMinutes()).padStart(2, '0')}`;
    
    setModificationProposal({
      proposedDate: reservation.date,
      proposedPartyTimeStart: startTime,
      proposedPartyTimeEnd: endTime,
      modificationReason: ''
    });
    setShowModificationModal(true);
  };

  const handleCancelModification = async (reservation: Reservation) => {
    try {
      setActionLoading(reservation.id);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await axios.put(`${apiUrl}/api/reservations/${reservation.id}/cancel-modification`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setShowModificationModal(false);
      setModificationProposal({
        proposedDate: '',
        proposedPartyTimeStart: '',
        proposedPartyTimeEnd: '',
        modificationReason: ''
      });
      fetchReservations();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel modification';
      const errorDetails = err.response?.data?.details || '';
      const errorCode = err.response?.data?.errorCode || '';
      
      console.error('Error canceling modification:', err);
      console.error('Error response data:', err.response?.data);
      console.error('Error details:', errorDetails);
      console.error('Error code:', errorCode);
      
      if (errorDetails) {
        setError(`${errorMessage}\n\nDetails: ${errorDetails}\nError Code: ${errorCode}`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleModificationSubmit = async () => {
    if (!selectedReservation) return;
    
    // Validate
    if (!modificationProposal.proposedPartyTimeStart || !modificationProposal.proposedPartyTimeEnd || !modificationProposal.modificationReason.trim()) {
      setError('Please fill in all required fields: proposed times and reason');
      return;
    }
    
    try {
      setActionLoading(selectedReservation.id);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      // Convert times to ISO strings
      const [startHours, startMinutes] = modificationProposal.proposedPartyTimeStart.split(':').map(Number);
      const [endHours, endMinutes] = modificationProposal.proposedPartyTimeEnd.split(':').map(Number);
      
      const proposedDate = new Date(selectedReservation.date);
      const proposedDateObj = new Date(proposedDate.getFullYear(), proposedDate.getMonth(), proposedDate.getDate());
      
      const proposedStartDateTime = new Date(proposedDateObj);
      proposedStartDateTime.setHours(startHours, startMinutes, 0, 0);
      
      const proposedEndDateTime = new Date(proposedDateObj);
      proposedEndDateTime.setHours(endHours, endMinutes, 0, 0);
      
      await axios.post(`${apiUrl}/api/reservations/${selectedReservation.id}/propose-modification`, {
        proposedDate: modificationProposal.proposedDate,
        proposedPartyTimeStart: proposedStartDateTime.toISOString(),
        proposedPartyTimeEnd: proposedEndDateTime.toISOString(),
        modificationReason: modificationProposal.modificationReason.trim()
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Close modal and refresh
      setShowModificationModal(false);
      setSelectedReservation(null);
      setModificationProposal({
        proposedDate: '',
        proposedPartyTimeStart: '',
        proposedPartyTimeEnd: '',
        modificationReason: ''
      });
      fetchReservations();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to propose modification';
      const errorDetails = err.response?.data?.details || '';
      const errorCode = err.response?.data?.errorCode || '';
      
      console.error('Error proposing modification:', err);
      console.error('Error response data:', err.response?.data);
      console.error('Error details:', errorDetails);
      console.error('Error code:', errorCode);
      
      // Show detailed error if available
      if (errorDetails) {
        setError(`${errorMessage}\n\nDetails: ${errorDetails}\nError Code: ${errorCode}`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string): string => {
    const colors = {
      NEW: '#f59e0b',              // Orange
      JANITORIAL_APPROVED: '#3b82f6',  // Blue
      FULLY_APPROVED: '#10b981',   // Green
      CANCELLED: '#ef4444',        // Red
      COMPLETED: '#6b7280'         // Gray
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  const getStatusText = (status: string): string => {
    const statusText = {
      NEW: 'New - Needs Janitorial Review',
      JANITORIAL_APPROVED: 'Janitorial Approved - Needs Admin Review',
      FULLY_APPROVED: 'Fully Approved',
      CANCELLED: 'Cancelled',
      COMPLETED: 'Completed'
    };
    return statusText[status as keyof typeof statusText] || status;
  };


  const canApprove = (reservation: Reservation): boolean => {
    if (isAdmin) {
      return reservation.status === 'NEW' || reservation.status === 'JANITORIAL_APPROVED';
    } else if (isJanitorial) {
      return reservation.status === 'NEW';
    }
    return false;
  };

  const getApprovalButtonText = (reservation: Reservation): string => {
    if (actionLoading === reservation.id) {
      return 'Processing...';
    }

    // Debug: Log user roles and reservation status
    console.log('getApprovalButtonText called:', {
      reservationId: reservation.id,
      status: reservation.status,
      isAdmin,
      isJanitorial,
      amenity: reservation.amenity ? {
        id: reservation.amenity.id,
        name: reservation.amenity.name,
        janitorialRequired: reservation.amenity.janitorialRequired,
        approvalRequired: reservation.amenity.approvalRequired,
        hasJanitorialRequired: 'janitorialRequired' in (reservation.amenity || {}),
        amenityKeys: Object.keys(reservation.amenity || {})
      } : 'NO AMENITY DATA'
    });

    // For admins, show context-aware text (check admin first, as admins can also have janitorial role)
    if (isAdmin) {
      if (reservation.status === 'NEW') {
        // Admin approving a NEW reservation
        // Check if janitorial approval is required
        const janitorialRequired = reservation.amenity?.janitorialRequired;
        const approvalRequired = reservation.amenity?.approvalRequired;
        
        console.log('Admin approving NEW reservation:', {
          reservationId: reservation.id,
          amenityName: reservation.amenity?.name,
          janitorialRequired,
          approvalRequired,
          janitorialRequiredType: typeof janitorialRequired,
          janitorialRequiredValue: janitorialRequired,
          willShowJanitorialText: janitorialRequired === true || (janitorialRequired === undefined && approvalRequired !== false)
        });
        
        // If janitorial approval is explicitly required (true or undefined, which defaults to true)
        // Admin is approving on behalf of janitorial
        if (janitorialRequired === true || (janitorialRequired === undefined && approvalRequired !== false)) {
          return 'Approve on Behalf of Janitorial';
        } else if (janitorialRequired === false && approvalRequired === true) {
          // No janitorial required, but admin approval is needed
          return 'Approve as Admin';
        } else {
          // Default: if we can't determine, assume janitorial is required (safer default)
          return 'Approve on Behalf of Janitorial';
        }
      } else if (reservation.status === 'JANITORIAL_APPROVED') {
        // Admin approving a JANITORIAL_APPROVED reservation (final approval)
        return 'Final Approve as Admin';
      }
    }

    // For janitorial users (non-admin), always show "Approve" for NEW reservations
    if (isJanitorial && reservation.status === 'NEW') {
      return 'Approve';
    }

    // Fallback
    return reservation.status === 'NEW' ? 'Approve' : 'Final Approve';
  };

  const canReject = (reservation: Reservation): boolean => {
    return reservation.status === 'NEW' || reservation.status === 'JANITORIAL_APPROVED';
  };

  // Separate reservations into upcoming and past/completed/cancelled
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Reset to start of day for comparison
  
  const upcomingReservations = reservations.filter(r => {
    const reservationDate = new Date(r.date);
    reservationDate.setHours(0, 0, 0, 0);
    const isPast = reservationDate < now;
    const isCompleted = r.status === 'COMPLETED';
    const isCancelled = r.status === 'CANCELLED';
    return !isPast && !isCompleted && !isCancelled;
  });
  
  const pastReservations = reservations.filter(r => {
    const reservationDate = new Date(r.date);
    reservationDate.setHours(0, 0, 0, 0);
    const isPast = reservationDate < now;
    const isCompleted = r.status === 'COMPLETED';
    const isCancelled = r.status === 'CANCELLED';
    return isPast || isCompleted || isCancelled;
  });
  
  // Show reservations that need janitorial attention:
  // 1. NEW reservations that need janitorial approval
  // 2. JANITORIAL_APPROVED reservations that need admin approval (if admin approval is required)
  // 3. FULLY_APPROVED upcoming reservations (so janitorial can mark them complete)
  const reservationsNeedingApproval = upcomingReservations.filter(r => {
    const needsJanitorial = r.amenity.janitorialRequired !== false && r.status === 'NEW';
    const needsAdmin = r.amenity.approvalRequired !== false && r.status === 'JANITORIAL_APPROVED';
    const isFullyApproved = r.status === 'FULLY_APPROVED';
    return needsJanitorial || needsAdmin || isFullyApproved;
  });
  
  // Apply filter if not 'all'
  const filteredUpcoming = filter === 'all' 
    ? reservationsNeedingApproval 
    : reservationsNeedingApproval.filter(r => r.status === filter);
  
  const filteredPast = filter === 'all' 
    ? pastReservations 
    : pastReservations.filter(r => r.status === filter);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Loading reservations for review...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
        <button 
          onClick={fetchReservations}
          style={{ padding: '8px 16px', backgroundColor: '#355B45', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0.75rem' : '20px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center', 
        marginBottom: isMobile ? '1.5rem' : '30px',
        gap: isMobile ? '1rem' : '0'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 'bold', margin: 0 }}>
            Approval Center
          </h1>
          {currentCommunity && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                Community:
              </span>
              <span style={{ 
                fontSize: '0.875rem', 
                color: '#355B45', 
                fontWeight: '600',
                backgroundColor: '#f0f9f4',
                padding: '0.25rem 0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1fae5'
              }}>
                {currentCommunity.name}
              </span>
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
          >
            <option value="all">All Reservations</option>
            <option value="NEW">New (Need Review)</option>
            <option value="JANITORIAL_APPROVED">Janitorial Approved</option>
            <option value="FULLY_APPROVED">Fully Approved</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: isMobile ? '0.75rem' : '20px', 
        marginBottom: isMobile ? '1.5rem' : '30px' 
      }}>
        <div style={{ backgroundColor: 'white', padding: isMobile ? '1rem' : '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: isMobile ? '0.95rem' : '1rem' }}>Total Reservations</h3>
          <div style={{ fontSize: isMobile ? '1.75rem' : '2rem', fontWeight: 600, color: '#355B45', fontFamily: 'Inter, sans-serif' }}>
            {reservations.length}
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: isMobile ? '1rem' : '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: isMobile ? '0.95rem' : '1rem' }}>Pending Review</h3>
          <div style={{ fontSize: isMobile ? '1.75rem' : '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
            {reservations.filter(r => r.status === 'NEW').length}
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: isMobile ? '1rem' : '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: isMobile ? '0.95rem' : '1rem' }}>Janitorial Approved</h3>
          <div style={{ fontSize: isMobile ? '1.75rem' : '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
            {reservations.filter(r => r.status === 'JANITORIAL_APPROVED').length}
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: isMobile ? '1rem' : '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: isMobile ? '0.95rem' : '1rem' }}>Fully Approved</h3>
          <div style={{ fontSize: isMobile ? '1.75rem' : '2rem', fontWeight: 'bold', color: '#10b981' }}>
            {reservations.filter(r => r.status === 'FULLY_APPROVED').length}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#0c4a6e' }}>Review Process:</h3>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#0c4a6e' }}>
          <li><strong>NEW:</strong> Review and approve/reject the reservation</li>
          <li><strong>JANITORIAL_APPROVED:</strong> Admin can provide final approval</li>
          <li><strong>FULLY_APPROVED:</strong> Reservation is ready for use</li>
        </ul>
      </div>

      {/* Reservations List */}
      {filteredUpcoming.length === 0 && filteredPast.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#6b7280', marginBottom: '10px' }}>No reservations found</h3>
          <p style={{ color: '#9ca3af' }}>
            {filter === 'all' 
              ? "No reservations have been made yet."
              : `No reservations with status "${filter}" found.`
            }
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Upcoming Reservations */}
          {filteredUpcoming.length > 0 && (
            <>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 16px 0', color: '#1f2937' }}>
                Upcoming Reservations
              </h2>
              {filteredUpcoming.map((reservation) => (
            <div
              key={reservation.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                padding: '24px',
                border: '1px solid #e5e7eb'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                    {reservation.eventName || reservation.amenity.name}
                  </h3>
                  {reservation.eventName && (
                    <p style={{ color: '#6b7280', margin: '0 0 4px 0', fontSize: '14px', fontStyle: 'italic' }}>
                      {reservation.amenity.name}
                    </p>
                  )}
                  <p style={{ color: '#6b7280', margin: '0 0 4px 0', fontSize: '14px' }}>
                    {formatDate(reservation.date)}
                  </p>
                  <p style={{ color: '#9ca3af', margin: 0, fontSize: '12px' }}>
                    Requested by: {reservation.user.firstName} {reservation.user.lastName} ({reservation.user.email})
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {reservation.modificationStatus === 'PENDING' && (
                      <span
                        style={{
                          backgroundColor: '#f59e0b',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        ⚠️ Modification Pending
                      </span>
                    )}
                    <span
                      style={{
                        backgroundColor: getStatusColor(reservation.status),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {getStatusText(reservation.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pending Modification Alert for Janitorial */}
              {reservation.modificationStatus === 'PENDING' && (
                <div style={{ 
                  marginBottom: '16px', 
                  padding: '16px', 
                  backgroundColor: '#fef3c7', 
                  border: '2px solid #f59e0b', 
                  borderRadius: '8px' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px', marginRight: '8px' }}>⚠️</span>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#92400e', margin: 0 }}>
                      Modification Pending - Awaiting Resident Response
                    </h4>
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#78350f' }}>
                    <strong>Reason:</strong> {reservation.modificationReason}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>Original Time:</p>
                      <p style={{ margin: 0, fontSize: '13px', color: '#374151' }}>
                        {formatTimeRange(reservation.partyTimeStart, reservation.partyTimeEnd)}
                      </p>
                    </div>
                    <div style={{ padding: '8px', backgroundColor: '#fef3c7', borderRadius: '4px', border: '1px solid #f59e0b' }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#92400e', fontWeight: 'bold' }}>Proposed Time:</p>
                      <p style={{ margin: 0, fontSize: '13px', color: '#92400e', fontWeight: '600' }}>
                        {reservation.proposedPartyTimeStart && reservation.proposedPartyTimeEnd 
                          ? formatTimeRange(reservation.proposedPartyTimeStart, reservation.proposedPartyTimeEnd)
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px 0' }}>
                    Reservation Time
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    {formatTimeRange(reservation.partyTimeStart, reservation.partyTimeEnd)}
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px 0' }}>
                    Guest Count
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    {reservation.guestCount} people
                  </p>
                </div>
                {reservation.cleaningTimeStart && reservation.cleaningTimeEnd && (
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px 0' }}>
                      Proposed Janitorial Cleaning Time
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#3b82f6' }}>
                      {formatTimeRange(reservation.cleaningTimeStart, reservation.cleaningTimeEnd)}
                      <br />
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        ({formatDate(new Date(reservation.cleaningTimeStart).toISOString().split('T')[0])})
                      </span>
                    </p>
                  </div>
                )}
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px 0' }}>
                    Total Cost
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    <strong>Reservation Fee:</strong> ${parseFloat(String(reservation.totalFee)).toFixed(2)}
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}> (PAID)</span>
                    <br />
                    <strong>Damage Assessment:</strong> Damage fees will be assessed after conclusion of the party. If damages are noted, the resident is responsible for the amount of the repairs.
                  </p>
                </div>
              </div>

              {/* Special Requirements */}
              {reservation.specialRequirements && (
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px 0' }}>
                    Special Requirements
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    {reservation.specialRequirements}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                {canApprove(reservation) && (
                  <button
                    onClick={() => handleApprove(reservation.id)}
                    disabled={actionLoading === reservation.id}
                    style={{
                      backgroundColor: actionLoading === reservation.id ? '#9ca3af' : '#10b981',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: actionLoading === reservation.id ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    {getApprovalButtonText(reservation)}
                  </button>
                )}
                {canReject(reservation) && (
                  <button
                    onClick={() => handleReject(reservation.id)}
                    disabled={actionLoading === reservation.id}
                    style={{
                      backgroundColor: actionLoading === reservation.id ? '#9ca3af' : '#ef4444',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: actionLoading === reservation.id ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    {actionLoading === reservation.id ? 'Processing...' : 'Reject'}
                  </button>
                )}
                {reservation.status === 'NEW' && reservation.modificationStatus === 'PENDING' && (
                  <button
                    onClick={() => handleCancelModification(reservation)}
                    disabled={actionLoading === reservation.id}
                    style={{
                      backgroundColor: actionLoading === reservation.id ? '#9ca3af' : '#f59e0b',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: actionLoading === reservation.id ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    {actionLoading === reservation.id ? 'Processing...' : 'Cancel Proposed Modification - Return Party to original time'}
                  </button>
                )}
                {reservation.status === 'NEW' && reservation.modificationStatus !== 'PENDING' && (
                  <button
                    onClick={() => handleProposeModification(reservation)}
                    disabled={actionLoading === reservation.id}
                    style={{
                      backgroundColor: actionLoading === reservation.id ? '#9ca3af' : '#3b82f6',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: actionLoading === reservation.id ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    Propose Modification
                  </button>
                )}
                {(reservation.status === 'FULLY_APPROVED' || reservation.status === 'JANITORIAL_APPROVED') && (() => {
                  // Only show button if reservation date is today or in the past
                  // Use parseDateString to avoid timezone issues with DATEONLY strings
                  const dateStr = typeof reservation.date === 'string' 
                    ? reservation.date.split('T')[0] 
                    : reservation.date;
                  const reservationDate = parseDateString(dateStr);
                  reservationDate.setHours(0, 0, 0, 0);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isTodayOrPast = reservationDate <= today;
                  
                  return isTodayOrPast ? (
                    <button
                      onClick={() => {
                        setSelectedReservation(reservation);
                        setShowPartyCompleteModal(true);
                      }}
                      disabled={actionLoading === reservation.id}
                      style={{
                        backgroundColor: actionLoading === reservation.id ? '#9ca3af' : '#355B45',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: actionLoading === reservation.id ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginLeft: '8px'
                      }}
                    >
                      Mark Party Complete
                    </button>
                  ) : null;
                })()}
                {reservation.status === 'COMPLETED' && reservation.damageAssessmentPending && !reservation.damageAssessed && (
                  <button
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setShowDamageAssessmentModal(true);
                    }}
                    disabled={actionLoading === reservation.id}
                    style={{
                      backgroundColor: actionLoading === reservation.id ? '#9ca3af' : '#f59e0b',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: actionLoading === reservation.id ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      marginLeft: '8px'
                    }}
                  >
                    Assess Damages
                  </button>
                )}
                {isAdmin && reservation.status === 'COMPLETED' && reservation.damageAssessmentPending && reservation.damageAssessed && reservation.damageAssessmentStatus === 'PENDING' && (
                  <button
                    onClick={() => {
                      setSelectedReview(reservation);
                      setReviewAction('approve');
                      setAdjustedAmount(String(reservation.damageChargeAmount || ''));
                      setAdminNotes('');
                      setShowReviewModal(true);
                    }}
                    disabled={actionLoading === reservation.id}
                    style={{
                      backgroundColor: actionLoading === reservation.id ? '#9ca3af' : '#ef4444',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: actionLoading === reservation.id ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      marginLeft: '8px'
                    }}
                  >
                    Review Damage Assessment
                  </button>
                )}
              </div>
            </div>
          ))}
            </>
          )}

          {/* Past/Completed/Cancelled Reservations - Collapsible */}
          {filteredPast.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <button
                onClick={() => setShowPastReservations(!showPastReservations)}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: showPastReservations ? '16px' : '0'
                }}
              >
                <span>
                  {showPastReservations ? '▼' : '▶'} Past, Completed & Cancelled Reservations ({filteredPast.length})
                </span>
              </button>
              
              {showPastReservations && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
                  {filteredPast.map((reservation) => (
                    <div
                      key={reservation.id}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        padding: '24px',
                        border: '1px solid #e5e7eb',
                        opacity: 0.8
                      }}
                    >
                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                            {reservation.eventName || reservation.amenity.name}
                          </h3>
                          {reservation.eventName && (
                            <p style={{ color: '#6b7280', margin: '0 0 4px 0', fontSize: '14px', fontStyle: 'italic' }}>
                              {reservation.amenity.name}
                            </p>
                          )}
                          <p style={{ color: '#6b7280', margin: '0 0 4px 0', fontSize: '14px' }}>
                            {formatDate(reservation.date)}
                          </p>
                          <p style={{ color: '#9ca3af', margin: 0, fontSize: '12px' }}>
                            Requested by: {reservation.user.firstName} {reservation.user.lastName} ({reservation.user.email})
                          </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                          <span
                            style={{
                              backgroundColor: getStatusColor(reservation.status),
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                          >
                            {getStatusText(reservation.status)}
                          </span>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px 0' }}>
                            Reservation Time
                          </h4>
                          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                            {formatTimeRange(reservation.partyTimeStart, reservation.partyTimeEnd)}
                          </p>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px 0' }}>
                            Guest Count
                          </h4>
                          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                            {reservation.guestCount} people
                          </p>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px 0' }}>
                            Total Cost
                          </h4>
                          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                            <strong>Reservation Fee:</strong> ${parseFloat(String(reservation.totalFee)).toFixed(2)}
                            <span style={{ fontSize: '12px', color: '#9ca3af' }}> (PAID)</span>
                          </p>
                        </div>
                      </div>

                      {/* Special Requirements */}
                      {reservation.specialRequirements && (
                        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px 0' }}>
                            Special Requirements
                          </h4>
                          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                            {reservation.specialRequirements}
                          </p>
                        </div>
                      )}

                      {/* Damage Review Section - Show for completed reservations with damage info */}
                      {reservation.status === 'COMPLETED' && (
                        reservation.damageAssessmentStatus === 'APPROVED' || 
                        reservation.damageAssessmentStatus === 'ADJUSTED' || 
                        reservation.damageAssessmentStatus === 'DENIED' ||
                        reservation.damageAssessed ||
                        reservation.damageCharge !== null
                      ) && (
                        <div style={{ 
                          marginTop: '16px', 
                          padding: '12px', 
                          backgroundColor: reservation.damageAssessmentStatus === 'DENIED' ? '#f0f9ff' : '#fef2f2', 
                          borderRadius: '4px',
                          border: `1px solid ${reservation.damageAssessmentStatus === 'DENIED' ? '#0ea5e9' : '#fecaca'}`
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: 0 }}>
                              Damage Assessment
                            </h4>
                            <button
                              onClick={() => {
                                setSelectedDamageView(reservation);
                                setShowDamageViewModal(true);
                              }}
                              style={{
                                padding: '4px 12px',
                                backgroundColor: '#355B45',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}
                            >
                              View Details
                            </button>
                          </div>
                          {reservation.damageAssessmentStatus && (
                            <p style={{ margin: '4px 0', fontSize: '13px', color: '#6b7280' }}>
                              <strong>Status:</strong> {
                                reservation.damageAssessmentStatus === 'APPROVED' ? '✓ Approved' :
                                reservation.damageAssessmentStatus === 'ADJUSTED' ? '⚠ Adjusted' :
                                reservation.damageAssessmentStatus === 'DENIED' ? '✗ Denied' :
                                reservation.damageAssessmentStatus === 'PENDING' ? '⏳ Pending Review' :
                                'Unknown'
                              }
                            </p>
                          )}
                          {reservation.damageCharge !== null && reservation.damageCharge !== undefined && (
                            <p style={{ margin: '4px 0', fontSize: '13px', color: '#6b7280' }}>
                              <strong>Charge:</strong> ${parseFloat(String(reservation.damageCharge)).toFixed(2)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* No reservations message */}
          {filteredUpcoming.length === 0 && filteredPast.length === 0 && (
            <div style={{ textAlign: 'center', padding: '50px', color: '#6b7280', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <p>
                {filter === 'all'
                  ? 'No reservations found.'
                  : `No reservations with status "${filter}" found.`
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Cleaning Time Modal */}
      {showCleaningTimeModal && selectedReservation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>
              Set Cleaning Time
            </h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                <strong>Reservation:</strong> {selectedReservation.eventName || selectedReservation.amenity.name} on {formatDate(selectedReservation.date)}
              </p>
              <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                <strong>Reservation Time:</strong> {formatTimeRange(selectedReservation.partyTimeStart, selectedReservation.partyTimeEnd)}
              </p>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                <strong>Reservation Ends:</strong> {formatTime(selectedReservation.partyTimeEnd)}
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                Cleaning Start Date *
              </label>
              <input
                type="date"
                value={cleaningTime.startDate}
                onChange={(e) => setCleaningTime(prev => ({ ...prev, startDate: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  marginBottom: '0.5rem'
                }}
                required
              />
              <SimpleTimeSelector
                label="Cleaning Start Time"
                value={cleaningTime.startTime}
                onChange={(value) => setCleaningTime(prev => ({ ...prev, startTime: value }))}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                Cleaning End Date *
              </label>
              <input
                type="date"
                value={cleaningTime.endDate}
                onChange={(e) => setCleaningTime(prev => ({ ...prev, endDate: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  marginBottom: '0.5rem'
                }}
                required
              />
              <SimpleTimeSelector
                label="Cleaning End Time"
                value={cleaningTime.endTime}
                onChange={(value) => setCleaningTime(prev => ({ ...prev, endTime: value }))}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCleaningTimeCancel}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCleaningTimeSubmit}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Approve with Cleaning Time
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Party Complete Modal */}
      {showPartyCompleteModal && selectedReservation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>
              Party Completion
            </h2>
            
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Did you find any damages?
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <button
                onClick={() => handlePartyComplete(false)}
                disabled={actionLoading === selectedReservation.id}
                style={{
                  flex: 1,
                  backgroundColor: actionLoading === selectedReservation.id ? '#9ca3af' : '#10b981',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: actionLoading === selectedReservation.id ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                No Damages Found
              </button>
              <button
                onClick={() => handlePartyComplete(true)}
                disabled={actionLoading === selectedReservation.id}
                style={{
                  flex: 1,
                  backgroundColor: actionLoading === selectedReservation.id ? '#9ca3af' : '#f59e0b',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: actionLoading === selectedReservation.id ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Damages Found
              </button>
            </div>

            <button
              onClick={() => {
                setShowPartyCompleteModal(false);
                setSelectedReservation(null);
              }}
              style={{
                width: '100%',
                backgroundColor: '#e5e7eb',
                color: '#374151',
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Damage Assessment Modal */}
      {showDamageAssessmentModal && selectedReservation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>
              Damage Assessment
            </h2>
            
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              <strong>Reservation:</strong> {selectedReservation.amenity.name} - {selectedReservation.user.firstName} {selectedReservation.user.lastName}
              <br />
              <strong>Date:</strong> {formatDate(selectedReservation.date)}
              <br />
              <strong>Max Damage Fee:</strong> ${parseFloat(String(selectedReservation.amenity?.deposit || selectedReservation.totalDeposit)).toFixed(2)}
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                Damage Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max={parseFloat(String(selectedReservation.amenity?.deposit || selectedReservation.totalDeposit))}
                value={damageAssessment.amount}
                onChange={(e) => setDamageAssessment(prev => ({ ...prev, amount: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                Damage Description *
              </label>
              <textarea
                value={damageAssessment.description}
                onChange={(e) => setDamageAssessment(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Describe the damages found..."
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                Additional Notes (Optional)
              </label>
              <textarea
                value={damageAssessment.notes}
                onChange={(e) => setDamageAssessment(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Any additional notes..."
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleDamageAssessment}
                disabled={actionLoading === selectedReservation.id}
                style={{
                  flex: 1,
                  backgroundColor: actionLoading === selectedReservation.id ? '#9ca3af' : '#355B45',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: actionLoading === selectedReservation.id ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {actionLoading === selectedReservation.id ? 'Submitting...' : 'Submit for Admin Review'}
              </button>
              <button
                onClick={() => {
                  setShowDamageAssessmentModal(false);
                  setSelectedReservation(null);
                  setDamageAssessment({ amount: '', description: '', notes: '' });
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modification Proposal Modal */}
      {showModificationModal && selectedReservation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>
              Propose Modification
            </h2>
            
            <div style={{ marginBottom: '1rem', padding: '12px', backgroundColor: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '4px' }}>
              <p style={{ margin: '0 0 4px 0', color: '#0c4a6e', fontWeight: 'bold' }}>Current Reservation:</p>
              <p style={{ margin: '0 0 4px 0', color: '#0c4a6e' }}>
                <strong>Date:</strong> {formatDate(selectedReservation.date)}
              </p>
              <p style={{ margin: 0, color: '#0c4a6e' }}>
                <strong>Time:</strong> {formatTimeRange(selectedReservation.partyTimeStart, selectedReservation.partyTimeEnd)}
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                Proposed Start Time *
              </label>
              <SimpleTimeSelector
                value={modificationProposal.proposedPartyTimeStart}
                onChange={(time) => setModificationProposal(prev => ({ ...prev, proposedPartyTimeStart: time }))}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                Proposed End Time *
              </label>
              <SimpleTimeSelector
                value={modificationProposal.proposedPartyTimeEnd}
                onChange={(time) => setModificationProposal(prev => ({ ...prev, proposedPartyTimeEnd: time }))}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                Reason for Modification *
              </label>
              <textarea
                value={modificationProposal.modificationReason}
                onChange={(e) => setModificationProposal(prev => ({ ...prev, modificationReason: e.target.value }))}
                rows={4}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Explain why this modification is needed..."
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowModificationModal(false);
                  setSelectedReservation(null);
                  setModificationProposal({
                    proposedDate: '',
                    proposedPartyTimeStart: '',
                    proposedPartyTimeEnd: '',
                    modificationReason: ''
                  });
                }}
                style={{
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleModificationSubmit}
                disabled={
                  actionLoading === selectedReservation.id ||
                  !modificationProposal.proposedPartyTimeStart ||
                  !modificationProposal.proposedPartyTimeEnd ||
                  !modificationProposal.modificationReason.trim()
                }
                style={{
                  backgroundColor: (
                    actionLoading === selectedReservation.id ||
                    !modificationProposal.proposedPartyTimeStart ||
                    !modificationProposal.proposedPartyTimeEnd ||
                    !modificationProposal.modificationReason.trim()
                  ) ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: (
                    actionLoading === selectedReservation.id ||
                    !modificationProposal.proposedPartyTimeStart ||
                    !modificationProposal.proposedPartyTimeEnd ||
                    !modificationProposal.modificationReason.trim()
                  ) ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                {actionLoading === selectedReservation.id ? 'Submitting...' : 'Propose Modification'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Damage Assessment Modal */}
      {showReviewModal && selectedReview && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowReviewModal(false);
              setSelectedReview(null);
              setReviewAction('approve');
              setAdjustedAmount('');
              setAdminNotes('');
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
          >
            {/* Sticky Close Button */}
            <button
              onClick={() => {
                setShowReviewModal(false);
                setSelectedReview(null);
                setReviewAction('approve');
                setAdjustedAmount('');
                setAdminNotes('');
              }}
              style={{
                position: 'sticky',
                top: '1rem',
                right: '1rem',
                float: 'right',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'background-color 0.2s',
                fontFamily: 'Arial, sans-serif',
                lineHeight: 1,
                marginBottom: '-40px',
                marginTop: '-2rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
              }}
            >
              ×
            </button>

            <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>
              Review Damage Assessment
            </h2>
            
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
              <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                <strong>Reservation:</strong> {selectedReview.amenity?.name} - {selectedReview.user?.firstName} {selectedReview.user?.lastName}
              </p>
              <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                <strong>Date:</strong> {new Date(selectedReview.date).toLocaleDateString()}
              </p>
              <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                <strong>Assessed Amount:</strong> ${parseFloat(String(selectedReview.damageChargeAmount || 0)).toFixed(2)}
              </p>
              <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                <strong>Max Damage Fee:</strong> ${parseFloat(String(selectedReview.amenity?.deposit || selectedReview.totalDeposit)).toFixed(2)}
              </p>
              <p style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>
                <strong>Description:</strong> {selectedReview.damageDescription}
              </p>
              {selectedReview.damageNotes && (
                <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>
                  <strong>Notes:</strong> {selectedReview.damageNotes}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                Action
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setReviewAction('approve')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '2px solid',
                    borderColor: reviewAction === 'approve' ? '#10b981' : '#d1d5db',
                    backgroundColor: reviewAction === 'approve' ? '#d1fae5' : 'white',
                    color: reviewAction === 'approve' ? '#059669' : '#374151',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: reviewAction === 'approve' ? '600' : '400'
                  }}
                >
                  Approve as-is
                </button>
                <button
                  onClick={() => setReviewAction('adjust')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '2px solid',
                    borderColor: reviewAction === 'adjust' ? '#f59e0b' : '#d1d5db',
                    backgroundColor: reviewAction === 'adjust' ? '#fef3c7' : 'white',
                    color: reviewAction === 'adjust' ? '#d97706' : '#374151',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: reviewAction === 'adjust' ? '600' : '400'
                  }}
                >
                  Adjust Amount
                </button>
                <button
                  onClick={() => setReviewAction('deny')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '2px solid',
                    borderColor: reviewAction === 'deny' ? '#ef4444' : '#d1d5db',
                    backgroundColor: reviewAction === 'deny' ? '#fee2e2' : 'white',
                    color: reviewAction === 'deny' ? '#dc2626' : '#374151',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: reviewAction === 'deny' ? '600' : '400'
                  }}
                >
                  Deny
                </button>
              </div>
            </div>

            {reviewAction === 'adjust' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                  Adjusted Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={parseFloat(String(selectedReview.amenity?.deposit || selectedReview.totalDeposit))}
                  value={adjustedAmount}
                  onChange={(e) => setAdjustedAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                Admin Notes (Optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Add notes about your decision..."
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleReviewDamageAssessment}
                disabled={actionLoading === selectedReview.id}
                style={{
                  flex: 1,
                  backgroundColor: actionLoading === selectedReview.id ? '#9ca3af' : '#355B45',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: actionLoading === selectedReview.id ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {actionLoading === selectedReview.id ? 'Processing...' : 'Submit Review'}
              </button>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedReview(null);
                  setReviewAction('approve');
                  setAdjustedAmount('');
                  setAdminNotes('');
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Damage Review View Modal (for viewing completed damage assessments) */}
      {showDamageViewModal && selectedDamageView && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDamageViewModal(false);
              setSelectedDamageView(null);
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
          >
            {/* Sticky Close Button */}
            <button
              onClick={() => {
                setShowDamageViewModal(false);
                setSelectedDamageView(null);
              }}
              style={{
                position: 'sticky',
                top: '1rem',
                right: '1rem',
                float: 'right',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'background-color 0.2s',
                fontFamily: 'Arial, sans-serif',
                lineHeight: 1,
                marginBottom: '-40px',
                marginTop: '-2rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
              }}
            >
              ×
            </button>

            <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>
              Damage Assessment Details
            </h2>
            
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
              <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                <strong>Reservation:</strong> {selectedDamageView.amenity?.name}
                {selectedDamageView.eventName && ` - ${selectedDamageView.eventName}`}
              </p>
              <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                <strong>Date:</strong> {formatDate(selectedDamageView.date)}
              </p>
              <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                <strong>Resident:</strong> {selectedDamageView.user?.firstName} {selectedDamageView.user?.lastName}
              </p>
              <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                <strong>Status:</strong> {
                  selectedDamageView.damageAssessmentStatus === 'APPROVED' ? '✓ Approved' :
                  selectedDamageView.damageAssessmentStatus === 'ADJUSTED' ? '⚠ Adjusted' :
                  selectedDamageView.damageAssessmentStatus === 'DENIED' ? '✗ Denied' :
                  selectedDamageView.damageAssessmentStatus === 'PENDING' ? '⏳ Pending Review' :
                  'Not Assessed'
                }
              </p>
            </div>

            {selectedDamageView.damageDescription && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
                  Damage Description
                </h3>
                <p style={{ margin: 0, color: '#6b7280', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                  {selectedDamageView.damageDescription}
                </p>
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
                Charges
              </h3>
              <div style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                {selectedDamageView.damageChargeAmount !== null && selectedDamageView.damageChargeAmount !== undefined && (
                  <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                    <strong>Assessed Amount:</strong> ${parseFloat(String(selectedDamageView.damageChargeAmount)).toFixed(2)}
                  </p>
                )}
                {selectedDamageView.damageChargeAdjusted !== null && selectedDamageView.damageChargeAdjusted !== undefined && (
                  <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                    <strong>Adjusted Amount:</strong> ${parseFloat(String(selectedDamageView.damageChargeAdjusted)).toFixed(2)}
                  </p>
                )}
                {selectedDamageView.damageCharge !== null && selectedDamageView.damageCharge !== undefined ? (
                  <p style={{ margin: 0, color: '#1f2937', fontSize: '1.125rem', fontWeight: 'bold' }}>
                    <strong>Final Charge:</strong> ${parseFloat(String(selectedDamageView.damageCharge)).toFixed(2)}
                  </p>
                ) : selectedDamageView.damageAssessmentStatus === 'DENIED' ? (
                  <p style={{ margin: 0, color: '#059669', fontSize: '1rem', fontWeight: '600' }}>
                    No charge applied
                  </p>
                ) : (
                  <p style={{ margin: 0, color: '#6b7280' }}>
                    No charge
                  </p>
                )}
              </div>
            </div>

            {selectedDamageView.damageNotes && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
                  Assessment Notes
                </h3>
                <p style={{ margin: 0, color: '#6b7280', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                  {selectedDamageView.damageNotes}
                </p>
              </div>
            )}

            {selectedDamageView.adminDamageNotes && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
                  Admin Notes
                </h3>
                <p style={{ margin: 0, color: '#6b7280', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                  {selectedDamageView.adminDamageNotes}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button
                onClick={() => {
                  setShowDamageViewModal(false);
                  setSelectedDamageView(null);
                }}
                style={{
                  backgroundColor: '#355B45',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JanitorialPage;
