#!/bin/bash
# Codebase Cleanup Script for Unix/Linux/Mac
# This script removes temporary migration files, unused components, and outdated documentation

echo "Starting codebase cleanup..."

# SQL Migration Files
SQL_FILES=(
    "backend/update-community-access-codes.sql"
    "backend/migrate-multi-community.sql"
    "backend/migrate-multi-community-fixed.sql"
    "backend/populate-demo-community.sql"
)

# JavaScript Migration Scripts
JS_FILES=(
    "backend/migrate-damage-assessment-fields.js"
    "backend/migrate-demo-accounts.js"
    "backend/migrate-event-name-fields.js"
    "backend/migrate-to-multi-community.js"
    "backend/setup-database-tables.js"
    "backend/setup-database.js"
    "backend/update-user-schema.js"
    "backend/add-email-verification-columns.js"
    "backend/add-missing-columns.js"
    "backend/test-connection.js"
    "backend/verify-env.js"
)

# Unused Components
UNUSED_COMPONENTS=(
    "frontend/src/components/SimpleCalendar.tsx"
)

# Temporary HTML Files
HTML_FILES=(
    "frontend/public/run-migration.html"
    "frontend/build/run-migration.html"
)

# Outdated Documentation Files
OUTDATED_DOCS=(
    "backend/CREATE-ENV-FOR-MIGRATION.md"
    "backend/RUN-MIGRATION-IN-PGADMIN.md"
    "backend/TEST-PHASE1-MIGRATION.md"
    "backend/POPULATE-DEMO-COMMUNITY.md"
    "RUN-MIGRATION-VIA-API.md"
    "Registration-Verification-Plan.md"
    "PARTY-COMPLETION-WORKFLOW.md"
    "Implementation-Checklist.md"
    "IMPLEMENTATION-STATUS.md"
    "PAYMENT-UI-UPDATES.md"
    "PAYMENT-MODEL-REVISED.md"
    "MULTI-COMMUNITY-ARCHITECTURE-PLAN.md"
)

# Combine all files
ALL_FILES=("${SQL_FILES[@]}" "${JS_FILES[@]}" "${UNUSED_COMPONENTS[@]}" "${HTML_FILES[@]}" "${OUTDATED_DOCS[@]}")

deleted_count=0
not_found_count=0

for file in "${ALL_FILES[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        echo "Deleted: $file"
        ((deleted_count++))
    else
        echo "Not found: $file"
        ((not_found_count++))
    fi
done

echo ""
echo "Cleanup complete!"
echo "Deleted: $deleted_count files"
echo "Not found: $not_found_count files"

