# Email Notification Settings - Recommendation

## Overview
This document outlines recommended email notification preferences for the HOA Amenities system. Notifications are organized by user role and event type to provide relevant, timely information without overwhelming users.

## Notification Categories

### 1. **Reservation Notifications** (For Residents)
These notifications keep residents informed about their reservation status and any changes.

#### **Reservation Created** ✅ Recommended
- **When**: Immediately after a resident creates a reservation
- **Content**: 
  - Reservation details (amenity, date, time, guest count)
  - Current status (NEW, JANITORIAL_APPROVED, or FULLY_APPROVED)
  - Next steps (if approval is required)
- **Default**: ON
- **Why**: Confirms successful booking and sets expectations

#### **Reservation Approved** ✅ Recommended
- **When**: Reservation status changes to FULLY_APPROVED
- **Content**:
  - Confirmation that reservation is fully approved
  - Reservation details
  - Any special instructions or requirements
- **Default**: ON
- **Why**: Critical confirmation that the reservation is confirmed

#### **Reservation Rejected** ✅ Recommended
- **When**: Reservation is rejected by janitorial or admin
- **Content**:
  - Rejection reason (if provided)
  - Reservation details
  - Next steps or alternatives
- **Default**: ON
- **Why**: Important to know immediately if booking was denied

#### **Reservation Cancelled** ✅ Recommended
- **When**: Reservation is cancelled (by user or system)
- **Content**:
  - Cancellation confirmation
  - Cancellation fee (if applicable)
  - Refund amount (if applicable)
- **Default**: ON
- **Why**: Financial transparency and confirmation

#### **Reservation Completed** ⚠️ Optional
- **When**: Reservation status changes to COMPLETED
- **Content**:
  - Thank you message
  - Link to leave feedback (if applicable)
- **Default**: OFF
- **Why**: Less critical, can be optional

---

### 2. **Modification Notifications** (For Residents)
These notifications alert residents when their reservations are modified.

#### **Modification Proposed** ✅ Recommended
- **When**: Janitorial/admin proposes a modification to reservation
- **Content**:
  - Original reservation details
  - Proposed changes (date, time)
  - Reason for modification
  - Deadline to respond
  - Accept/Reject instructions
- **Default**: ON
- **Why**: Time-sensitive - resident needs to respond

#### **Modification Accepted** ✅ Recommended
- **When**: Resident accepts a proposed modification
- **Content**:
  - Updated reservation details
  - Modification fee (if applicable)
- **Default**: ON
- **Why**: Confirms the change was processed

#### **Modification Rejected** ✅ Recommended
- **When**: Resident rejects a proposed modification
- **Content**:
  - Confirmation that reservation was cancelled
  - Cancellation details
- **Default**: ON
- **Why**: Important to confirm cancellation

#### **Reservation Modified** ✅ Recommended
- **When**: Resident modifies their own reservation
- **Content**:
  - Updated reservation details
  - Modification fee (if applicable)
- **Default**: ON
- **Why**: Confirmation of successful change

---

### 3. **Reminder Notifications** (For Residents)
These help residents remember upcoming reservations.

#### **Upcoming Reservation Reminder** ✅ Recommended
- **When**: 24 hours before reservation start time
- **Content**:
  - Reservation details
  - Amenity location/instructions
  - Contact information for questions
- **Default**: ON
- **Why**: Reduces no-shows and improves experience

#### **Upcoming Reservation Reminder (7 days)** ⚠️ Optional
- **When**: 7 days before reservation start time
- **Content**: Same as 24-hour reminder
- **Default**: OFF
- **Why**: Some users may find this too early

---

### 4. **Approval Workflow Notifications** (For Janitorial/Admin)
These notify staff when action is required.

#### **New Reservation Requires Approval** ✅ Recommended
- **When**: New reservation created that requires janitorial/admin approval
- **Content**:
  - Reservation details
  - Resident information
  - Link to approve/reject
- **Default**: ON
- **Why**: Critical for workflow - staff needs to know immediately

#### **Reservation Pending Admin Approval** ✅ Recommended
- **When**: Reservation is JANITORIAL_APPROVED and needs admin approval
- **Content**:
  - Reservation details
  - Janitorial approval status
  - Link to approve/reject
- **Default**: ON (Admin only)
- **Why**: Critical for workflow

#### **Reservation Approved (Staff)** ⚠️ Optional
- **When**: Reservation you approved is now FULLY_APPROVED
- **Content**: Reservation details
- **Default**: OFF
- **Why**: Less critical - can check in system

---

### 5. **Damage Assessment Notifications** (For Residents & Staff)

#### **Damage Assessment Required** ✅ Recommended
- **When**: Damage assessment is requested after reservation completion
- **Content**:
  - Reservation details
  - Instructions for assessment
  - Link to assessment form
- **Default**: ON (Janitorial only)
- **Why**: Time-sensitive task

#### **Damage Assessment Reviewed** ✅ Recommended
- **When**: Damage assessment is reviewed and approved/denied
- **Content**:
  - Assessment result
  - Charge amount (if applicable)
  - Appeal process (if applicable)
- **Default**: ON (Residents)
- **Why**: Financial impact - resident needs to know

---

### 6. **System Notifications** (For All Users)

#### **Account Activity** ⚠️ Optional
- **When**: Password change, email verification, etc.
- **Content**: Security-related account changes
- **Default**: ON
- **Why**: Security best practice

#### **System Announcements** ⚠️ Optional
- **When**: Admin sends system-wide announcements
- **Content**: Policy changes, maintenance notices, etc.
- **Default**: ON
- **Why**: Important community information

---

## Recommended Default Settings

### **Residents:**
- ✅ Reservation Created: ON
- ✅ Reservation Approved: ON
- ✅ Reservation Rejected: ON
- ✅ Reservation Cancelled: ON
- ✅ Modification Proposed: ON
- ✅ Modification Accepted: ON
- ✅ Modification Rejected: ON
- ✅ Reservation Modified: ON
- ✅ Upcoming Reservation Reminder (24h): ON
- ✅ Damage Assessment Reviewed: ON
- ⚠️ Reservation Completed: OFF
- ⚠️ Upcoming Reservation Reminder (7 days): OFF
- ✅ Account Activity: ON
- ✅ System Announcements: ON

### **Janitorial Staff:**
- ✅ New Reservation Requires Approval: ON
- ✅ Damage Assessment Required: ON
- ⚠️ Reservation Approved (Staff): OFF
- ✅ Account Activity: ON
- ✅ System Announcements: ON

### **Admin:**
- ✅ New Reservation Requires Approval: ON
- ✅ Reservation Pending Admin Approval: ON
- ✅ Damage Assessment Required: ON
- ⚠️ Reservation Approved (Staff): OFF
- ✅ Account Activity: ON
- ✅ System Announcements: ON

---

## Implementation Notes

1. **Database Schema**: Add notification preferences as JSON field in users table:
   ```sql
   notificationPreferences JSONB DEFAULT '{}'
   ```

2. **UI Design**: 
   - Group notifications by category in Profile page
   - Use toggle switches (consistent with amenity settings)
   - Show clear descriptions for each notification type
   - Allow bulk enable/disable by category

3. **Email Service**: 
   - Use a service like SendGrid, AWS SES, or similar
   - Template-based emails for consistency
   - Include unsubscribe link in all emails
   - Support HTML and plain text formats

4. **Frequency Controls**:
   - Consider adding "digest" option for less critical notifications
   - Allow users to set quiet hours (no emails during certain times)

5. **Testing**:
   - Test all notification triggers
   - Verify email delivery
   - Check spam folder placement
   - Test unsubscribe functionality

---

## Questions for Approval

1. Do you want to include the optional notifications (marked with ⚠️)?
2. Should we add a "digest" option for daily/weekly summaries?
3. Do you want quiet hours functionality?
4. Should system announcements be mandatory (cannot be disabled)?
5. Any additional notification types we should consider?

