# Codebase Cleanup Report

## Files to Remove

### ✅ SQL Migration Files (One-time migrations - already applied)
These SQL files were used for one-time database migrations and can be safely removed:

1. `backend/add-amenity-operational-fields.sql`
2. `backend/add-approval-required-field.sql`
3. `backend/add-calendar-group-to-amenities.sql`
4. `backend/add-community-fields.sql`
5. `backend/add-onboarding-fields.sql`
6. `backend/add-public-amenity-fields.sql`
7. `backend/create-prospects-table.sql`
8. `backend/update-community-access-codes.sql`
9. `backend/migrate-multi-community.sql`
10. `backend/migrate-multi-community-fixed.sql`
11. `backend/populate-demo-community.sql` (if demo community is already populated)

### ✅ JavaScript Migration Scripts (One-time migrations - already applied)
These Node.js scripts were used for one-time data migrations:

1. `backend/migrate-damage-assessment-fields.js`
2. `backend/migrate-demo-accounts.js`
3. `backend/migrate-event-name-fields.js`
4. `backend/migrate-to-multi-community.js`
5. `backend/setup-database-tables.js`
6. `backend/setup-database.js`
7. `backend/update-user-schema.js`
8. `backend/add-email-verification-columns.js`
9. `backend/add-missing-columns.js`
10. `backend/test-connection.js` (temporary test script)
11. `backend/verify-env.js` (temporary verification script)

### ✅ Unused Frontend Components
1. `frontend/src/components/SimpleCalendar.tsx` - Not imported anywhere, replaced by `Calendar.tsx`

### ✅ Temporary HTML Files
1. `frontend/public/run-migration.html` - Temporary migration helper (if it exists)
2. `frontend/build/run-migration.html` - Build output (should be in .gitignore)

### ✅ Outdated Documentation Files
These documentation files may be outdated or redundant:

1. `backend/CREATE-ENV-FOR-MIGRATION.md` - Migration-specific docs
2. `backend/RUN-MIGRATION-IN-PGADMIN.md` - Migration-specific docs
3. `backend/TEST-PHASE1-MIGRATION.md` - Migration-specific docs
4. `backend/POPULATE-DEMO-COMMUNITY.md` - One-time instruction docs
5. `RUN-MIGRATION-VIA-API.md` - Migration-specific docs
6. `Registration-Verification-Plan.md` - Planning doc (if verification is implemented)
7. `PARTY-COMPLETION-WORKFLOW.md` - Planning doc (if workflow is implemented)
8. `Implementation-Checklist.md` - Planning doc (if all items are complete)
9. `IMPLEMENTATION-STATUS.md` - Planning doc (if outdated)
10. `PAYMENT-UI-UPDATES.md` - Planning doc (if updates complete)
11. `PAYMENT-MODEL-REVISED.md` - Planning doc (if implemented)
12. `MULTI-COMMUNITY-ARCHITECTURE-PLAN.md` - Planning doc (if architecture is implemented)

### ✅ Keep These Documentation Files (Reference/Active)
- `README.md` - Main project README
- `HOA-Amenities-PRD.md` - Product Requirements Document
- `Implementation-Details.md` - Critical implementation knowledge
- `DEPLOYMENT-GUIDE.md` - Deployment instructions
- `VERCEL-RAILWAY-SETUP-GUIDE.md` - Setup guide
- `PGADMIN-CONNECTION-GUIDE.md` - Database connection guide
- `RAILWAY-DATABASE-ACCESS.md` - Database access guide
- `frontend/README.md` - Frontend-specific README

### ✅ Build Directories (Should be in .gitignore)
These should already be ignored, but if they're tracked:
- `backend/dist/` - Compiled TypeScript output
- `frontend/build/` - Compiled React output

### ✅ Environment Template Files (Keep)
- `backend/env-template.txt` - Keep for reference
- `backend/env.example` - Keep for reference
- `frontend/env.example` - Keep for reference

## Summary

**Total files to remove: ~35-40 files**

**Categories:**
- SQL migrations: 11 files
- JavaScript migrations: 11 files
- Unused components: 1 file
- Temporary HTML: 1-2 files
- Outdated docs: ~12 files

**Recommendation:**
1. Review the documentation files to ensure they're truly outdated before deletion
2. Keep migration files in a separate `migrations/archive/` folder if you want historical reference
3. Remove unused components and temporary files immediately
4. Ensure build directories are properly in .gitignore

