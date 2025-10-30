# HOA Amenities Management System

A web-based application to manage reservations for HOA amenities (Clubroom and Pool) with a Google Calendar-like interface, supporting reservation fees, deposits, setup/party times, and janitorial coordination.

## Features

- **Calendar-based Reservation System**: Google Calendar-like interface for easy booking
- **Multi-day Reservations**: Support for consecutive day bookings with separate payments
- **Payment Integration**: Square payment processing for fees and deposits
- **Email Notifications**: Automated notifications for all stakeholders
- **Janitorial Workflow**: Cleaning schedule management and confirmation system
- **Role-based Access**: Separate interfaces for residents, janitorial staff, and administrators

## Amenities

### Clubroom
- Reservation Fee: $125
- Deposit: $75
- Setup Time: 15 minutes - 2 hours
- Party Time: 1 hour minimum, no maximum

### Pool
- Reservation Fee: $25
- Deposit: $50
- Setup Time: 15 minutes - 2 hours
- Party Time: 1 hour minimum, no maximum

## Technology Stack

- **Frontend**: React
- **Backend**: Node.js/Express
- **Database**: PostgreSQL
- **Payment Processing**: Square API
- **Email Service**: SendGrid/AWS SES
- **Deployment**: Vercel (Frontend), Railway/Heroku (Backend)

## Project Structure

```
hoa-amenities/
├── frontend/          # React frontend application
├── backend/           # Node.js/Express backend API
├── docs/             # Documentation
├── HOA-Amenities-PRD.md
├── Implementation-Checklist.md
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Git

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Database Setup

1. Create PostgreSQL database
2. Run migrations
3. Seed initial data

## Development

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SQUARE_APPLICATION_ID=your_square_app_id
```

**Backend (.env)**
```
DATABASE_URL=postgresql://username:password@localhost:5432/hoa_amenities
JWT_SECRET=your_jwt_secret
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_ENVIRONMENT=sandbox
SENDGRID_API_KEY=your_sendgrid_api_key
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Amenities
- `GET /api/amenities` - List all amenities
- `GET /api/amenities/:id` - Get specific amenity

### Reservations
- `GET /api/reservations` - List user's reservations
- `POST /api/reservations` - Create new reservation
- `PUT /api/reservations/:id` - Update reservation
- `DELETE /api/reservations/:id` - Cancel reservation

### Calendar
- `GET /api/calendar/availability` - Get availability for date range
- `GET /api/calendar/events` - Get events for calendar view

## User Roles

- **Resident**: Can view amenities, create reservations, manage own bookings
- **Janitorial**: Can view reservations, schedule cleaning times, confirm completion
- **Admin**: Full system access, user management, reporting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is proprietary software for HOA management.

## Support

For support and questions, contact the development team.

