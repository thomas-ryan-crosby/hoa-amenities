import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface CalendarEvent {
  id: number;
  title: string;
  start: string;
  end: string;
  date: string;
  amenityId: number;
  amenityName: string;
  userName: string;
  userEmail: string;
  guestCount: number;
  status: string;
  eventName?: string | null;
  isPrivate?: boolean;
  setupTime: { start: string; end: string };
  partyTime: { start: string; end: string };
  cleaningTime?: { start: string; end: string };
  specialRequirements?: string;
  totalFee: number | string;
  totalDeposit: number | string;
  color: string;
}

interface Amenity {
  id: number;
  name: string;
  reservationFee: number | string;
  deposit: number | string;
  capacity: number;
}

interface CalendarProps {
  onDateClick?: (date: string) => void;
  refreshTrigger?: number;
}

const Calendar: React.FC<CalendarProps> = ({ onDateClick, refreshTrigger }) => {
  const { user, isAuthenticated } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [selectedAmenity, setSelectedAmenity] = useState<number | 'all'>('all');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  useEffect(() => {
    fetchAmenities();
  }, []);

  useEffect(() => {
    if (amenities.length > 0) {
      fetchEvents();
    }
  }, [currentDate, selectedAmenity, amenities, refreshTrigger]);

  const fetchAmenities = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/amenities`);
      setAmenities(response.data);
    } catch (err) {
      setError('Failed to load amenities');
      console.error('Error fetching amenities:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      // Calculate date range based on current view
      const startDate = getStartDate();
      const endDate = getEndDate();
      
      // Use local date components to avoid timezone shifts
      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const params = new URLSearchParams({
        startDate: formatDate(startDate),
        endDate: formatDate(endDate)
      });
      
      if (selectedAmenity !== 'all') {
        params.append('amenityId', selectedAmenity.toString());
      }

      const response = await axios.get(`${apiUrl}/api/calendar/events?${params}`);
      setEvents(response.data.events);
      
      // Debug: Log all events and their dates
      console.log('📅 All events loaded:', response.data.events.map((e: CalendarEvent) => `${e.title} - Date: ${e.date}, Start: ${e.start}, End: ${e.end}`));
      
    } catch (err) {
      setError('Failed to load calendar events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = (): Date => {
    const date = new Date(currentDate);
    switch (view) {
      case 'month':
        date.setDate(1);
        // Start on Monday instead of Sunday
        const dayOfWeek = date.getDay();
        const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday (0), go back 6 days to get Monday
        date.setDate(date.getDate() + daysToMonday);
        break;
      case 'week':
        // Start on Monday instead of Sunday
        const dayOfWeekWeek = date.getDay();
        const daysToMondayWeek = dayOfWeekWeek === 0 ? -6 : 1 - dayOfWeekWeek; // If Sunday (0), go back 6 days to get Monday
        date.setDate(date.getDate() + daysToMondayWeek);
        break;
    }
    return date;
  };

  const getEndDate = (): Date => {
    const date = new Date(currentDate);
    switch (view) {
      case 'month':
        date.setMonth(date.getMonth() + 1, 0); // Last day of month
        date.setDate(date.getDate() + (6 - date.getDay())); // End of week
        break;
      case 'week':
        date.setDate(date.getDate() + 6); // End of week
        break;
    }
    return date;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'month':
        // Use setFullYear and setMonth to avoid month boundary issues
        const year = newDate.getFullYear();
        const month = newDate.getMonth();
        const day = newDate.getDate();
        if (direction === 'next') {
          // Move to next month, keeping the same day (or last day if invalid)
          newDate.setFullYear(year, month + 1, 1);
          // If original day exceeds days in new month, keep last day of month
          const lastDay = new Date(year, month + 2, 0).getDate();
          newDate.setDate(Math.min(day, lastDay));
        } else {
          // Move to previous month, keeping the same day (or last day if invalid)
          newDate.setFullYear(year, month - 1, 1);
          const lastDay = new Date(year, month, 0).getDate();
          newDate.setDate(Math.min(day, lastDay));
        }
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up to date click
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const closeEventDetails = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  const handleDateClick = (date: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent event from bubbling up
    }
    if (isAuthenticated && onDateClick) {
      onDateClick(date);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Helper function to safely parse YYYY-MM-DD date string without timezone issues
  const parseDateString = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
  };

  const getDaysInView = (): Date[] => {
    if (view === 'week') {
      // For week view, show exactly 7 days starting from Monday
      const days: Date[] = [];
      
      // Find the Monday of the current week
      const today = new Date(currentDate);
      const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, 2=Tuesday, etc.
      
      // Calculate how many days to subtract to get to Monday
      let daysToSubtract;
      if (dayOfWeek === 0) { // Sunday
        daysToSubtract = 6; // Go back 6 days to Monday
      } else {
        daysToSubtract = dayOfWeek - 1; // Go back to Monday
      }
      
      // Get Monday
      const monday = new Date(today);
      monday.setDate(today.getDate() - daysToSubtract);
      
      // Add 7 days starting from Monday
      for (let i = 0; i < 7; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        days.push(day);
      }
      
      return days;
    } else {
      // For month view, use the existing logic
      const days: Date[] = [];
      const start = getStartDate();
      const end = getEndDate();
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
      }
      
      return days;
    }
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    // Use local date format instead of UTC to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const dayEvents = events.filter(event => event.date === dateStr);
    
    return dayEvents;
  };

  const renderMonthView = () => {
    const days = getDaysInView();
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#e5e7eb' }}>
        {/* Header */}
        {weekDays.map(day => (
          <div key={day} style={{ 
            backgroundColor: '#f3f4f6', 
            padding: '8px', 
            textAlign: 'center', 
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            {day}
          </div>
        ))}
        
        {/* Days */}
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
          
          // Group events by amenity
          // Filter events - include "Pool + Clubroom" in both Clubroom and Pool columns
          const clubroomEvents = dayEvents.filter(event => 
            event.amenityName === 'Clubroom' || event.amenityName === 'Pool + Clubroom'
          );
          const poolEvents = dayEvents.filter(event => 
            event.amenityName === 'Pool' || event.amenityName === 'Pool + Clubroom'
          );
          const otherEvents = dayEvents.filter(event => 
            event.amenityName !== 'Clubroom' && 
            event.amenityName !== 'Pool' && 
            event.amenityName !== 'Pool + Clubroom'
          );
          
          // Calculate date string for this cell
          const year = day.getFullYear();
          const month = String(day.getMonth() + 1).padStart(2, '0');
          const dayNum = String(day.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${dayNum}`;
          
          return (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                minHeight: '120px',
                padding: '4px',
                border: '1px solid #e5e7eb',
                cursor: (isAuthenticated && !isPast) ? 'pointer' : 'default',
                opacity: isPast ? 0.4 : 1,
                position: 'relative'
              }}
              onClick={(e) => {
                if (!isPast) {
                  handleDateClick(dateStr, e);
                }
              }}
            >
              <div style={{
                fontSize: '14px',
                fontWeight: isToday ? 'bold' : 'normal',
                color: isCurrentMonth ? (isToday ? '#355B45' : isPast ? '#9ca3af' : '#374151') : '#9ca3af',
                marginBottom: '4px'
              }}>
                {day.getDate()}
                {/* Debug: Show calendar cell date */}
                <div style={{
                  fontSize: '8px',
                  color: 'red',
                  fontWeight: 'bold',
                  marginTop: '2px'
                }}>
                  {dateStr}
                </div>
              </div>
              
              
              {/* Events - Side-by-side blocks */}
              <div style={{ 
                position: 'absolute', 
                bottom: '4px', 
                left: '4px', 
                right: '4px',
                top: '30px', // Constrain to cell height
                display: 'flex',
                gap: '2px',
                zIndex: 1,
                overflow: 'hidden' // Prevent overflow
              }}>
                {/* Clubroom events - Always left half (50% width) */}
                <div style={{ 
                  flex: '0 0 calc(50% - 1px)', 
                  display: 'flex', 
                  flexDirection: 'column',
                  maxWidth: 'calc(50% - 1px)',
                  overflow: 'hidden'
                }}>
                  {dayEvents.filter(event => event.amenityName === 'Clubroom' || event.amenityName === 'Pool + Clubroom').slice(0, 2).map((event, eventIndex) => {
                    // Simple morning/afternoon logic
                    const eventStart = new Date(event.start);
                    const eventEnd = new Date(event.end);
                    const startHour = eventStart.getHours();
                    const endHour = eventEnd.getHours();
                    
                    // Determine height based on timing
                    let heightStyle;
                    if (startHour < 12 && endHour < 12) {
                      // Morning only - smaller height
                      heightStyle = { minHeight: '20px', maxHeight: '25px' };
                    } else if (startHour >= 12 && endHour >= 12) {
                      // Afternoon only - smaller height
                      heightStyle = { minHeight: '20px', maxHeight: '25px' };
                    } else {
                      // Morning to afternoon - larger height
                      heightStyle = { minHeight: '35px', maxHeight: '40px' };
                    }
                    
                    // Check if this event has cleaning time
                    const hasCleaningTime = event.cleaningTime && event.cleaningTime.start && event.cleaningTime.end;
                    
                    // Determine status color
                    let statusColor;
                    switch (event.status) {
                      case 'NEW':
                        statusColor = '#6b7280'; // Grey
                        break;
                      case 'JANITORIAL_APPROVED':
                        statusColor = '#f59e0b'; // Yellow
                        break;
                      case 'FULLY_APPROVED':
                        statusColor = '#10b981'; // Green
                        break;
                      default:
                        statusColor = '#6b7280'; // Grey
                    }

                    // Check if event is completed
                    const isCompleted = event.status === 'COMPLETED';
                    
                    return (
                      <div
                        key={`clubroom-${eventIndex}`}
                        onClick={(e) => handleEventClick(event, e)}
                        style={{
                          width: '100%',
                          backgroundColor: '#9333ea', // Purple for Clubroom
                          borderRadius: '4px',
                          padding: '2px',
                          color: 'white',
                          fontSize: '7px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          marginBottom: '1px',
                          position: 'relative', // Ensure status indicator positions relative to this block
                          boxSizing: 'border-box', // Include padding and border in width calculation
                          ...heightStyle,
                          opacity: isCompleted ? 0.5 : 1, // Make completed events more transparent
                          textDecoration: isCompleted ? 'line-through' : 'none', // Strikethrough for completed
                          border: isCompleted ? '1px dashed rgba(255,255,255,0.5)' : 'none' // Dashed border for completed
                        }}
                        title={`Clubroom - ${event.title} (${new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}) - Status: ${event.status}${isCompleted ? ' (Completed)' : ''}`}
                      >
                        {/* Status indicator */}
                        <div style={{
                          position: 'absolute',
                          top: '1px',
                          right: '1px',
                          width: '4px',
                          height: '4px',
                          backgroundColor: statusColor,
                          borderRadius: '50%',
                          border: '1px solid white'
                        }}></div>
                        
                        <div style={{ 
                          textAlign: 'center',
                          lineHeight: '1.2',
                          width: '100%',
                          overflow: 'hidden',
                          paddingRight: '6px' // Make room for status indicator
                        }}>
                          {/* Show actual event name for admin/janitorial, or title for others */}
                          {(user?.role === 'admin' || user?.role === 'janitorial') && event.eventName && event.isPrivate
                            ? `${event.eventName} (Private)`
                            : event.title}
                        <div style={{ 
                          fontSize: '5px', 
                          color: 'red', 
                          marginTop: '1px',
                          fontWeight: 'bold'
                        }}>
                          DB: {event.date} | {new Date(event.partyTime.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.partyTime.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Cleaning blocks for Clubroom events */}
                  {dayEvents.filter(event => (event.amenityName === 'Clubroom' || event.amenityName === 'Pool + Clubroom') && event.cleaningTime && event.cleaningTime.start && event.cleaningTime.end).map((event, cleanIndex) => {
                    const cleaningStart = new Date(event.cleaningTime!.start);
                    const cleaningEnd = new Date(event.cleaningTime!.end);
                    const cleanStartHour = cleaningStart.getHours();
                    const cleanEndHour = cleaningEnd.getHours();
                    const isCompleted = event.status === 'COMPLETED';
                    
                    // Determine height based on cleaning time duration
                    let heightStyle;
                    if (cleanStartHour < 12 && cleanEndHour < 12) {
                      heightStyle = { minHeight: '20px', maxHeight: '25px' };
                    } else if (cleanStartHour >= 12 && cleanEndHour >= 12) {
                      heightStyle = { minHeight: '20px', maxHeight: '25px' };
                    } else {
                      heightStyle = { minHeight: '35px', maxHeight: '40px' };
                    }
                    
                    return (
                      <div
                        key={`cleaning-clubroom-${cleanIndex}`}
                        style={{
                          width: '100%',
                          backgroundColor: '#fca5a5', // Light red for cleaning
                          borderRadius: '4px',
                          padding: '2px',
                          color: '#7f1d1d', // Dark red text
                          fontSize: '7px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          marginBottom: '1px',
                          position: 'relative',
                          boxSizing: 'border-box',
                          ...heightStyle,
                          border: '1px dashed #dc2626', // Dashed border to indicate non-bookable
                          opacity: isCompleted ? 0.4 : 0.8, // More transparent if completed
                          textDecoration: isCompleted ? 'line-through' : 'none' // Strikethrough for completed
                        }}
                        title={`Cleaning Time - Clubroom unavailable (${new Date(event.cleaningTime!.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.cleaningTime!.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})${isCompleted ? ' - Completed' : ''}`}
                      >
                        <div style={{ 
                          textAlign: 'center',
                          lineHeight: '1.2',
                          width: '100%',
                          overflow: 'hidden'
                        }}>
                          Cleaning
                          <div style={{ 
                            fontSize: '5px', 
                            color: '#991b1b',
                            marginTop: '1px',
                            fontWeight: 'bold'
                          }}>
                            {new Date(event.cleaningTime!.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.cleaningTime!.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Pool events - Always right half (50% width) */}
                <div style={{ 
                  flex: '0 0 calc(50% - 1px)', 
                  display: 'flex', 
                  flexDirection: 'column',
                  maxWidth: 'calc(50% - 1px)',
                  overflow: 'hidden'
                }}>
                  {dayEvents.filter(event => event.amenityName === 'Pool' || event.amenityName === 'Pool + Clubroom').slice(0, 2).map((event, eventIndex) => {
                    // Simple morning/afternoon logic
                    const eventStart = new Date(event.start);
                    const eventEnd = new Date(event.end);
                    const startHour = eventStart.getHours();
                    const endHour = eventEnd.getHours();
                    
                    // Determine height based on timing
                    let heightStyle;
                    if (startHour < 12 && endHour < 12) {
                      // Morning only - smaller height
                      heightStyle = { minHeight: '20px', maxHeight: '25px' };
                    } else if (startHour >= 12 && endHour >= 12) {
                      // Afternoon only - smaller height
                      heightStyle = { minHeight: '20px', maxHeight: '25px' };
                    } else {
                      // Morning to afternoon - larger height
                      heightStyle = { minHeight: '35px', maxHeight: '40px' };
                    }
                    
                    // Determine status color
                    let statusColor;
                    switch (event.status) {
                      case 'NEW':
                        statusColor = '#6b7280'; // Grey
                        break;
                      case 'JANITORIAL_APPROVED':
                        statusColor = '#f59e0b'; // Yellow
                        break;
                      case 'FULLY_APPROVED':
                        statusColor = '#10b981'; // Green
                        break;
                      default:
                        statusColor = '#6b7280'; // Grey
                    }

                    // Check if event is completed
                    const isCompleted = event.status === 'COMPLETED';
                    
                    return (
                      <div
                        key={`pool-${eventIndex}`}
                        onClick={(e) => handleEventClick(event, e)}
                        style={{
                          width: '100%',
                          backgroundColor: '#3b82f6', // Blue for Pool
                          borderRadius: '4px',
                          padding: '2px',
                          color: 'white',
                          fontSize: '7px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          marginBottom: '1px',
                          position: 'relative', // Ensure status indicator positions relative to this block
                          boxSizing: 'border-box', // Include padding and border in width calculation
                          ...heightStyle,
                          opacity: isCompleted ? 0.5 : 1, // Make completed events more transparent
                          textDecoration: isCompleted ? 'line-through' : 'none', // Strikethrough for completed
                          border: isCompleted ? '1px dashed rgba(255,255,255,0.5)' : 'none' // Dashed border for completed
                        }}
                        title={`Pool - ${event.title} (${new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}) - Status: ${event.status}${isCompleted ? ' (Completed)' : ''}`}
                      >
                        {/* Status indicator */}
                        <div style={{
                          position: 'absolute',
                          top: '1px',
                          right: '1px',
                          width: '4px',
                          height: '4px',
                          backgroundColor: statusColor,
                          borderRadius: '50%',
                          border: '1px solid white'
                        }}></div>
                        
                        <div style={{ 
                          textAlign: 'center',
                          lineHeight: '1.2',
                          width: '100%',
                          overflow: 'hidden',
                          paddingRight: '6px' // Make room for status indicator
                        }}>
                          {/* Show actual event name for admin/janitorial, or title for others */}
                          {(user?.role === 'admin' || user?.role === 'janitorial') && event.eventName && event.isPrivate
                            ? `${event.eventName} (Private)`
                            : event.title}
                        <div style={{ 
                          fontSize: '5px', 
                          color: 'red', 
                          marginTop: '1px',
                          fontWeight: 'bold'
                        }}>
                          DB: {event.date} | {new Date(event.partyTime.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.partyTime.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getDaysInView();
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Create exactly 12 time blocks from 0:00 to 24:00 (2-hour increments)
    const timeBlocks = [
      '00:00 - 02:00',
      '02:00 - 04:00', 
      '04:00 - 06:00',
      '06:00 - 08:00',
      '08:00 - 10:00',
      '10:00 - 12:00',
      '12:00 - 14:00',
      '14:00 - 16:00',
      '16:00 - 18:00',
      '18:00 - 20:00',
      '20:00 - 22:00',
      '22:00 - 24:00'
    ];
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '120px repeat(7, 1fr)', 
          gap: '1px', 
          backgroundColor: '#e5e7eb' 
        }}>
          <div style={{ 
            backgroundColor: '#f3f4f6', 
            padding: '8px', 
            textAlign: 'center', 
            fontWeight: 'bold' 
          }}>
            Time
          </div>
          {days.map((day, index) => {
            const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNumber = day.getDate();
            return (
              <div key={index} style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '8px', 
                textAlign: 'center', 
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {dayName} {dayNumber}
              </div>
            );
          })}
        </div>
        
        {/* Time blocks - EXACTLY 12 ROWS */}
        {timeBlocks.map((timeLabel, timeIndex) => {
          return (
            <div key={timeIndex} style={{ 
              display: 'grid', 
              gridTemplateColumns: '120px repeat(7, 1fr)', 
              gap: '1px', 
              backgroundColor: '#e5e7eb' 
            }}>
              {/* Time label */}
              <div style={{ 
                backgroundColor: '#f9fafb', 
                padding: '8px', 
                textAlign: 'center', 
                fontSize: '11px',
                borderRight: '1px solid #e5e7eb',
                color: '#374151',
                fontWeight: '500'
              }}>
                {timeLabel}
              </div>
              
              {/* Day cells - EXACTLY 7 COLUMNS */}
              {days.map((day, dayIndex) => {
                // Use local date format instead of UTC to avoid timezone issues
                const year = day.getFullYear();
                const month = String(day.getMonth() + 1).padStart(2, '0');
                const dayNum = String(day.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${dayNum}`;
                const now = new Date();
                const cellDateTime = new Date(day);
                cellDateTime.setHours(timeIndex * 2, 0, 0, 0); // Set to start of time block
                const isPast = cellDateTime < now;
                
                // Get all events for this day
                const dayEvents = events.filter(event => {
                  const eventDate = new Date(event.start);
                  return eventDate.toDateString() === day.toDateString();
                });
                
                // Find events that span this time slot
                const spanningEvents = dayEvents.filter(event => {
                  const eventStart = new Date(event.start);
                  const eventEnd = new Date(event.end);
                  const timeSlotStart = timeIndex * 2;
                  const timeSlotEnd = (timeIndex + 1) * 2;
                  
                  return eventStart.getHours() < timeSlotEnd && eventEnd.getHours() > timeSlotStart;
                });
                
                // Find cleaning times that span this time slot (for clubroom only)
                const spanningCleaningEvents = dayEvents.filter(event => {
                  if ((event.amenityName !== 'Clubroom' && event.amenityName !== 'Pool + Clubroom') || !event.cleaningTime || !event.cleaningTime.start || !event.cleaningTime.end) {
                    return false;
                  }
                  const cleaningStart = new Date(event.cleaningTime.start);
                  const cleaningEnd = new Date(event.cleaningTime.end);
                  const timeSlotStart = timeIndex * 2;
                  const timeSlotEnd = (timeIndex + 1) * 2;
                  
                  return cleaningStart.getHours() < timeSlotEnd && cleaningEnd.getHours() > timeSlotStart;
                });
                
                return (
                  <div
                    key={dayIndex}
                    style={{
                      backgroundColor: isPast ? '#f3f4f6' : 'white',
                      minHeight: '60px',
                      padding: '2px',
                      border: '1px solid #e5e7eb',
                      cursor: isAuthenticated && !isPast ? 'pointer' : 'default',
                      opacity: isPast ? 0.6 : 1,
                      position: 'relative'
                    }}
                    onClick={(e) => {
                      if (isAuthenticated && !isPast && onDateClick) {
                        handleDateClick(dateStr, e);
                      }
                    }}
                  >
                    {/* Render spanning events as fixed 50% width blocks */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '2px', 
                      left: '2px', 
                      right: '2px', 
                      bottom: '2px',
                      display: 'flex',
                      gap: '2px',
                      zIndex: 1
                    }}>
                      {/* Clubroom events - Always left half (50% width) */}
                      <div style={{ 
                        flex: '0 0 50%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        maxWidth: '50%'
                      }}>
                        {spanningEvents.filter(event => event.amenityName === 'Clubroom' || event.amenityName === 'Pool + Clubroom').map((event, eventIndex) => {
                          const eventStart = new Date(event.start);
                          const eventEnd = new Date(event.end);
                          const timeSlotStart = timeIndex * 2;
                          const timeSlotEnd = (timeIndex + 1) * 2;
                          
                          // Calculate height based on duration within this time slot
                          const eventStartHour = Math.max(eventStart.getHours(), timeSlotStart);
                          const eventEndHour = Math.min(eventEnd.getHours(), timeSlotEnd);
                          const durationInSlot = eventEndHour - eventStartHour;
                          const heightPercent = (durationInSlot / 2) * 100; // 2-hour slots
                          
                          // Determine status color
                          let statusColor;
                          switch (event.status) {
                            case 'NEW':
                              statusColor = '#6b7280'; // Grey
                              break;
                            case 'JANITORIAL_APPROVED':
                              statusColor = '#f59e0b'; // Yellow
                              break;
                            case 'FULLY_APPROVED':
                              statusColor = '#10b981'; // Green
                              break;
                            default:
                              statusColor = '#6b7280'; // Grey
                          }

                          // Check if event is completed
                          const isCompleted = event.status === 'COMPLETED';
                          
                          return (
                            <div
                              key={`clubroom-${eventIndex}`}
                              onClick={(e) => handleEventClick(event, e)}
                              style={{
                                width: '100%',
                                height: `${Math.max(heightPercent, 20)}%`,
                                backgroundColor: '#9333ea', // Purple for Clubroom
                                borderRadius: '6px',
                                padding: '2px',
                                color: 'white',
                                fontSize: '8px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                marginBottom: '1px',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                position: 'relative',
                                opacity: isCompleted ? 0.5 : 1, // Make completed events more transparent
                                textDecoration: isCompleted ? 'line-through' : 'none', // Strikethrough for completed
                                border: isCompleted ? '1px dashed rgba(255,255,255,0.5)' : 'none' // Dashed border for completed
                              }}
                              title={`Clubroom - ${event.title} (${new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}) - Status: ${event.status}${isCompleted ? ' (Completed)' : ''}`}
                            >
                              {/* Status indicator */}
                              <div style={{
                                position: 'absolute',
                                top: '2px',
                                right: '2px',
                                width: '6px',
                                height: '6px',
                                backgroundColor: statusColor,
                                borderRadius: '50%',
                                border: '1px solid white'
                              }}></div>
                              
                              <div style={{ 
                                textAlign: 'center',
                                lineHeight: '1.1',
                                width: '100%',
                                overflow: 'hidden',
                                paddingRight: '8px' // Make room for status indicator
                              }}>
                                {/* Show actual event name for admin/janitorial, or title for others */}
                                {(user?.role === 'admin' || user?.role === 'janitorial') && event.eventName && event.isPrivate
                                  ? `${event.eventName} (Private)`
                                  : event.title}
                                <div style={{ 
                                  fontSize: '5px', 
                                  color: 'red', 
                                  marginTop: '1px',
                                  fontWeight: 'bold'
                                }}>
                                  {new Date(event.start).toLocaleDateString()} {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Cleaning blocks for Clubroom events */}
                        {spanningCleaningEvents.map((event, cleanIndex) => {
                          const cleaningStart = new Date(event.cleaningTime!.start);
                          const cleaningEnd = new Date(event.cleaningTime!.end);
                          const timeSlotStart = timeIndex * 2;
                          const timeSlotEnd = (timeIndex + 1) * 2;
                          const isCompleted = event.status === 'COMPLETED';
                          
                          // Check if cleaning time spans this time slot
                          const cleanStartHour = cleaningStart.getHours();
                          const cleanEndHour = cleaningEnd.getHours();
                          
                          if (cleanStartHour >= timeSlotEnd || cleanEndHour <= timeSlotStart) {
                            return null; // Cleaning doesn't span this time slot
                          }
                          
                          // Calculate height based on duration within this time slot
                          const cleanStartInSlot = Math.max(cleanStartHour, timeSlotStart);
                          const cleanEndInSlot = Math.min(cleanEndHour, timeSlotEnd);
                          const durationInSlot = cleanEndInSlot - cleanStartInSlot;
                          const heightPercent = (durationInSlot / 2) * 100; // 2-hour slots
                          
                          return (
                            <div
                              key={`cleaning-clubroom-${cleanIndex}-${timeIndex}`}
                              style={{
                                width: '100%',
                                height: `${Math.max(heightPercent, 20)}%`,
                                backgroundColor: '#fca5a5', // Light red for cleaning
                                borderRadius: '6px',
                                padding: '2px',
                                color: '#7f1d1d', // Dark red text
                                fontSize: '8px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                marginBottom: '1px',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                position: 'relative',
                                border: '1px dashed #dc2626', // Dashed border to indicate non-bookable
                                opacity: isCompleted ? 0.4 : 0.8, // More transparent if completed
                                textDecoration: isCompleted ? 'line-through' : 'none' // Strikethrough for completed
                              }}
                              title={`Cleaning Time - Clubroom unavailable (${new Date(event.cleaningTime!.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.cleaningTime!.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})${isCompleted ? ' - Completed' : ''}`}
                            >
                              <div style={{ 
                                textAlign: 'center',
                                lineHeight: '1.1',
                                width: '100%',
                                overflow: 'hidden'
                              }}>
                                Cleaning
                                <div style={{ 
                                  fontSize: '5px', 
                                  color: '#991b1b',
                                  marginTop: '1px',
                                  fontWeight: 'bold'
                                }}>
                                  {new Date(event.cleaningTime!.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Pool events - Always right half (50% width) */}
                      <div style={{ 
                        flex: '0 0 50%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        maxWidth: '50%'
                      }}>
                        {spanningEvents.filter(event => event.amenityName === 'Pool' || event.amenityName === 'Pool + Clubroom').map((event, eventIndex) => {
                          const eventStart = new Date(event.start);
                          const eventEnd = new Date(event.end);
                          const timeSlotStart = timeIndex * 2;
                          const timeSlotEnd = (timeIndex + 1) * 2;
                          
                          // Calculate height based on duration within this time slot
                          const eventStartHour = Math.max(eventStart.getHours(), timeSlotStart);
                          const eventEndHour = Math.min(eventEnd.getHours(), timeSlotEnd);
                          const durationInSlot = eventEndHour - eventStartHour;
                          const heightPercent = (durationInSlot / 2) * 100; // 2-hour slots
                          
                          // Determine status color
                          let statusColor;
                          switch (event.status) {
                            case 'NEW':
                              statusColor = '#6b7280'; // Grey
                              break;
                            case 'JANITORIAL_APPROVED':
                              statusColor = '#f59e0b'; // Yellow
                              break;
                            case 'FULLY_APPROVED':
                              statusColor = '#10b981'; // Green
                              break;
                            default:
                              statusColor = '#6b7280'; // Grey
                          }

                          // Check if event is completed
                          const isCompleted = event.status === 'COMPLETED';
                          
                          return (
                            <div
                              key={`pool-${eventIndex}`}
                              onClick={(e) => handleEventClick(event, e)}
                              style={{
                                width: '100%',
                                height: `${Math.max(heightPercent, 20)}%`,
                                backgroundColor: '#3b82f6', // Blue for Pool
                                borderRadius: '6px',
                                padding: '2px',
                                color: 'white',
                                fontSize: '8px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                marginBottom: '1px',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                position: 'relative',
                                opacity: isCompleted ? 0.5 : 1, // Make completed events more transparent
                                textDecoration: isCompleted ? 'line-through' : 'none', // Strikethrough for completed
                                border: isCompleted ? '1px dashed rgba(255,255,255,0.5)' : 'none' // Dashed border for completed
                              }}
                              title={`Pool - ${event.title} (${new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}) - Status: ${event.status}${isCompleted ? ' (Completed)' : ''}`}
                            >
                              {/* Status indicator */}
                              <div style={{
                                position: 'absolute',
                                top: '2px',
                                right: '2px',
                                width: '6px',
                                height: '6px',
                                backgroundColor: statusColor,
                                borderRadius: '50%',
                                border: '1px solid white'
                              }}></div>
                              
                              <div style={{ 
                                textAlign: 'center',
                                lineHeight: '1.1',
                                width: '100%',
                                overflow: 'hidden',
                                paddingRight: '8px' // Make room for status indicator
                              }}>
                                {/* Show actual event name for admin/janitorial, or title for others */}
                                {(user?.role === 'admin' || user?.role === 'janitorial') && event.eventName && event.isPrivate
                                  ? `${event.eventName} (Private)`
                                  : event.title}
                                <div style={{ 
                                  fontSize: '5px', 
                                  color: 'red', 
                                  marginTop: '1px',
                                  fontWeight: 'bold'
                                }}>
                                  {new Date(event.start).toLocaleDateString()} {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Loading calendar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ color: 'red' }}>{error}</div>
        <button 
          onClick={fetchEvents}
          style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#355B45', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, margin: 0, fontFamily: 'Inter, sans-serif', color: '#244032' }}>
          Calendar
        </h1>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* View Toggle */}
          <div style={{ display: 'flex', border: '1px solid #d1d5db', borderRadius: '4px' }}>
            {(['month', 'week'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: view === v ? '#355B45' : 'white',
                  color: view === v ? 'white' : '#374151',
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {v}
              </button>
            ))}
          </div>
          
          {/* Amenity Filter */}
          <select
            value={selectedAmenity}
            onChange={(e) => setSelectedAmenity(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
          >
            <option value="all">All Amenities</option>
            {amenities.map(amenity => (
              <option key={amenity.id} value={amenity.id}>{amenity.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => navigateDate('prev')}
          style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
        >
          ← Previous
        </button>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            {formatDate(currentDate)}
          </h2>
          <button
            onClick={() => goToToday()}
            style={{ 
              padding: '6px 12px', 
              backgroundColor: '#355B45', 
              color: 'white',
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            Go to Today
          </button>
        </div>
        
        <button
          onClick={() => navigateDate('next')}
          style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
        >
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        {view === 'month' ? renderMonthView() : renderWeekView()}
      </div>

      {/* Legend */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Legend:</div>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {/* Amenity Types */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#9333ea', borderRadius: '2px' }}></div>
            <span style={{ fontSize: '12px' }}>Clubroom</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '2px' }}></div>
            <span style={{ fontSize: '12px' }}>Pool</span>
          </div>
          
          {/* Status Indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#6b7280', borderRadius: '50%', border: '1px solid white' }}></div>
            <span style={{ fontSize: '12px' }}>New</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%', border: '1px solid white' }}></div>
            <span style={{ fontSize: '12px' }}>Janitorial Approved</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', border: '1px solid white' }}></div>
            <span style={{ fontSize: '12px' }}>Fully Approved</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {isAuthenticated && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '8px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#0c4a6e' }}>
            💡 <strong>Tip:</strong> Click on any future date to make a reservation. Simply set your setup start time and party end time. Past dates are greyed out and cannot be booked.
          </p>
        </div>
      )}
      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
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
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                Reservation Details
              </h2>
              <button
                onClick={closeEventDetails}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>

            {/* Event Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Amenity and Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: (selectedEvent.amenityName === 'Clubroom' || selectedEvent.amenityName === 'Pool + Clubroom') ? '#9333ea' : '#3b82f6'
                  }}></div>
                  <span style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                    {selectedEvent.amenityName}
                  </span>
                </div>
                <div style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: selectedEvent.status === 'NEW' ? '#f3f4f6' : 
                                  selectedEvent.status === 'JANITORIAL_APPROVED' ? '#fef3c7' : '#d1fae5',
                  color: selectedEvent.status === 'NEW' ? '#6b7280' : 
                         selectedEvent.status === 'JANITORIAL_APPROVED' ? '#92400e' : '#065f46'
                }}>
                  {selectedEvent.status.replace('_', ' ')}
                </div>
              </div>

              {/* Event Title */}
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
                  {selectedEvent.title}
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                  Reserved by {selectedEvent.userName}
                </p>
              </div>

              {/* Date and Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Date</h4>
                  <p style={{ margin: 0, fontSize: '16px', color: '#1f2937' }}>
                    {parseDateString(selectedEvent.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Party Time</h4>
                  <p style={{ margin: 0, fontSize: '16px', color: '#1f2937' }}>
                    {new Date(selectedEvent.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(selectedEvent.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Setup Time */}
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Setup Time</h4>
                <p style={{ margin: 0, fontSize: '16px', color: '#1f2937' }}>
                  {new Date(selectedEvent.setupTime.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                  {new Date(selectedEvent.setupTime.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {/* Guest Count */}
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Guest Count</h4>
                <p style={{ margin: 0, fontSize: '16px', color: '#1f2937' }}>
                  {selectedEvent.guestCount} {selectedEvent.guestCount === 1 ? 'guest' : 'guests'}
                </p>
              </div>

              {/* Special Requirements */}
              {selectedEvent.specialRequirements && (
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Special Requirements</h4>
                  <p style={{ margin: 0, fontSize: '16px', color: '#1f2937' }}>
                    {selectedEvent.specialRequirements}
                  </p>
                </div>
              )}

              {/* Cleaning Time */}
              {selectedEvent.cleaningTime && (
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Cleaning Time</h4>
                  <p style={{ margin: 0, fontSize: '16px', color: '#1f2937' }}>
                    {new Date(selectedEvent.cleaningTime.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(selectedEvent.cleaningTime.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}

              {/* Contact Information */}
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#f9fafb', 
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Contact Information</h4>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>
                  <strong>Email:</strong> {selectedEvent.userEmail}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;