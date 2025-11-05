# Codebase Cleanup Script
# This script removes temporary migration files, unused components, and outdated documentation

Write-Host "Starting codebase cleanup..." -ForegroundColor Green

# SQL Migration Files
$sqlFiles = @(
    "backend\update-community-access-codes.sql",
    "backend\migrate-multi-community.sql",
    "backend\migrate-multi-community-fixed.sql",
    "backend\populate-demo-community.sql"
)

# JavaScript Migration Scripts
$jsFiles = @(
    "backend\migrate-damage-assessment-fields.js",
    "backend\migrate-demo-accounts.js",
    "backend\migrate-event-name-fields.js",
    "backend\migrate-to-multi-community.js",
    "backend\setup-database-tables.js",
    "backend\setup-database.js",
    "backend\update-user-schema.js",
    "backend\add-email-verification-columns.js",
    "backend\add-missing-columns.js",
    "backend\test-connection.js",
    "backend\verify-env.js"
)

# Unused Components
$unusedComponents = @(
    "frontend\src\components\SimpleCalendar.tsx"
)

# Temporary HTML Files
$htmlFiles = @(
    "frontend\public\run-migration.html",
    "frontend\build\run-migration.html"
)

# Outdated Documentation Files
$outdatedDocs = @(
    "backend\CREATE-ENV-FOR-MIGRATION.md",
    "backend\RUN-MIGRATION-IN-PGADMIN.md",
    "backend\TEST-PHASE1-MIGRATION.md",
    "backend\POPULATE-DEMO-COMMUNITY.md",
    "RUN-MIGRATION-VIA-API.md",
    "Registration-Verification-Plan.md",
    "PARTY-COMPLETION-WORKFLOW.md",
    "Implementation-Checklist.md",
    "IMPLEMENTATION-STATUS.md",
    "PAYMENT-UI-UPDATES.md",
    "PAYMENT-MODEL-REVISED.md",
    "MULTI-COMMUNITY-ARCHITECTURE-PLAN.md"
)

# Combine all files
$allFiles = $sqlFiles + $jsFiles + $unusedComponents + $htmlFiles + $outdatedDocs

$deletedCount = 0
$notFoundCount = 0

foreach ($file in $allFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Deleted: $file" -ForegroundColor Yellow
        $deletedCount++
    } else {
        Write-Host "Not found: $file" -ForegroundColor Gray
        $notFoundCount++
    }
}

Write-Host "`nCleanup complete!" -ForegroundColor Green
Write-Host "Deleted: $deletedCount files" -ForegroundColor Green
Write-Host "Not found: $notFoundCount files" -ForegroundColor Gray

