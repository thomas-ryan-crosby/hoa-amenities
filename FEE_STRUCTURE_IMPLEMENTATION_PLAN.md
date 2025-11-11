# Fee Structure Implementation Plan

## Overview
Add configurable modification and cancellation fees to amenities with a default suggested structure.

## Default Fee Structure
- **Cancel >14 days**: Full refund
- **Cancel 7–14 days**: $50 admin fee
- **Cancel <7 days**: Full rental fee / deposit forfeited
- **One date/time change >7 days**: No charge
- **Additional change**: $25 each
- **No-show**: Full rental fee

## Database Changes

### Amenity Model - New Fields
1. `cancellationFeeEnabled` (boolean, default: true)
2. `modificationFeeEnabled` (boolean, default: true)
3. `cancellationFeeStructure` (JSON/TEXT) - Store fee rules
4. `modificationFeeStructure` (JSON/TEXT) - Store fee rules

### Fee Structure JSON Format
```json
{
  "cancelOver14Days": { "fee": 0, "type": "refund" },
  "cancel7To14Days": { "fee": 50, "type": "fixed" },
  "cancelUnder7Days": { "fee": 0, "type": "full_fee" },
  "firstChangeOver7Days": { "fee": 0, "type": "free" },
  "additionalChange": { "fee": 25, "type": "fixed" },
  "noShow": { "fee": 0, "type": "full_fee" }
}
```

## Implementation Steps

1. **Create SQL migration** to add new fields to amenities table
2. **Update Amenity model** with new fields
3. **Update AdminPage.tsx** to include fee configuration UI
4. **Update backend routes** to accept new fields
5. **Update fee calculation functions** to use amenity-specific fee structures
6. **Track modification count** in reservations to handle "additional change" logic

## UI Design

In AdminPage.tsx, add a new section:
- Checkbox: "Enable Cancellation Fees" (default: checked)
- Checkbox: "Enable Modification Fees" (default: checked)
- If enabled, show fee structure table (read-only, showing default structure)
- Note: "You can customize these fees per amenity in the future"

## Fee Calculation Logic

1. Check if fees are enabled for the amenity
2. If disabled, return { fee: 0, reason: 'Fees disabled for this amenity' }
3. If enabled, use the amenity's fee structure (or default if not set)
4. Calculate based on days until reservation and action type

