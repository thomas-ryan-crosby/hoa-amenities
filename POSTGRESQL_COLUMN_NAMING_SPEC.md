# PostgreSQL Column Naming Specification

## Overview
This document establishes the standard for handling PostgreSQL column names in this codebase to avoid "column does not exist" errors (PostgreSQL error code 42703).

## Key Principle
**PostgreSQL stores unquoted identifiers in lowercase, but quoted identifiers preserve their exact case.**

## Column Naming Rules

### 1. Sequelize-Created Columns (Quoted Identifiers)
When Sequelize creates tables, it uses **quoted identifiers** which preserve camelCase:
- `"userId"` → stored as `userId` (camelCase preserved)
- `"partyTimeStart"` → stored as `partyTimeStart` (camelCase preserved)
- `"communityId"` → stored as `communityId` (camelCase preserved)

**In raw SQL queries, these columns MUST be quoted:**
```sql
SELECT * FROM reservations WHERE "userId" = 123;
UPDATE reservations SET "partyTimeStart" = '2025-01-01';
```

### 2. Manually-Created Columns (Unquoted Identifiers)
When columns are created via raw SQL without quotes, PostgreSQL converts them to lowercase:
- `modificationstatus` → stored as `modificationstatus` (lowercase)
- `proposeddate` → stored as `proposeddate` (lowercase)
- `proposedpartytimestart` → stored as `proposedpartytimestart` (lowercase)

**In raw SQL queries, these columns MUST be lowercase and unquoted:**
```sql
SELECT * FROM reservations WHERE modificationstatus = 'PENDING';
UPDATE reservations SET proposeddate = '2025-01-01';
```

### 3. Mixed Naming (Current Database State)
Our database has a mix:
- **Sequelize-created columns**: Use quoted camelCase (`"userId"`, `"partyTimeStart"`, `"communityId"`)
- **Migration-created columns**: Use lowercase unquoted (`modificationstatus`, `proposeddate`, `proposedpartytimestart`)

## Rules for Raw SQL Queries

### ✅ DO:
1. **Use quoted identifiers for Sequelize-created columns:**
   ```sql
   WHERE "userId" = :userId
   WHERE "partyTimeStart" < :endTime
   WHERE "communityId" = :communityId
   ```

2. **Use lowercase unquoted for migration-created columns:**
   ```sql
   WHERE modificationstatus = 'PENDING'
   WHERE LOWER(modificationstatus) = 'pending'
   WHERE proposeddate IS NULL
   ```

3. **Use LOWER() for case-insensitive comparisons:**
   ```sql
   WHERE LOWER(modificationstatus) = 'pending'
   ```

### ❌ DON'T:
1. **Don't mix quoted and unquoted in OR clauses:**
   ```sql
   -- BAD: PostgreSQL will try to evaluate both and fail if one doesn't exist
   WHERE ("partyTimeStart" < :end OR partytimestart < :end)
   ```

2. **Don't use camelCase without quotes for migration columns:**
   ```sql
   -- BAD: Will look for "modificationStatus" which doesn't exist
   WHERE modificationStatus = 'PENDING'
   ```

3. **Don't use lowercase without quotes for Sequelize columns:**
   ```sql
   -- BAD: Will look for "userid" which doesn't exist
   WHERE userid = 123
   ```

## Sequelize ORM Usage

### When Using Sequelize Methods (findOne, findAll, update):
- Use camelCase attribute names as defined in the model
- Sequelize handles the mapping automatically
- Example:
  ```typescript
  Reservation.findOne({
    where: { userId: 123 }  // Sequelize maps to "userId"
  })
  ```

### When Using col() Mapping:
- Use `col('lowercasename')` for migration-created columns
- Use `col('"camelCaseName"')` for Sequelize-created columns (if needed)
- Example:
  ```typescript
  attributes: [
    [col('modificationstatus'), 'modificationStatus'],  // lowercase DB → camelCase response
    'userId'  // Sequelize handles this automatically
  ]
  ```

## Common Column Patterns

### Sequelize-Created (Quoted CamelCase):
- `"userId"`
- `"amenityId"`
- `"communityId"`
- `"partyTimeStart"`
- `"partyTimeEnd"`
- `"setupTimeStart"`
- `"setupTimeEnd"`
- `"cleaningTimeStart"`
- `"cleaningTimeEnd"`

### Migration-Created (Lowercase Unquoted):
- `modificationstatus`
- `proposeddate`
- `proposedpartytimestart`
- `proposedpartytimeend`
- `modificationreason`
- `modificationproposedby`
- `modificationproposedat`

## Error Handling

When encountering "column does not exist" errors (42703):

1. **Check the actual column name in the database:**
   ```sql
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_name = 'reservations' 
   AND LOWER(column_name) = 'modificationstatus';
   ```

2. **Verify if it's quoted or unquoted:**
   - Quoted columns preserve case: `"userId"`
   - Unquoted columns are lowercase: `modificationstatus`

3. **Update the query accordingly:**
   - If quoted: Use `"camelCase"` in SQL
   - If unquoted: Use `lowercase` in SQL

## Testing Checklist

Before deploying code that uses raw SQL:
- [ ] Verify column names match database schema
- [ ] Test with both quoted and unquoted column names if unsure
- [ ] Check Railway logs for column name errors
- [ ] Use `LOWER()` for case-insensitive comparisons when appropriate

## Examples

### Correct Conflict Check Query:
```sql
SELECT id FROM reservations
WHERE "amenityId" = :amenityId
  AND "communityId" = :communityId
  AND date = :proposedDate
  AND status IN ('NEW', 'JANITORIAL_APPROVED', 'FULLY_APPROVED')
  AND id != :reservationId
  AND "partyTimeStart" < :proposedEnd 
  AND "partyTimeEnd" > :proposedStart
```

### Correct Modification Status Check:
```sql
SELECT * FROM reservations
WHERE id = :id
  AND "userId" = :userId
  AND LOWER(modificationstatus) = 'pending'
```

### Correct Update Query:
```sql
UPDATE reservations
SET modificationstatus = 'ACCEPTED',
    proposeddate = NULL,
    "partyTimeStart" = :startTime,
    "partyTimeEnd" = :endTime
WHERE id = :reservationId
```

## Summary

**Golden Rule:** 
- **Sequelize columns = quoted camelCase** (`"userId"`, `"partyTimeStart"`)
- **Migration columns = lowercase unquoted** (`modificationstatus`, `proposeddate`)
- **When in doubt, check the database schema directly**

