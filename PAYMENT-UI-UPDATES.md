# Payment Model UI/UX Updates Required

## **Revised Payment Model**
- **Reservation Fee**: Charged immediately at booking ($125 Clubroom, $25 Pool)
- **Potential Damage Fee**: NOT charged upfront, only if damages occur ($75 Clubroom, $50 Pool)

---

## **UI Changes Required**

### **1. Reservation Modal (Create Reservation)**

**Current Display:**
```
[Selected Amenity Details]
Total Cost: $200.00
($125.00 fee + $75.00 deposit)
```

**New Display:**
```
[Selected Amenity Details]
Reservation Fee: $125.00
(Charged at booking)

Potential Damage Fee: $75.00
(Only charged if damages occur)
```

**In Dropdown:**
- **Current**: `Clubroom - $125.00 fee, $75.00 deposit`
- **New**: `Clubroom - $125.00 reservation fee (Potential damage fee: $75.00 if damages occur)`

---

### **2. Reservation Summary (My Reservations Page)**

**Current Display:**
```
Total Cost: $200.00
($125.00 fee + $75.00 deposit)
```

**New Display:**
```
Payment Required Now: $125.00
(Reservation fee)

Possible Future Charge: Up to $75.00
(Only if damages occur)
```

**Or Simplified:**
```
Reservation Fee: $125.00 (PAID)
Potential Damage Fee: $75.00 (Not charged - pending assessment)
```

---

### **3. Individual Reservation Details**

**Current Display:**
```
$200.00
($125.00 fee + $75.00 deposit)
```

**New Display:**
```
Reservation Fee: $125.00 (PAID)
Potential Damage Fee: $75.00 (Not charged - pending assessment)
```

**After Completion (No Damages):**
```
Reservation Fee: $125.00 (PAID)
Damage Assessment: No damages found - No charge
```

**After Completion (With Damages):**
```
Reservation Fee: $125.00 (PAID)
Damage Assessment: $50.00 charged
```

---

### **4. Janitorial Page**

**Current Display:**
```
$200.00
($125.00 fee + $75.00 deposit)
```

**New Display:**
```
Reservation Fee: $125.00 (PAID)
Potential Damage Fee: $75.00 (Pending assessment)
```

---

### **5. Event Details Modal**

**Current Display:**
- Shows totalFee and totalDeposit combined

**New Display:**
- Show reservation fee (PAID)
- Show potential damage fee (pending or assessed amount)

---

## **Database/Backend Updates Needed**

### **Terminology Updates**
1. Rename fields for clarity:
   - Keep `deposit` field (but treat as "potential damage fee")
   - Add `damageCharge` field (actual amount charged, if any)
   - Add `damageAssessed` boolean
   - Add `damageNotes` text field

2. Update calculations:
   - Reservation total = reservation fee only (not fee + deposit)
   - Payment processing = reservation fee only
   - Damage charge = separate payment if damages occur

### **API Response Changes**
**Reservation Object:**
```json
{
  "totalFee": 125.00,
  "potentialDamageFee": 75.00,
  "damageCharge": null,
  "damageAssessed": false,
  "damageNotes": null
}
```

---

## **Text/Wording Updates**

### **Terminology Changes**
- ❌ "Deposit" → ✅ "Potential Damage Fee" or "Damage Fee"
- ❌ "Total Cost" (fee + deposit) → ✅ "Reservation Fee" (only what's charged now)
- ❌ "Deposit refund" → ✅ "Damage assessment" (no refund needed - wasn't charged)

### **User-Facing Messages**
- "Reservation Fee" (what you pay now)
- "Potential Damage Fee" (what you might pay later if damages occur)
- "Only charged if damages occur"
- "Pending damage assessment"
- "No damages found - no charge"

---

## **Implementation Checklist**

### **Frontend Changes**
- [ ] Update ReservationModal.tsx to show new fee structure
- [ ] Update ReservationsPage.tsx to show new payment breakdown
- [ ] Update JanitorialPage.tsx to show damage assessment status
- [ ] Update Calendar event details modal
- [ ] Update all "deposit" terminology to "potential damage fee"
- [ ] Update total cost calculations (remove deposit from "total")

### **Backend Changes**
- [ ] Update reservation model comments/documentation
- [ ] Add damageCharge field to Reservation model
- [ ] Add damageAssessed field to Reservation model
- [ ] Add damageNotes field to Reservation model
- [ ] Update API responses to reflect new terminology
- [ ] Update reservation creation to not calculate "total" as fee+deposit

### **Payment Integration (Future)**
- [ ] Charge only reservation fee at booking
- [ ] Create separate damage charge workflow (if damages occur)
- [ ] Payment type: RESERVATION_FEE vs DAMAGE_FEE

---

## **Questions for Clarification**

Before implementing Square integration, please confirm:

1. **Who can assess damages?**
   - Janitorial only?
   - Admin only?
   - Both?

2. **Can partial damage amounts be charged?**
   - Example: $30 of $75 if damages are minor?
   - Or must it be the full $75?

3. **Can damage charge exceed potential damage fee?**
   - Example: Clubroom damage fee is $75, but damages cost $100
   - Can admin charge $100, or limited to $75?

4. **Time limit for damage assessment?**
   - Within 24 hours after party completion?
   - Or can it be assessed later?

5. **Damage assessment workflow:**
   - Can janitorial assess and charge directly?
   - Or must admin approve/charge?
   - Does janitorial assess, then admin charges?

6. **UI for damage assessment:**
   - Where does damage assessment happen? (Janitorial page? Admin page? Separate page?)
   - What fields are needed? (Amount, description, photos?)

---

**Ready to update UI once you confirm the questions above!**

