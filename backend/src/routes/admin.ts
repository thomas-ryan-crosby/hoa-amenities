import express from 'express';
import { User, Reservation, sequelize } from '../models';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/users - Get all users
router.get('/users', async (req: any, res) => {
  try {
    console.log('🔍 Admin fetching all users');

    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address', 'role', 'isActive', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    console.log('✅ Found users:', users.length);

    return res.json({
      users,
      total: users.length
    });

  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/admin/users/:id/role - Update user role
router.put('/users/:id/role', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    console.log('🔄 Admin updating user role:', id, 'to', role);

    // Validate role
    if (!['resident', 'janitorial', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be resident, janitorial, or admin.' });
    }

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from changing their own role
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    // Update role
    await user.update({ role });

    console.log('✅ User role updated successfully');

    return res.json({
      message: 'User role updated successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Error updating user role:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/admin/users/:id/status - Update user status (active/inactive)
router.put('/users/:id/status', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    console.log('🔄 Admin updating user status:', id, 'to', isActive);

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deactivating themselves
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }

    // Update status
    await user.update({ isActive });

    console.log('✅ User status updated successfully');

    return res.json({
      message: 'User status updated successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error('❌ Error updating user status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/admin/users/:id/password - Reset user password
router.put('/users/:id/password', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    console.log('🔄 Admin resetting password for user:', id);

    // Validate password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await user.update({ password: hashedPassword });

    console.log('✅ User password reset successfully');

    return res.json({
      message: 'User password reset successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ Error resetting user password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/admin/users/:id - Delete user (soft delete by setting inactive)
router.delete('/users/:id', async (req: any, res) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Admin deleting user:', id);

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Soft delete by setting inactive
    await user.update({ isActive: false });

    console.log('✅ User deleted successfully');

    return res.json({
      message: 'User deleted successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/admin/migrate-event-name-fields - Run database migration for event name fields
router.post('/migrate-event-name-fields', async (req: any, res) => {
  try {
    console.log('🔧 Starting event name fields migration...');
    
    // Check if columns already exist
    const checkColumns = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'reservations' 
      AND column_name IN ('eventName', 'isPrivate')
    `) as any[];

    const existingColumns = checkColumns[0].map((row: any) => row.column_name);

    if (existingColumns.includes('eventName') && existingColumns.includes('isPrivate')) {
      console.log('✅ Columns "eventName" and "isPrivate" already exist.');
      return res.json({ success: true, message: 'Columns already exist. Migration skipped.', fieldsAdded: [] });
    }

    const fieldsAdded: string[] = [];

    // Add eventName column if it doesn't exist
    if (!existingColumns.includes('eventName')) {
      await sequelize.query(`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS "eventName" VARCHAR(255) NULL;`);
      fieldsAdded.push('eventName');
      console.log('✅ Column "eventName" added');
    }

    // Add isPrivate column if it doesn't exist
    if (!existingColumns.includes('isPrivate')) {
      await sequelize.query(`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS "isPrivate" BOOLEAN NOT NULL DEFAULT false;`);
      fieldsAdded.push('isPrivate');
      console.log('✅ Column "isPrivate" added');
    }

    console.log('🎉 Event name fields migration completed successfully!');
    return res.json({ 
      success: true, 
      message: 'Migration completed successfully. All event name fields have been added to the reservations table.',
      fieldsAdded 
    });
  } catch (error: any) {
    console.error('❌ Migration failed:', error);
    return res.status(500).json({ success: false, message: 'Migration failed', error: error.message });
  }
});

// POST /api/admin/migrate-damage-fields - Run database migration for damage assessment fields
router.post('/migrate-damage-fields', async (req: any, res) => {
  try {
    console.log('🔧 Starting damage assessment fields migration...');

    // Run migration queries
    await sequelize.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageAssessed" BOOLEAN DEFAULT false;
    `);
    console.log('  ✅ Added damageAssessed');

    await sequelize.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageAssessmentPending" BOOLEAN DEFAULT false;
    `);
    console.log('  ✅ Added damageAssessmentPending');

    // Create enum type if it doesn't exist
    await sequelize.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'damage_assessment_status_enum'
        ) THEN
          CREATE TYPE damage_assessment_status_enum AS ENUM ('PENDING', 'APPROVED', 'ADJUSTED', 'DENIED');
        END IF;
      END $$;
    `);
    console.log('  ✅ Created/verified damage_assessment_status_enum');

    await sequelize.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageAssessmentStatus" damage_assessment_status_enum;
    `);
    console.log('  ✅ Added damageAssessmentStatus');

    await sequelize.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageCharge" DECIMAL(10,2);
    `);
    console.log('  ✅ Added damageCharge');

    await sequelize.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageChargeAmount" DECIMAL(10,2);
    `);
    console.log('  ✅ Added damageChargeAmount');

    await sequelize.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageChargeAdjusted" DECIMAL(10,2);
    `);
    console.log('  ✅ Added damageChargeAdjusted');

    await sequelize.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageDescription" TEXT;
    `);
    console.log('  ✅ Added damageDescription');

    await sequelize.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageNotes" TEXT;
    `);
    console.log('  ✅ Added damageNotes');

    await sequelize.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "adminDamageNotes" TEXT;
    `);
    console.log('  ✅ Added adminDamageNotes');

    await sequelize.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageAssessedBy" INTEGER REFERENCES users(id);
    `);
    console.log('  ✅ Added damageAssessedBy');

    await sequelize.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageReviewedBy" INTEGER REFERENCES users(id);
    `);
    console.log('  ✅ Added damageReviewedBy');

    await sequelize.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageAssessedAt" TIMESTAMP;
    `);
    console.log('  ✅ Added damageAssessedAt');

    await sequelize.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageReviewedAt" TIMESTAMP;
    `);
    console.log('  ✅ Added damageReviewedAt');

    console.log('✅ Migration completed successfully!');

    return res.json({
      success: true,
      message: 'Migration completed successfully. All damage assessment fields have been added to the reservations table.',
      fieldsAdded: [
        'damageAssessed',
        'damageAssessmentPending',
        'damageAssessmentStatus',
        'damageCharge',
        'damageChargeAmount',
        'damageChargeAdjusted',
        'damageDescription',
        'damageNotes',
        'adminDamageNotes',
        'damageAssessedBy',
        'damageReviewedBy',
        'damageAssessedAt',
        'damageReviewedAt'
      ]
    });

  } catch (error: any) {
    console.error('❌ Migration failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Migration failed',
      error: error.message
    });
  }
});

// POST /api/admin/migrate-multi-community - Run database migration for multi-community support
router.post('/migrate-multi-community', async (req: any, res) => {
  try {
    console.log('🔧 Starting multi-community migration...');

    // Step 1: Create communities table
    console.log('📦 Creating communities table...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS communities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        address TEXT,
        "contactEmail" VARCHAR(255),
        "isActive" BOOLEAN DEFAULT true,
        settings JSONB,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('  ✅ Created communities table');

    // Step 2: Create community_users table
    console.log('📦 Creating community_users table...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS community_users (
        id SERIAL PRIMARY KEY,
        "communityId" INTEGER NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
        "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL CHECK (role IN ('resident', 'janitorial', 'admin')),
        "isActive" BOOLEAN DEFAULT true,
        "joinedAt" TIMESTAMP DEFAULT NOW(),
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        UNIQUE("communityId", "userId")
      )
    `);
    console.log('  ✅ Created community_users table');

    // Step 3: Create indexes for community_users
    console.log('📊 Creating indexes for community_users...');
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS "community_users_community_id_idx" 
      ON community_users("communityId")
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS "community_users_user_id_idx" 
      ON community_users("userId")
    `);
    console.log('  ✅ Created indexes for community_users');

    // Step 4: Add community_id to amenities table
    console.log('📦 Adding community_id to amenities table...');
    await sequelize.query(`
      ALTER TABLE amenities 
      ADD COLUMN IF NOT EXISTS "communityId" INTEGER REFERENCES communities(id) ON DELETE CASCADE
    `);
    console.log('  ✅ Added communityId to amenities');

    // Step 5: Add community_id to reservations table
    console.log('📦 Adding community_id to reservations table...');
    await sequelize.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "communityId" INTEGER REFERENCES communities(id) ON DELETE CASCADE
    `);
    console.log('  ✅ Added communityId to reservations');

    // Step 6: Create indexes for performance
    console.log('📊 Creating indexes for community_id columns...');
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_amenities_community_id" 
      ON amenities("communityId")
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_reservations_community_id" 
      ON reservations("communityId")
    `);
    console.log('  ✅ Created indexes');

    // Step 7: Create production community for existing data
    console.log('🏘️ Creating "The Sanctuary - Mandeville, LA" community...');
    // Check if community already exists
    const existingSanctuary = await sequelize.query(`
      SELECT id FROM communities WHERE name = 'The Sanctuary - Mandeville, LA'
    `) as any[];

    let sanctuaryId: number;
    if (existingSanctuary[0].length > 0) {
      sanctuaryId = existingSanctuary[0][0].id;
      console.log(`  ✅ Sanctuary community already exists with id: ${sanctuaryId}`);
    } else {
      const sanctuaryResult = await sequelize.query(`
        INSERT INTO communities (name, description, address, "isActive")
        VALUES ('The Sanctuary - Mandeville, LA', 
                'Production community containing all existing data migrated from single-community system', 
                'Mandeville, LA',
                true)
        RETURNING id
      `) as any[];
      sanctuaryId = sanctuaryResult[0][0].id;
      console.log(`  ✅ Created sanctuary community with id: ${sanctuaryId}`);
    }

    // Step 8: Create demo community
    console.log('🏘️ Creating "DEMO COMMUNITY"...');
    // Check if community already exists
    const existingDemo = await sequelize.query(`
      SELECT id FROM communities WHERE name = 'DEMO COMMUNITY'
    `) as any[];

    let demoId: number;
    if (existingDemo[0].length > 0) {
      demoId = existingDemo[0][0].id;
      console.log(`  ✅ Demo community already exists with id: ${demoId}`);
    } else {
      const demoResult = await sequelize.query(`
        INSERT INTO communities (name, description, "isActive")
        VALUES ('DEMO COMMUNITY', 
                'Demo community for testing and demonstration purposes', 
                true)
        RETURNING id
      `) as any[];
      demoId = demoResult[0][0].id;
      console.log(`  ✅ Created demo community with id: ${demoId}`);
    }

    // Step 9: Assign all existing users to "The Sanctuary - Mandeville, LA" with their current role
    console.log('👥 Assigning users to sanctuary community...');
    const userAssignmentResult = await sequelize.query(`
      INSERT INTO community_users ("communityId", "userId", role, "isActive", "joinedAt")
      SELECT 
        ${sanctuaryId},
        id,
        role,
        "isActive",
        NOW()
      FROM users
      WHERE id NOT IN (
        SELECT "userId" FROM community_users WHERE "communityId" = ${sanctuaryId}
      )
    `) as any[];
    
    console.log(`  ✅ Assigned users to sanctuary community (rows: ${userAssignmentResult[1]})`);

    // Step 10: Assign all existing amenities to "The Sanctuary - Mandeville, LA"
    console.log('🏊 Assigning amenities to sanctuary community...');
    const amenityAssignmentResult = await sequelize.query(`
      UPDATE amenities 
      SET "communityId" = ${sanctuaryId}
      WHERE "communityId" IS NULL
    `) as any[];
    
    console.log(`  ✅ Assigned amenities to sanctuary community (rows: ${amenityAssignmentResult[1]})`);

    // Step 11: Assign all existing reservations to "The Sanctuary - Mandeville, LA"
    console.log('📅 Assigning reservations to sanctuary community...');
    const reservationAssignmentResult = await sequelize.query(`
      UPDATE reservations 
      SET "communityId" = ${sanctuaryId}
      WHERE "communityId" IS NULL
    `) as any[];
    
    console.log(`  ✅ Assigned reservations to sanctuary community (rows: ${reservationAssignmentResult[1]})`);

    // Step 12: Make community_id NOT NULL (after data migration)
    // Note: This might fail if there are NULL values, so we check first
    console.log('🔒 Making community_id required...');
    
    // Check if there are any NULL values before making NOT NULL
    const nullAmenities = await sequelize.query(`
      SELECT COUNT(*) as count FROM amenities WHERE "communityId" IS NULL
    `) as any[];
    
    const nullReservations = await sequelize.query(`
      SELECT COUNT(*) as count FROM reservations WHERE "communityId" IS NULL
    `) as any[];

    if (nullAmenities[0][0].count === '0' && nullReservations[0][0].count === '0') {
      await sequelize.query(`
        ALTER TABLE amenities 
        ALTER COLUMN "communityId" SET NOT NULL
      `);
      
      await sequelize.query(`
        ALTER TABLE reservations 
        ALTER COLUMN "communityId" SET NOT NULL
      `);
      console.log('  ✅ Made communityId NOT NULL');
    } else {
      console.log(`  ⚠️ Skipping NOT NULL constraint - found ${nullAmenities[0][0].count} amenities and ${nullReservations[0][0].count} reservations with NULL communityId`);
    }

    // Step 13: Update unique constraint on amenities name to be per-community
    console.log('🔒 Updating unique constraint on amenities name...');
    try {
      // Drop existing unique constraint if it exists
      await sequelize.query(`
        ALTER TABLE amenities 
        DROP CONSTRAINT IF EXISTS amenities_name_key
      `);
      
      // Create unique index on (name, communityId)
      await sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS amenities_name_community_unique 
        ON amenities(name, "communityId")
      `);
      
      console.log('  ✅ Updated amenities name unique constraint');
    } catch (error: any) {
      console.log('  ⚠️ Could not update amenities unique constraint:', error.message);
    }

    // Get summary
    const summary = await sequelize.query(`
      SELECT 
        (SELECT COUNT(*) FROM communities) as communities_count,
        (SELECT COUNT(*) FROM community_users) as community_users_count,
        (SELECT COUNT(*) FROM amenities WHERE "communityId" IS NOT NULL) as amenities_with_community,
        (SELECT COUNT(*) FROM reservations WHERE "communityId" IS NOT NULL) as reservations_with_community
    `) as any[];

    const summaryData = summary[0][0];

    console.log('✅ Migration completed successfully!');

    return res.json({
      success: true,
      message: 'Multi-community migration completed successfully',
      summary: {
        communities: parseInt(summaryData.communities_count),
        communityUsers: parseInt(summaryData.community_users_count),
        amenitiesWithCommunity: parseInt(summaryData.amenities_with_community),
        reservationsWithCommunity: parseInt(summaryData.reservations_with_community)
      },
      communitiesCreated: [
        { id: sanctuaryId, name: 'The Sanctuary - Mandeville, LA' },
        { id: demoId, name: 'DEMO COMMUNITY' }
      ]
    });

  } catch (error: any) {
    console.error('❌ Migration failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Migration failed',
      error: error.message
    });
  }
});

// POST /api/admin/migrate-demo-accounts - Update demo account emails
router.post('/migrate-demo-accounts', async (req: any, res) => {
  try {
    console.log('🔧 Starting demo account email migration...');

    // Update admin account
    const adminResult = await sequelize.query(`
      UPDATE users 
      SET email = 'ryan@kellby.com', 
          "firstName" = 'Ryan', 
          "lastName" = 'Kellby'
      WHERE email = 'admin@hoa.com' AND role = 'admin';
    `);
    console.log(`  ✅ Updated admin account: ${adminResult[1]} row(s)`);

    // Update janitorial account
    const janitorialResult = await sequelize.query(`
      UPDATE users 
      SET email = 'thomas.ryan.crosby@gmail.com', 
          "firstName" = 'Thomas', 
          "lastName" = 'Crosby'
      WHERE email = 'janitorial@hoa.com' AND role = 'janitorial';
    `);
    console.log(`  ✅ Updated janitorial account: ${janitorialResult[1]} row(s)`);

    // Update resident account
    const residentResult = await sequelize.query(`
      UPDATE users 
      SET email = 'ryan@wetlandx.com', 
          "firstName" = 'Ryan', 
          "lastName" = 'Wetlandx'
      WHERE email = 'resident@hoa.com' AND role = 'resident';
    `);
    console.log(`  ✅ Updated resident account: ${residentResult[1]} row(s)`);

    console.log('✅ Demo account migration completed successfully!');

    return res.json({
      success: true,
      message: 'Demo accounts updated successfully',
      accountsUpdated: {
        admin: adminResult[1],
        janitorial: janitorialResult[1],
        resident: residentResult[1]
      },
      newCredentials: {
        admin: 'ryan@kellby.com / admin123',
        janitorial: 'thomas.ryan.crosby@gmail.com / admin123',
        resident: 'ryan@wetlandx.com / admin123'
      }
    });

  } catch (error: any) {
    console.error('❌ Demo account migration failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Migration failed',
      error: error.message
    });
  }
});

export default router;
