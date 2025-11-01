# Party Completion & Damage Assessment Workflow

## **Overview**
After a party is completed, janitorial staff assess damages (if any), and administrators review/approve/adjust the assessment before charging.

---

## **Workflow Steps**

### **Step 1: Party Completion (Janitorial)**
**Who:** Janitorial Staff  
**When:** After party ends and cleaning is complete

1. Janitorial staff marks party as "Complete"
   - Action: Button on Janitorial page or Event Details modal
   - Result: Reservation status changes to `COMPLETED`
   
2. System prompts: "Did you find any damages?"
   - [ ] No damages found
   - [ ] Damages found - Assess damages

**If No Damages:**
- Reservation marked as `COMPLETED`
- Status: "No damage charges"
- Resident receives email: "Party completed successfully, no damage charges"

**If Damages Found:**
- Proceed to damage assessment form

---

### **Step 2: Damage Assessment (Janitorial)**
**Who:** Janitorial Staff  
**Action:** Enter damage details

**Damage Assessment Form:**
```
Damage Assessment Form:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reservation: Clubroom - John Doe
Date: November 2, 2025

Damage Assessment:
Amount: $____ (max: $75.00)
Description: [Text area for damage details]
Notes: [Optional additional notes]

Photos: [Upload damage photos - optional]

[Submit for Admin Review]
```

**Validation:**
- Amount cannot exceed potential damage fee ($75 Clubroom, $50 Pool)
- Description is required if damages are assessed
- Amount must be > 0 if damages found

**After Submission:**
- Reservation status: `COMPLETED` with `damageAssessmentPending: true`
- Damage assessment status: `PENDING_ADMIN_REVIEW`
- Admin receives notification (email + dashboard alert)
- Resident receives email: "Party completed. Damage assessment pending admin review."

---

### **Step 3: Admin Review (Administrator)**
**Who:** Administrator  
**Action:** Review, approve, deny, or adjust damage assessment

**Admin Damage Review Panel:**
```
Damage Assessment Review
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reservation: Clubroom - John Doe (Nov 2, 2025)
Assessed By: Janitorial Staff
Assessment Date: November 3, 2025

Janitorial Assessment:
├─ Amount: $50.00
├─ Description: Minor stains on carpet, wall scuffs
└─ Notes: Cleaned but some damage visible

[View Photos] (if uploaded)

Admin Action:
├─ [Approve as-is] - Charge $50.00
├─ [Adjust Amount] - Enter new amount: $____
├─ [Deny Assessment] - No damages, no charge
└─ [Add Admin Notes] - [Text area]

Admin Notes: [Optional]

[Submit Decision]
```

**Admin Actions:**

1. **Approve as-is:**
   - Charge the janitorial-assessed amount
   - Create Square payment for damage fee
   - Status: `COMPLETED`, `damageAssessed: true`, `damageCharge: $50.00`
   - Resident receives email: "Damage assessment approved. $50.00 has been charged."

2. **Adjust Amount:**
   - Admin can change the amount (still cannot exceed potential damage fee)
   - Charge the adjusted amount
   - Status: `COMPLETED`, `damageAssessed: true`, `damageCharge: $adjusted_amount`
   - Resident receives email: "Damage assessment adjusted to $X.XX. This amount has been charged."
   - Janitorial receives notification of adjustment

3. **Deny Assessment:**
   - No damage charge
   - Status: `COMPLETED`, `damageAssessed: false`, `damageCharge: null`
   - Resident receives email: "Party completed successfully. Admin reviewed and found no damages. No charges."
   - Janitorial receives notification of denial (with admin notes if provided)

---

## **UI/UX Design**

### **Janitorial Page - Party Completion**

**For Active/Upcoming Reservations:**
```
[Reservation Card]
┌─────────────────────────────────────┐
│ Clubroom - John Doe                │
│ Nov 2, 2025 | 4:00 AM - 12:00 PM   │
│ Status: FULLY_APPROVED              │
│                                     │
│ [Mark Party Complete]               │
└─────────────────────────────────────┘
```

**After "Mark Party Complete" Click:**
```
[Modal: Party Completion]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Party completed successfully?

Did you find any damages?
○ No damages found
○ Damages found - Assess damages

[Cancel]  [Continue]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**If "No damages":**
- Confirmation: "Party marked as complete with no damages."
- Reservation updated immediately
- Email sent to resident

**If "Damages found":**
- Opens damage assessment form (as described above)

---

### **Admin Page - Damage Review Section**

**New Tab/Section:** "Damage Reviews"

```
[Admin Dashboard]
├─ Users
├─ Damage Reviews (NEW) ← Shows pending reviews
└─ Settings

[Damage Reviews Tab]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pending Reviews: 2

[Review Card 1]
┌─────────────────────────────────────┐
│ Clubroom - John Doe                 │
│ Nov 2, 2025                         │
│ Assessed: $50.00                     │
│ Assessed By: Janitorial Staff       │
│ Date: Nov 3, 2025                   │
│                                     │
│ [Review Assessment]                  │
└─────────────────────────────────────┘

[Review Card 2]
┌─────────────────────────────────────┐
│ Pool - Jane Smith                   │
│ Nov 5, 2025                         │
│ Assessed: $30.00                     │
│ Assessed By: Janitorial Staff       │
│ Date: Nov 6, 2025                   │
│                                     │
│ [Review Assessment]                  │
└─────────────────────────────────────┘
```

---

### **Reservation Details - Status Display**

**During Assessment:**
```
Status: COMPLETED
Damage Assessment: Pending Admin Review
  └─ Assessed Amount: $50.00
  └─ Submitted: Nov 3, 2025
```

**After Admin Decision:**
```
Status: COMPLETED
Damage Assessment: Approved
  └─ Amount Charged: $50.00
  └─ Charged: Nov 4, 2025
```

Or:
```
Status: COMPLETED
Damage Assessment: Denied
  └─ No charges applied
```

---

## **Database Schema Updates**

### **Reservation Model - Add Fields:**

```typescript
interface ReservationAttributes {
  // ... existing fields ...
  
  // Damage Assessment Fields
  damageAssessed: boolean;              // Was damage assessment completed?
  damageAssessmentPending: boolean;     // Awaiting admin review?
  damageAssessmentStatus: 'PENDING' | 'APPROVED' | 'ADJUSTED' | 'DENIED' | null;
  damageCharge: number | null;          // Actual amount charged (if any)
  damageChargeAmount: number | null;    // Amount assessed by janitorial
  damageChargeAdjusted: number | null;  // Amount adjusted by admin (if adjusted)
  damageDescription: string | null;     // Janitorial's damage description
  damageNotes: string | null;           // Janitorial's notes
  adminDamageNotes: string | null;     // Admin's notes (if adjusted/denied)
  damageAssessedBy: number | null;     // User ID of janitorial staff
  damageReviewedBy: number | null;     // User ID of admin who reviewed
  damageAssessedAt: Date | null;       // When janitorial assessed
  damageReviewedAt: Date | null;        // When admin reviewed
  damagePhotos: string[] | null;       // URLs to damage photos (if uploaded)
}
```

---

## **API Endpoints Needed**

### **1. Mark Party Complete (Janitorial)**
```
PUT /api/reservations/:id/complete
Body: {
  damagesFound: boolean
}

If damagesFound === false:
  → Sets status to COMPLETED
  → Sets damageAssessed: false

If damagesFound === true:
  → Opens damage assessment workflow
```

### **2. Assess Damages (Janitorial)**
```
POST /api/reservations/:id/assess-damages
Body: {
  amount: number,
  description: string,
  notes?: string,
  photos?: string[]
}

Response: Sets damage assessment to PENDING status
```

### **3. Review Damage Assessment (Admin)**
```
PUT /api/reservations/:id/review-damage-assessment
Body: {
  action: 'approve' | 'adjust' | 'deny',
  amount?: number,  // Required if 'adjust'
  adminNotes?: string
}

Response: Updates damage assessment status
  If approve: Charges amount via Square
  If adjust: Charges adjusted amount via Square
  If deny: No charge, updates status
```

### **4. Get Pending Damage Reviews (Admin)**
```
GET /api/admin/damage-reviews
Query: ?status=pending

Response: Array of reservations with pending damage assessments
```

---

## **Email Notifications**

### **1. Party Completed - No Damages**
```
Subject: Party Completed Successfully - No Charges

Your party has been completed successfully!
No damages were found, so no additional charges apply.

[Reservation details...]
```

### **2. Damage Assessment Pending**
```
Subject: Party Completed - Damage Assessment Pending Review

Your party has been completed. Janitorial staff found some damages.

Assessed Amount: $50.00
Description: [damage description]

This assessment is pending admin review. You will be notified once reviewed.

[Reservation details...]
```

### **3. Damage Assessment Approved**
```
Subject: Damage Assessment Approved - Charge Applied

Admin has reviewed and approved the damage assessment.

Amount Charged: $50.00
Payment Method: [from Square]

[Reservation details...]
[Payment receipt...]
```

### **4. Damage Assessment Adjusted**
```
Subject: Damage Assessment Adjusted - Charge Applied

Admin has reviewed and adjusted the damage assessment.

Original Assessment: $50.00
Adjusted Amount: $30.00
Reason: [admin notes]

Amount Charged: $30.00

[Reservation details...]
```

### **5. Damage Assessment Denied**
```
Subject: Party Completed - No Damage Charges

Great news! Admin has reviewed and found no damages.

No additional charges will apply.

[Reservation details...]
```

### **6. Admin Notification (New Assessment)**
```
Subject: New Damage Assessment Requires Review

A new damage assessment has been submitted:

Reservation: Clubroom - John Doe (Nov 2, 2025)
Assessed By: Janitorial Staff
Amount: $50.00

[Review Assessment] (link to admin dashboard)
```

### **7. Janitorial Notification (Assessment Adjusted/Denied)**
```
Subject: Damage Assessment Update

Your damage assessment has been reviewed:

Reservation: Clubroom - John Doe
Assessment: [Approved/Adjusted/Denied]

[Details...]
```

---

## **Implementation Priority**

### **Phase 1: UI Updates (Payment Terminology)**
- [ ] Update all "deposit" references to "potential damage fee"
- [ ] Update cost displays (show reservation fee only for booking)
- [ ] Update reservation summary displays
- [ ] No code logic changes yet

### **Phase 2: Party Completion Workflow**
- [ ] Add "Mark Party Complete" button to Janitorial page
- [ ] Create party completion modal
- [ ] Create damage assessment form (janitorial)
- [ ] Add database fields for damage assessment
- [ ] Create API endpoints for completion and assessment

### **Phase 3: Admin Review Workflow**
- [ ] Create Admin "Damage Reviews" section
- [ ] Create damage review interface
- [ ] Add API endpoints for admin review
- [ ] Add approval/adjust/deny logic

### **Phase 4: Square Integration**
- [ ] Implement Square payment for reservation fees
- [ ] Implement Square payment for damage charges (after admin approval)
- [ ] Payment receipts and confirmations

### **Phase 5: Email Notifications**
- [ ] All email templates for workflow steps
- [ ] Email triggers for each step

---

## **Summary**

**Workflow:**
1. Janitorial marks party complete
2. Janitorial assesses damages (if any)
3. Admin reviews assessment
4. Admin approves/adjusts/denies
5. If approved/adjusted: Charge via Square
6. Notifications sent at each step

**Key Points:**
- No upfront deposit/damage fee
- Only reservation fee charged at booking
- Damage fees charged only if damages occur
- Janitorial assesses, admin reviews
- No time limit for assessment (but happens at completion)

---

**Ready to implement once you approve this workflow design!**

