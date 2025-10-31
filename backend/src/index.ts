import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize database models and sync
import { sequelize, User, Amenity, Reservation } from './models';
import { seedDatabase } from './seeders/seedData';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://www.neighbri.com',
    'https://neighbri.com'
  ],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'HOA Amenities API is running',
    timestamp: new Date().toISOString()
  });
});

// Import routes
import amenitiesRoutes from './routes/amenities';
import authRoutes from './routes/auth';
import calendarRoutes from './routes/calendar';
import reservationsRoutes from './routes/reservations';
import adminRoutes from './routes/admin';

// API Routes
app.use('/api/auth', authRoutes);

app.use('/api/amenities', amenitiesRoutes);

app.use('/api/calendar', calendarRoutes);

app.use('/api/reservations', reservationsRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Sync database models (create tables if they don't exist)
    await sequelize.sync({ alter: false }); // Use alter: false in production to avoid data loss
    console.log('✅ Database tables synced.');

    // Seed initial data (amenities and demo users)
    await seedDatabase();
    console.log('✅ Database seeded with initial data.');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;

