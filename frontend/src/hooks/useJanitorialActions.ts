import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Reservation {
  id: number;
  date: string;
  status: 'NEW' | 'JANITORIAL_APPROVED' | 'FULLY_APPROVED' | 'CANCELLED' | 'COMPLETED';
  damageAssessmentPending?: boolean;
  amenity: {
    janitorialRequired?: boolean;
  };
}

export const useJanitorialActions = () => {
  const { isJanitorial, currentCommunity } = useAuth();
  const [pendingActionsCount, setPendingActionsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isJanitorial || !currentCommunity) {
      setPendingActionsCount(0);
      setLoading(false);
      return;
    }

    const fetchPendingActions = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`${apiUrl}/api/reservations/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const reservations: Reservation[] = response.data.reservations || [];
        
        // Count actions that need janitorial review/completion
        let count = 0;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        reservations.forEach((reservation) => {
          const reservationDate = new Date(reservation.date);
          reservationDate.setHours(0, 0, 0, 0);
          const isPast = reservationDate < now;
          const isCompleted = reservation.status === 'COMPLETED';
          const isCancelled = reservation.status === 'CANCELLED';
          
          // 1. NEW reservations that need janitorial approval
          if (reservation.status === 'NEW' && 
              reservation.amenity.janitorialRequired !== false &&
              !isPast && !isCompleted && !isCancelled) {
            count++;
          }
          
          // 2. FULLY_APPROVED or JANITORIAL_APPROVED reservations that need to be marked complete (upcoming)
          if ((reservation.status === 'FULLY_APPROVED' || reservation.status === 'JANITORIAL_APPROVED') &&
              !isPast && !isCompleted && !isCancelled) {
            count++;
          }
          
          // 3. COMPLETED reservations that need damage assessment
          if (reservation.status === 'COMPLETED' && 
              reservation.damageAssessmentPending === true) {
            count++;
          }
        });
        
        setPendingActionsCount(count);
      } catch (err) {
        console.error('Error fetching janitorial actions:', err);
        setPendingActionsCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingActions();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingActions, 30000);
    
    return () => clearInterval(interval);
  }, [isJanitorial, currentCommunity]);

  return { pendingActionsCount, loading };
};

