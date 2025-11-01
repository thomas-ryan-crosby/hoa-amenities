# Revised Payment Model - Neighbri HOA Amenities

## **Payment Philosophy**
**No upfront deposits.** Only charge for actual damages if they occur.

---

## **Payment Flow**

### **1. Reservation Booking**
**What gets charged:**
- ✅ **Reservation Fee** (charged immediately)
  - Clubroom: $125
  - Pool: $25
- ❌ **Damage Fee** (NOT charged upfront)
  - Clubroom: $75 potential damage fee
  - Pool: $50 potential damage fee

**User Experience:**
1. User creates reservation
2. System calculates total: **Reservation Fee only** (not deposit)
3. User pays Reservation Fee via Square
4. Reservation confirmed with status: `NEW`
5. User sees: "Reservation Fee: $125" (or $25 for Pool)
6. User sees: "Potential Damage Fee: $75 if damages occur" (for informational purposes)

---

### **2. After Party Completion**

**Workflow:**
1. Janitorial staff confirms party completion
2. Janitorial/admin inspects the amenity
3. **If NO damages:**
   - No additional charge
   - Reservation marked as `COMPLETED`
   - User notified: "Party completed successfully, no damage charges"

4. **If DAMAGES found:**
   - Janitorial/admin enters damage assessment
   - System creates damage charge (up to the damage fee amount)
   - Admin can charge partial amount (e.g., $30 of $75 if damages are minor)
   - Square payment processing initiated
   - User receives email: "Damage assessment: $XX charged"
   - Reservation marked as `COMPLETED` with damage charge noted

---

## **UI/UX Changes Needed**

### **Reservation Creation Flow**

**Current Display:**
```
Total Cost: $200
($125 fee + $75 deposit)
```

**New Display:**
```
Reservation Fee: $125
(Charged at booking)

Potential Damage Fee: $75
(Only charged if damages occur)
```

**Booking Summary:**
- **Payment Required Now:** $125
- **Possible Future Charge:** Up to $75 (only if damages occur)

---

### **Reservation Details View**

**What to Show:**
- ✅ Reservation Fee: $125 (PAID)
- ⚠️ Potential Damage Fee: $75 (Not charged - pending assessment)
- Status: JANITORIAL_APPROVED

**After Completion (No Damages):**
- ✅ Reservation Fee: $125 (PAID)
- ✅ Damage Assessment: No damages found - No charge
- Status: COMPLETED

**After Completion (With Damages):**
- ✅ Reservation Fee: $125 (PAID)
- ⚠️ Damage Assessment: $50 charged
- Status: COMPLETED

---

### **Janitorial/Admin Interface**

**Damage Assessment Panel:**
- After marking party complete, show damage assessment section:
  ```
  Damage Assessment:
  [ ] No damages
  [ ] Damages found - Amount: $____
  
  [Assess Damage Charge]
  ```

- If damages, admin can:
  - Enter damage amount (up to the damage fee)
  - Add notes/description
  - Charge the amount via Square
  - Send notification to resident

---

## **Database Changes**

**Reservation Model:**
- Keep `totalDeposit` field (rename to `potentialDamageFee` for clarity?)
- Keep `totalFee` field (reservation fee)
- Add `damageCharge` field (actual damage amount charged, if any)
- Add `damageAssessed` boolean field
- Add `damageNotes` text field

**Payment Model:**
- Payment type: `RESERVATION_FEE` or `DAMAGE_FEE`
- Link to reservation
- Track payment status

---

## **Payment Processing Changes**

**Square Integration:**
1. **Reservation Booking:**
   - Charge only reservation fee
   - Create payment record with type `RESERVATION_FEE`

2. **Damage Assessment (If Needed):**
   - Admin/janitorial assesses damage
   - Create separate payment intent for damage fee
   - Charge damage amount via Square
   - Create payment record with type `DAMAGE_FEE`

---

## **Email Notifications**

**Reservation Confirmation:**
```
Thank you for your reservation!

Reservation Fee: $125 (PAID)
Potential Damage Fee: $75 (only charged if damages occur)

[Reservation details...]
```

**After Completion (No Damages):**
```
Your party has been completed successfully!

Damage Assessment: No damages found
No additional charges.

[Reservation details...]
```

**After Completion (With Damages):**
```
Your party has been completed.

Damage Assessment: $50 has been charged for damages.

[Reservation details...]
[Payment receipt...]
```

---

## **Summary of Changes**

1. **No deposit charged upfront** - only reservation fee
2. **Damage fee is informational** - shown but not charged
3. **Damage assessment workflow** - after party completion
4. **Charge only if damages occur** - via Square
5. **Clear communication** - users know upfront they won't be charged for damages unless they occur

---

**Questions for Clarification:**

1. Who assesses damages? (Janitorial only? Admin only? Both?)
2. Can admin charge partial damage amounts? (e.g., $30 of $75)
3. Can admin charge more than the damage fee if damages exceed it?
4. Is there a time limit for damage assessment? (e.g., within 24 hours)
5. Should damage assessment require approval from admin, or can janitorial do it directly?

