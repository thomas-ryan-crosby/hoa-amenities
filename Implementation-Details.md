# HOA Amenities Management System - Implementation Details

## Critical Implementation Knowledge

This document contains critical implementation details, gotchas, and solutions discovered during development to prevent knowledge loss and ensure future maintainability.

---

## 🚨 CRITICAL: Date Handling & Timezone Issues

### The Problem
The application experienced persistent date mismatches where:
- Events displayed on the wrong calendar dates
- Clicking on a date created reservations for the wrong date
- Event details modals showed incorrect dates

### Root Cause Analysis
**Backend Issue**: The backend was sending `reservation.date` as JavaScript Date objects instead of strings, causing comparison failures in the frontend.

**Frontend Issue**: When converting date strings back to Date objects for display, `new Date("2025-10-26")` was interpreted as UTC midnight, which then shifted to local timezone, causing a one-day offset.

### The Complete Solution

#### 1. Backend Fix (`backend/src/routes/calendar.ts`)
```typescript
// Transform data for calendar display
const events = reservations.map(reservation => {
  // Convert date to YYYY-MM-DD string format for frontend consistency
  const dateStr = reservation.date instanceof Date 
    ? `${reservation.date.getFullYear()}-${String(reservation.date.getMonth() + 1).padStart(2, '0')}-${String(reservation.date.getDate()).padStart(2, '0')}`
    : reservation.date;
  
  return {
    // ... other fields
    date: dateStr, // Now consistently a string
    // ... rest of object
  };
});
```

#### 2. Frontend Fix (`frontend/src/components/Calendar.tsx`)
```typescript
// Helper function to safely parse YYYY-MM-DD date string without timezone issues
const parseDateString = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
};

// Usage in EventDetailsModal
{parseDateString(selectedEvent.date).toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
```

### Key Principles
1. **Backend**: Always send dates as `YYYY-MM-DD` strings, never Date objects
2. **Frontend**: Use local date components (`getFullYear()`, `getMonth()`, `getDate()`) for all date calculations
3. **Never use**: `new Date("YYYY-MM-DD")` as it causes timezone shifts
4. **Always use**: `parseDateString()` helper for safe date parsing

---

## 🎨 Calendar Implementation Details

### Calendar Views
- **Month View**: Shows events as side-by-side blocks (50% width each for Clubroom/Pool)
- **Week View**: Shows 2-hour time blocks from 00:00 to 24:00, Monday-Sunday
- **Day View**: Removed (not needed per requirements)

### Event Display Logic
```typescript
// Month view positioning based on timing
if (startHour < 12 && endHour < 12) {
  // Morning only - top half
  positionStyle = { position: 'absolute', top: '5px', left: '2px', right: '2px' };
} else if (startHour >= 12 && endHour >= 12) {
  // Afternoon only - bottom half  
  positionStyle = { position: 'absolute', bottom: '5px', left: '2px', right: '2px' };
} else {
  // Morning to afternoon - full cell
  positionStyle = { position: 'absolute', top: '5px', bottom: '5px', left: '2px', right: '2px' };
}
```

### Color Scheme
- **Clubroom**: Purple (`#9333ea`)
- **Pool**: Blue (`#3b82f6`)
- **Status Indicators**: 
  - Grey: NEW
  - Yellow: JANITORIAL_APPROVED  
  - Green: FULLY_APPROVED

### Event Filtering
```typescript
// Only show active reservations on calendar
status: { [Op.notIn]: ['COMPLETED', 'CANCELLED'] }
```

---

## 🔐 Authentication & Authorization

### User Roles
- **Resident**: Can create reservations, view own reservations
- **Janitorial**: Can approve/reject reservations, set cleaning times
- **Admin**: Full access including user management

### JWT Implementation
```typescript
// Token payload structure
{
  userId: number,
  role: 'resident' | 'janitorial' | 'admin',
  iat: number,
  exp: number
}
```

### Route Protection
```typescript
// Middleware for role-based access
const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
```

---

## 💾 Database Schema

### Critical Tables
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'resident',
  phone VARCHAR(255),
  address TEXT,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Reservations table  
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users(id),
  amenityId INTEGER REFERENCES amenities(id),
  date DATE NOT NULL,
  setupTimeStart TIMESTAMP NOT NULL,
  setupTimeEnd TIMESTAMP,
  partyTimeStart TIMESTAMP,
  partyTimeEnd TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'NEW',
  guestCount INTEGER DEFAULT 1,
  specialRequirements TEXT,
  totalFee DECIMAL(10,2),
  totalDeposit DECIMAL(10,2),
  cleaningTimeStart TIMESTAMP,
  cleaningTimeEnd TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Status Workflow
1. **NEW**: Initial reservation state
2. **JANITORIAL_APPROVED**: Janitorial staff approved, cleaning time set
3. **FULLY_APPROVED**: Admin approved, ready for party
4. **CANCELLED**: Reservation cancelled
5. **COMPLETED**: Party completed, cleaning done

---

## 🛠️ Development Gotchas & Solutions

### 1. TypeScript Compilation Errors
**Problem**: `toFixed is not a function` on `totalFee` and `totalDeposit`
**Solution**: Convert to string first: `parseFloat(String(reservation.totalFee)).toFixed(2)`

### 2. Route Order Issues
**Problem**: `/api/reservations/all` matched by `/api/reservations/:id`
**Solution**: Put specific routes before parameterized routes

### 3. Sequelize Associations
**Problem**: `Property 'amenity' does not exist on type 'Reservation'`
**Solution**: Use `include` statements and `ReservationWithAssociations` interface

### 4. CSS Positioning Issues
**Problem**: TypeScript errors with `position: 'absolute'`
**Solution**: Use `as const` assertion: `position: 'absolute' as const`

### 5. Event Propagation
**Problem**: Clicking events triggered both event details and reservation modal
**Solution**: Use `e.stopPropagation()` in event handlers

---

## 🚀 Deployment Considerations

### Environment Variables
```bash
# Backend (.env)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hoa_amenities
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
PORT=5000

# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000
```

### Database Setup Commands
```bash
# Create database
createdb hoa_amenities

# Run migrations/seeding
cd backend
npm run dev
```

### Production Considerations
- Use environment-specific JWT secrets
- Set up proper CORS origins
- Configure database connection pooling
- Implement proper error logging
- Set up monitoring for failed reservations

---

## 📋 Testing Checklist

### Critical Functionality Tests
- [ ] Calendar events display on correct dates
- [ ] Clicking calendar cells opens reservation modal with correct date
- [ ] Event details modal shows correct date matching calendar position
- [ ] Janitorial approval workflow functions correctly
- [ ] User role permissions work as expected
- [ ] Date filtering in calendar API works correctly

### Edge Cases to Test
- [ ] Reservations spanning multiple days
- [ ] Timezone changes (if applicable)
- [ ] Large numbers of concurrent reservations
- [ ] Invalid date inputs
- [ ] Expired JWT tokens

---

## 🔄 Future Enhancements

### Planned Features
- Square payment integration
- Email notifications (SendGrid)
- Mobile responsive design improvements
- Advanced reporting and analytics
- Bulk reservation management

### Technical Debt
- Consider migrating from inline styles to CSS modules
- Implement proper error boundaries
- Add comprehensive unit tests
- Set up CI/CD pipeline
- Implement proper logging system

---

## 📞 Support & Maintenance

### Common Issues & Solutions
1. **Date mismatches**: Check backend date formatting and frontend parsing
2. **Authentication failures**: Verify JWT secret and token expiration
3. **Database connection issues**: Check PostgreSQL service and connection string
4. **Calendar not loading**: Verify API endpoints and CORS configuration

### Key Files to Monitor
- `backend/src/routes/calendar.ts` - Date formatting logic
- `frontend/src/components/Calendar.tsx` - Date parsing and display
- `backend/src/middleware/auth.ts` - Authentication logic
- `backend/src/models/Reservation.ts` - Database model

---

*Last Updated: October 26, 2025*
*Version: 1.0*
