# Multi-Community Architecture Implementation Plan

## Overview
This document outlines the plan to transform the HOA Amenities Management System from a single-community application to a multi-community platform where:
- Multiple communities can be managed independently
- Users can belong to multiple communities with different roles in each
- Users can switch between communities using a single login
- Each community has its own amenities, reservations, and settings

---

## Phase 1: Database Schema Changes

### 1.1 New Tables

#### `communities` Table
```sql
CREATE TABLE communities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT,
  contact_email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  settings JSONB, -- For community-specific configurations
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique identifier
- `name`: Community name (e.g., "Sunset Valley HOA", "Riverside Community")
- `description`: Optional description
- `address`: Physical address
- `contact_email`: Community contact email
- `is_active`: Whether the community is active
- `settings`: JSON field for future community-specific settings (timezone, booking rules, etc.)

#### `community_users` Table (Many-to-Many Relationship)
```sql
CREATE TABLE community_users (
  id SERIAL PRIMARY KEY,
  community_id INTEGER NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('resident', 'janitorial', 'admin')),
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);
```

**Fields:**
- `community_id`: Reference to community
- `user_id`: Reference to user
- `role`: User's role in THIS community (can differ per community)
- `is_active`: Whether membership is active
- `joined_at`: When user joined this community
- Unique constraint prevents duplicate memberships

#### `community_amenities` Table (Many-to-Many)
```sql
CREATE TABLE community_amenities (
  id SERIAL PRIMARY KEY,
  community_id INTEGER NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  amenity_id INTEGER NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(community_id, amenity_id)
);
```

**Purpose:** Links amenities to specific communities. This allows:
- Amenities to be reused across communities OR
- Each community to have unique amenity configurations

**Alternative Approach:** Instead of a join table, add `community_id` directly to `amenities` table. This is simpler if each amenity belongs to exactly one community.

### 1.2 Table Modifications

#### `amenities` Table
Add `community_id` column:
```sql
ALTER TABLE amenities 
ADD COLUMN community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE;

-- Make community_id required (after migration)
ALTER TABLE amenities 
ALTER COLUMN community_id SET NOT NULL;

-- Drop unique constraint on name if it exists, make name unique per community
ALTER TABLE amenities 
DROP CONSTRAINT IF EXISTS amenities_name_key;

CREATE UNIQUE INDEX amenities_name_community_unique ON amenities(name, community_id);
```

#### `reservations` Table
Add `community_id` column:
```sql
ALTER TABLE reservations 
ADD COLUMN community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE;

-- Make community_id required (after migration)
ALTER TABLE reservations 
ALTER COLUMN community_id SET NOT NULL;
```

**Why:** Reservations are community-specific. When querying, we'll filter by `community_id`.

#### `users` Table
**No changes needed** - users are global. Their community memberships are tracked in `community_users`.

**Consideration:** The current `role` column in `users` table becomes a "default role" or can be removed entirely if we always use `community_users.role`.

---

## Phase 2: Backend API Changes

### 2.1 Authentication Updates

#### JWT Token Structure
**Current:**
```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "admin"
}
```

**New:**
```json
{
  "userId": 1,
  "email": "user@example.com",
  "currentCommunityId": 1,  // Currently selected community
  "communityRoles": {        // Roles in each community
    "1": "admin",
    "2": "resident",
    "3": "janitorial"
  }
}
```

#### Login Endpoint Changes (`POST /api/auth/login`)
**Changes:**
1. Query all communities user belongs to via `community_users` table
2. Return list of communities with user's role in each
3. Set a default `currentCommunityId` (first community or last used)
4. Include community info in token

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "communities": [
    {
      "id": 1,
      "name": "Sunset Valley HOA",
      "role": "admin",
      "isActive": true
    },
    {
      "id": 2,
      "name": "Riverside Community",
      "role": "resident",
      "isActive": true
    }
  ],
  "currentCommunityId": 1,
  "token": "jwt_token_here"
}
```

#### New Endpoint: Switch Community (`POST /api/auth/switch-community`)
**Purpose:** Allow user to change their active community

**Request:**
```json
{
  "communityId": 2
}
```

**Response:**
- Returns new JWT token with updated `currentCommunityId`
- Updates `req.user.currentCommunityId` in middleware

### 2.2 Middleware Updates

#### `authenticateToken` Middleware
**Changes:**
1. Extract `currentCommunityId` from token
2. Verify user still has access to that community
3. Add `req.user.currentCommunityId` and `req.user.communityRole` to request

**Updated Request Object:**
```typescript
interface Request {
  user: {
    id: number;
    email: string;
    currentCommunityId: number;
    communityRole: 'resident' | 'janitorial' | 'admin';
    allCommunities: Array<{id: number, name: string, role: string}>;
  };
}
```

#### `requireRole` Middleware
**Changes:**
- Check `req.user.communityRole` instead of `req.user.role`
- Verify user has appropriate role in current community

### 2.3 API Endpoint Updates

All endpoints need to filter by `community_id` from `req.user.currentCommunityId`.

#### Examples:

**GET /api/reservations**
```typescript
const whereClause: any = { 
  userId: req.user.id,
  communityId: req.user.currentCommunityId  // NEW
};
```

**GET /api/amenities**
```typescript
const amenities = await Amenity.findAll({
  where: { 
    communityId: req.user.currentCommunityId,  // NEW
    isActive: true 
  }
});
```

**POST /api/reservations**
```typescript
const reservation = await Reservation.create({
  ...reservationData,
  userId: req.user.id,
  communityId: req.user.currentCommunityId  // NEW
});
```

**GET /api/reservations/all** (Admin/Janitorial)
```typescript
const reservations = await Reservation.findAll({
  where: { 
    communityId: req.user.currentCommunityId  // NEW
  },
  include: [...]
});
```

### 2.4 New Admin Endpoints

#### Community Management (Admin only, global admin or community admin)
- `GET /api/communities` - List all communities user belongs to
- `GET /api/communities/:id` - Get community details
- `POST /api/communities` - Create new community (if global admin)
- `PUT /api/communities/:id` - Update community
- `DELETE /api/communities/:id` - Deactivate community
- `GET /api/communities/:id/users` - List users in community
- `POST /api/communities/:id/users` - Add user to community
- `PUT /api/communities/:id/users/:userId` - Update user's role in community
- `DELETE /api/communities/:id/users/:userId` - Remove user from community

---

## Phase 3: Frontend Changes

### 3.1 AuthContext Updates

**Current State:**
```typescript
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'resident' | 'janitorial' | 'admin';
}
```

**New State:**
```typescript
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface Community {
  id: number;
  name: string;
  role: 'resident' | 'janitorial' | 'admin';
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  currentCommunity: Community | null;
  communities: Community[];
  switchCommunity: (communityId: number) => Promise<void>;
  // ... other methods
}
```

**New Methods:**
- `switchCommunity(communityId)` - Switch active community and update token
- `getUserRole()` - Get user's role in current community
- `isAdmin()`, `isJanitorial()`, `isResident()` - Check role in current community

### 3.2 UI Components

#### Community Selector Component
**Location:** Header component (top right or top center)

**Functionality:**
- Dropdown showing all communities user belongs to
- Current community highlighted
- Click to switch community
- Shows role badge (Admin/Janitorial/Resident) for current community

**Visual Design:**
```
[Community Name ▼] [Role Badge]
  └─ Sunset Valley HOA ✓ (Admin)
  └─ Riverside Community (Resident)
  └─ Oak Tree Community (Janitorial)
```

#### Update Header Component
- Replace single role display with community selector
- Show current community name prominently
- Role-based navigation should use `currentCommunity.role`

### 3.3 Page Updates

All pages need to:
1. Use `currentCommunity` from context
2. Display community-specific data
3. Handle community switching gracefully (refresh data when community changes)

**Pages to Update:**
- Calendar
- ReservationsPage
- JanitorialPage
- AdminPage
- ProfilePage

**Example:**
```typescript
const { currentCommunity, switchCommunity } = useAuth();

// When community switches, refresh all data
useEffect(() => {
  fetchReservations();
  fetchAmenities();
}, [currentCommunity?.id]);
```

### 3.4 Admin Pages

#### New Community Management Page
**Route:** `/app/admin/communities`

**Features:**
- List all communities user is admin of
- View community details
- Manage community users (add/remove/change roles)
- Manage community amenities
- Edit community settings

---

## Phase 4: Data Migration Strategy

### 4.1 Migration Script

**Steps:**
1. Create `communities` table
2. Create `community_users` table
3. Create `community_amenities` table (if using join table approach)
4. Create default community "Default Community"
5. Add `community_id` columns to `amenities` and `reservations`
6. Migrate existing data:
   - Assign all users to default community with their current role
   - Assign all amenities to default community
   - Assign all reservations to default community
7. Make `community_id` NOT NULL after migration
8. Update indexes and constraints

**Migration Script Location:** `backend/migrations/migrate-to-multi-community.js`

**Safety:**
- Run in transaction if possible
- Create backup before migration
- Test on staging first
- Rollback plan available

### 4.2 Data Migration Details

```sql
-- Step 1: Create default community
INSERT INTO communities (name, description, is_active)
VALUES ('Default Community', 'Migrated from single-community system', true)
RETURNING id;

-- Step 2: Assign all users to default community with their current role
INSERT INTO community_users (community_id, user_id, role, is_active)
SELECT 
  (SELECT id FROM communities WHERE name = 'Default Community'),
  id,
  role,
  is_active
FROM users;

-- Step 3: Assign all amenities to default community
UPDATE amenities 
SET community_id = (SELECT id FROM communities WHERE name = 'Default Community')
WHERE community_id IS NULL;

-- Step 4: Assign all reservations to default community
UPDATE reservations 
SET community_id = (SELECT id FROM communities WHERE name = 'Default Community')
WHERE community_id IS NULL;

-- Step 5: Make community_id required
ALTER TABLE amenities ALTER COLUMN community_id SET NOT NULL;
ALTER TABLE reservations ALTER COLUMN community_id SET NOT NULL;
```

---

## Phase 5: Implementation Order

### Step 1: Database Schema (Backend Only)
1. Create migration script
2. Create `Community` and `CommunityUser` Sequelize models
3. Update existing models (`Amenity`, `Reservation`) with `community_id`
4. Update model associations
5. Run migration on development database
6. Test migration on staging database

### Step 2: Backend API - Authentication
1. Update JWT token structure
2. Update login endpoint to return communities
3. Create switch-community endpoint
4. Update authentication middleware
5. Update role-checking middleware
6. Test authentication flow

### Step 3: Backend API - Data Filtering
1. Update all endpoints to filter by `community_id`
2. Update reservations endpoints
3. Update amenities endpoints
4. Update calendar endpoints
5. Update admin/janitorial endpoints
6. Test all endpoints with community filtering

### Step 4: Backend API - Community Management
1. Create community CRUD endpoints
2. Create community user management endpoints
3. Add authorization checks (only admins can manage)
4. Test community management

### Step 5: Frontend - AuthContext
1. Update `AuthContext` interface and state
2. Update `login` method to handle communities
3. Add `switchCommunity` method
4. Update role-checking methods
5. Test context updates

### Step 6: Frontend - UI Components
1. Create `CommunitySelector` component
2. Update `Header` to include community selector
3. Update all pages to use `currentCommunity`
4. Add loading states during community switch
5. Test UI updates

### Step 7: Frontend - Admin Pages
1. Create community management page
2. Add user management within communities
3. Update existing admin pages for community context
4. Test admin functionality

### Step 8: Testing & Polish
1. Test multi-community scenarios
2. Test user with multiple communities and roles
3. Test community switching
4. Test data isolation (users can't see other communities' data)
5. Performance testing
6. Fix any issues

---

## Phase 6: Considerations & Edge Cases

### 6.1 User Experience
- **Community Switching:** Should be fast (< 500ms). Consider optimistic updates.
- **Data Refresh:** When switching communities, all data should refresh automatically.
- **Default Community:** On first login, select first community or last used (stored in localStorage).
- **No Communities:** Handle case where user belongs to no communities (rare, but possible).

### 6.2 Authorization
- **Cross-Community Access:** Users should NEVER see data from communities they don't belong to.
- **Role Verification:** Always verify user's role in CURRENT community, not their global role.
- **Admin Permissions:** Community admins can only manage their community, not others.

### 6.3 Data Integrity
- **Cascade Deletes:** When community is deleted, delete all related data OR mark as inactive.
- **Foreign Keys:** All `community_id` foreign keys should have proper constraints.
- **Unique Constraints:** Ensure amenities/reservations are unique within community scope.

### 6.4 Performance
- **Indexes:** Add indexes on `community_id` columns:
  ```sql
  CREATE INDEX idx_reservations_community_id ON reservations(community_id);
  CREATE INDEX idx_amenities_community_id ON amenities(community_id);
  CREATE INDEX idx_community_users_community_id ON community_users(community_id);
  CREATE INDEX idx_community_users_user_id ON community_users(user_id);
  ```
- **Query Optimization:** Ensure all queries use `community_id` in WHERE clause.
- **Caching:** Consider caching community list for user (but invalidate on role changes).

### 6.5 Backwards Compatibility
- **Existing API Calls:** All existing API calls should continue to work (they'll just be scoped to a community).
- **Token Expiration:** Old tokens without `currentCommunityId` should trigger re-login.
- **Gradual Rollout:** Consider feature flag for multi-community to test with subset of users first.

---

## Phase 7: Testing Checklist

### Database Tests
- [ ] Migration script runs successfully
- [ ] All existing data is preserved and assigned to default community
- [ ] Foreign key constraints work correctly
- [ ] Unique constraints prevent duplicate memberships

### Backend API Tests
- [ ] Login returns list of communities
- [ ] Switch community endpoint works
- [ ] All endpoints filter by community_id correctly
- [ ] Users can't access other communities' data
- [ ] Role checks work per community
- [ ] Community management endpoints work for admins

### Frontend Tests
- [ ] Community selector appears in header
- [ ] Switching community updates UI correctly
- [ ] All pages refresh data when community changes
- [ ] Role-based navigation works correctly
- [ ] Admin pages show community-specific data
- [ ] Multi-community user can switch between communities

### Integration Tests
- [ ] User with multiple communities can access each
- [ ] User with different roles in different communities sees correct permissions
- [ ] Creating reservation scopes to current community
- [ ] Admin can manage only their community

---

## Estimated Timeline

- **Phase 1 (Database Schema):** 2-3 days
- **Phase 2 (Backend API):** 4-5 days
- **Phase 3 (Frontend Updates):** 3-4 days
- **Phase 4 (Data Migration):** 1-2 days
- **Phase 5 (Testing & Polish):** 2-3 days

**Total: ~12-17 days** (depending on complexity and testing thoroughness)

---

## Questions to Address Before Implementation

1. **Amenity Approach:** Join table (`community_amenities`) or direct `community_id` on `amenities`?
   - **Recommendation:** Direct `community_id` (simpler, each amenity belongs to one community)

2. **User's Default Role:** Keep `role` column in `users` table or remove it?
   - **Recommendation:** Keep as fallback/default, but always use `community_users.role` for authorization

3. **Global Admins:** Should there be a "super admin" that can manage all communities?
   - **Recommendation:** Not needed initially, but keep structure flexible for future

4. **Community Creation:** Who can create new communities?
   - **Recommendation:** Initially manual (via database/API), later add UI for super admins

5. **Community Deletion:** Hard delete or soft delete (mark inactive)?
   - **Recommendation:** Soft delete (mark `is_active = false`) to preserve data

---

## Next Steps

1. **Review this plan** and provide feedback
2. **Decide on approach questions** above
3. **Create detailed technical specifications** for each phase
4. **Set up development branch** for multi-community feature
5. **Begin Phase 1 implementation** once approved

---

## Notes

- This is a **significant architectural change** that touches nearly every part of the system
- **Test thoroughly** at each phase before moving to the next
- **Consider feature flags** to enable multi-community gradually
- **Document all changes** for future reference
- **Backup database** before running migrations

