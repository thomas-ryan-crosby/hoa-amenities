# Neighbri Beta Testing Plan

## Welcome Beta Testers! 🎉

Thank you for helping us test Neighbri! This is beta software, so you may encounter bugs, incomplete features, or unexpected behavior. Your feedback is invaluable in helping us improve the platform.

**Important Notes:**
- This is a **beta version** - some features may not work perfectly
- Please report any issues, bugs, or confusing experiences
- Feel free to test edge cases and unusual scenarios
- All feedback is welcome, even if it's just "this feels weird"
- **This test plan is a GUIDE, not a strict script** - feel free to explore, go off script, and test things in any order you like!
- We welcome feedback on **style, formatting, features, design, colors, fonts, spacing, or anything else** you notice

---

## Pre-Testing Setup

### What You'll Need:
- **Two valid email addresses**:
  - **Email 1**: For creating a NEW community (you'll become the admin of this community)
  - **Email 2**: For registering and joining "The Sanctuary" community (you'll become a resident)
- Access to your email inbox (for verification and notifications)
- A web browser (Chrome, Firefox, Safari, or Edge recommended)
- About 1-2 hours to complete the full test plan

### Testing Flow:
1. **Create a New Community** (using Email 1) - This makes you an admin of your own community
2. **Register for The Sanctuary** (using Email 2) - Search for zip code `70471` to find "The Sanctuary" community
3. **Test Different Roles** - Use the test accounts below to experience different user perspectives

### Test Accounts for The Sanctuary:
Once you've registered for The Sanctuary, you can test different roles using these accounts:
- **Admin Role**: 
  - Email: `ryan@kellby.com`
  - Password: `admin123`
- **Janitorial Role**: 
  - Email: `janitorial@hoa.com`
  - Password: `admin123`
- **Resident Role**: 
  - Use the email and password you used to register for The Sanctuary
  - OR use: `resident@hoa.com` | `admin123`

### Test Environment:
- **URL**: https://www.neighbri.com
- **Browser**: Please use a modern browser (Chrome, Firefox, Safari, or Edge)

---

## Test Scenario 1: New Community Creation

**Goal**: Test the complete flow of creating a new HOA/community on Neighbri

### Step 1.1: Initial Registration
1. Navigate to https://www.neighbri.com
2. Click "Register" or navigate to the registration page
3. You should see a "Search for your community" screen
4. Click "I am new to Neighbri" or similar option
5. You should be taken to a community search screen

### Step 1.2: Community Search
1. Try searching for a community by zip code (use any 5-digit zip code)
2. Verify that search results appear (or "No communities found" message)
3. Click "Can't find your community?" or similar option
4. This should take you to the registration form

### Step 1.3: Community Information
1. Fill out the **Community/HOA Information** section:
   - Community Name: `[Your Test Community Name]`
   - Street Address: `[Test Address]`
   - Zip Code: `[5-digit zip]`
   - City: `[Test City]`
   - State: `[Test State]`
   - Approximate Households: `[Any number]`
   - Primary Contact Name: `[Your Name]`
   - Primary Contact Title: `[Any title]`
   - Primary Contact Info: `[Your email or phone]`

### Step 1.4: Personal Information
1. Fill out the **Your Information** section:
   - First Name: `[Your First Name]`
   - Last Name: `[Your Last Name]`
   - Email: `[Your Email - you'll receive verification]`
   - Password: `[Create a strong password]`
   - Confirm Password: `[Same password]`
   - Phone: `[Your phone number]`
   - Street: `[Your address]`
   - Zip Code: `[Your zip]`
   - City: `[Your city]`
   - State: `[Your state]`
   - Check "I agree to the terms and conditions"

### Step 1.5: Subscription Payment Modal
1. Click "Register" or "Submit"
2. **Expected**: A payment modal should appear showing:
   - Monthly subscription fee: **$175/month**
   - A checkbox: "I understand I will need to pay $175.00/month..."
   - Note about Square payment integration coming soon
3. Check the acknowledgment checkbox
4. Click "Continue"
5. **Expected**: You should be automatically logged in and redirected to the app

### Step 1.6: Welcome Email
1. Check your email inbox
2. **Expected**: You should receive a welcome email with:
   - Subject: "Welcome to Neighbri - [Community Name] Community Setup Complete!"
   - Your community access code (prominently displayed)
   - Link to access your dashboard
   - Information about the $175/month subscription

### Step 1.7: Initial App Access
1. After logging in, you should see the main calendar/app interface
2. **Expected**: You should NOT see an onboarding screen with access code
3. You should be able to navigate immediately

**✅ Test Complete**: Note any issues, confusing steps, or missing information

---

## Test Scenario 2: Registering with The Sanctuary

**Goal**: Test joining "The Sanctuary" community by searching for it

### Step 2.1: Search for The Sanctuary
1. On the community search screen, search by **zip code**: `70471`
2. **Expected**: You should see "The Sanctuary" in the search results
3. Click on "The Sanctuary" to select it
4. **Note**: You'll need a different email address than the one you used to create your own community (use Email 2)

### Step 2.2: Registration Flow
1. Navigate to https://www.neighbri.com
2. Click "Register"
3. On the community search screen, search by zip code: `70471`
4. Select "The Sanctuary" from the search results
5. Complete the registration form with your second email address (Email 2)

### Step 2.3: Complete Registration
1. Fill out your personal information:
   - First Name, Last Name, Email, Password, etc.
   - All required fields
2. Submit the registration form
3. **Expected**: You should be able to register and join the community
4. **Note**: Your membership may be pending admin approval

### Step 2.4: Pending Approval (if applicable)
1. If your membership is pending, you should see a message indicating this
2. You should only be able to see **public amenities** (if any exist)
3. Wait for admin approval (or ask the community admin to approve you)

**✅ Test Complete**: Note if the access code flow works correctly

---

## Test Scenario 3: Admin Perspective Testing

**Goal**: Test all features available to community administrators

### Step 3.1: Access Admin Features
1. Log in as a community admin (the person who created the community)
2. Navigate to the "Admin" tab in the navigation menu
3. **Expected**: You should see admin controls

### Step 3.2: Create Amenities
1. In the Admin tab, click "Create New Amenity" or similar
2. Fill out the amenity form:
   - **Name**: `Pool`
   - **Description**: `Community swimming pool`
   - **Reservation Fee**: `$50.00`
   - **Deposit**: `$100.00`
   - **Capacity**: `25`
   - **Calendar Group**: Select from dropdown or create new
   - **Display Color**: Pick a color
   - **Days of Operation**: Select days (e.g., Monday-Sunday)
   - **Open Time**: Use the time selector (e.g., 8:00 AM)
   - **Close Time**: Use the time selector (e.g., 10:00 PM)
   - **Is Public**: Toggle ON/OFF
   - **Open 24 Hours**: Toggle ON/OFF
   - **Janitorial Required**: Toggle ON/OFF
   - **Approval Required**: Toggle ON/OFF

3. **Fee Structure Configuration**:
   - Toggle "Enable Cancellation Fee" ON
   - Toggle "Enable Modification Fee" ON
   - Review the fee structure table that appears

4. Click "Create Amenity" or "Save"
5. **Expected**: Amenity should be created and appear in the list

### Step 3.3: Edit Amenity
1. Click on an existing amenity to edit it
2. Make changes to various fields
3. **Test Auto-Approval Warning**:
   - If "Janitorial Required" or "Approval Required" is currently ON, toggle it OFF
   - **Expected**: A warning should appear immediately below the approval section
   - The warning should explain that existing reservations will be auto-approved
   - Click "Revert Changes" - changes should revert
   - Toggle OFF again and click "Proceed" - changes should save
   - **Expected**: A notification should appear showing how many reservations were auto-approved

4. **Test Reverse Approval**:
   - If approvals are currently OFF, toggle them ON
   - **Expected**: A warning should appear explaining that reservations will be moved to unconfirmed status
   - Proceed or revert as desired

5. Save changes
6. **Expected**: Changes should be saved successfully

### Step 3.4: Member Management
1. Navigate to the "Members" tab in Admin
2. **Expected**: You should see a list of community members
3. For each member, you should see:
   - Name, Email, Role, Status (Pending/Approved/Banned)
4. **Test Approve Member**:
   - Find a member with "Pending" status
   - Click "Approve" or similar action
   - **Expected**: Status should change to "Approved"

5. **Test Ban Member**:
   - Find an approved member
   - Click "Ban" or similar action
   - **Expected**: Status should change to "Banned"
   - **Expected**: Banned members should not be able to see or reserve amenities

6. **Test Unban Member**:
   - Find a banned member
   - Click "Unban" or similar action
   - **Expected**: Status should change back to "Approved"

### Step 3.5: Damage Review
1. Navigate to the "Damage Review" tab in Admin
2. **Expected**: You should see reservations that have damage assessments pending review
3. Click on a reservation to review
4. **Test Review Damage Assessment**:
   - Review the damage assessment details
   - Approve or modify the damage charge
   - Add notes if available
   - Submit the review
   - **Expected**: Review should be saved and resident should be notified

### Step 3.6: View All Reservations
1. As admin, you should be able to see all reservations in the community
2. Navigate to "Calendar" or "Reservations" view
3. **Expected**: You should see all reservations, not just your own

**✅ Test Complete**: Note any issues with admin features

---

## Test Scenario 4: Janitorial Perspective Testing

**Goal**: Test features available to janitorial staff

### Step 4.1: Access Janitorial Features
1. Log in as a user with janitorial role (or ask admin to assign you janitorial role)
2. Navigate to the "Janitorial" tab
3. **Expected**: You should see reservations requiring janitorial approval

### Step 4.2: Approve/Reject Reservations
1. Find a reservation with status "NEW" or "Pending Janitorial Approval"
2. **Test Approve Reservation**:
   - Click "Approve" or similar
   - **Expected**: Reservation status should change
   - **Expected**: If admin approval is also required, status should be "Pending Admin Approval"
   - **Expected**: If no admin approval needed, status should be "Fully Approved"

3. **Test Reject Reservation**:
   - Find another reservation
   - Click "Reject" or similar
   - Enter a rejection reason
   - Submit
   - **Expected**: Reservation should be rejected and resident should be notified

### Step 4.3: Set Cleaning Time
1. Find an approved reservation
2. Click "Set Cleaning Time" or similar
3. **Test Cleaning Time Selection**:
   - Use the time selector (should be the simple 3-field selector)
   - Set cleaning start time (must be after party end time)
   - Set cleaning end time
   - **Expected**: If you set cleaning time before party end, you should get an error
   - **Expected**: If cleaning time is valid, it should save successfully

### Step 4.4: Propose Modification
1. Find a reservation that is NOT fully approved (status: NEW or JANITORIAL_APPROVED)
2. Click "Propose Modification" or similar
3. **Test Modification Proposal**:
   - Change the date, start time, or end time
   - Enter a reason for the modification (required field)
   - Submit the proposal
   - **Expected**: Modification proposal should be created
   - **Expected**: Button should change to "Cancel Proposed Modification"
   - **Expected**: A badge should appear showing "⚠️ Modification Pending"

4. **Test Cancel Modification**:
   - Click "Cancel Proposed Modification"
   - **Expected**: Modification proposal should be canceled
   - **Expected**: Button should change back to "Propose Modification"

### Step 4.5: View Reservation Details
1. Click on any reservation to view details
2. **Expected**: You should see:
   - Reservation date, times, guest count
   - Resident information
   - Event name (if provided)
   - Special requirements
   - Status and approval workflow

### Step 4.6: Mark Party Completed
1. Find a reservation that has passed (past date)
2. Click "Mark Completed" or similar
3. **Expected**: Reservation status should change to "COMPLETED"

### Step 4.7: Assess Damages
1. Find a completed reservation
2. Click "Assess Damages" or similar
3. **Test Damage Assessment**:
   - Enter damage description
   - Set damage charge amount
   - Submit assessment
   - **Expected**: Assessment should be saved
   - **Expected**: Admin should see it in Damage Review tab
   - **Expected**: Resident should be notified

**✅ Test Complete**: Note any issues with janitorial features

---

## Test Scenario 5: Resident Perspective Testing

**Goal**: Test features available to regular residents

### Step 5.1: Create a Reservation
1. Log in as a resident (or create a new account and join a community)
2. Navigate to the Calendar view
3. Click on an available date
4. **Test Reservation Creation**:
   - Select an amenity from the dropdown
   - Fill out reservation details:
     - Date (should be pre-filled from calendar click)
     - Start Time: Use the simple time selector
     - End Time: Use the simple time selector
     - Guest Count
     - Event Name (optional)
     - Is Private Event (toggle)
     - Special Requirements (optional)
   - Review the total cost (Reservation Fee + Deposit)
   - Click "Create Reservation"

5. **Test Payment Confirmation Modal**:
   - **Expected**: A payment modal should appear
   - Shows payment breakdown (Reservation Fee, Deposit)
   - Shows total amount
   - Has a checkbox: "I understand I will need to pay this amount"
   - Check the box
   - Click "Continue"
   - **Expected**: Reservation should be created
   - **Expected**: You should receive a confirmation email

### Step 5.2: View Your Reservations
1. Navigate to "My Reservations" tab
2. **Expected**: You should see:
   - Upcoming reservations at the top
   - Past/completed/cancelled reservations in a collapsible section at the bottom
   - Each reservation shows: Date, Time, Amenity, Status, etc.

### Step 5.3: Modify Reservation
1. Find an upcoming reservation
2. Click "Modify" or "Edit"
3. **Test Modification**:
   - Change the date, time, or other details
   - **Expected**: As you make changes, a modification fee may be calculated and displayed
   - Review the "Current vs. New" comparison
   - If modification fee applies, you'll see it in the payment modal
   - Submit the modification
   - **Expected**: Reservation should be updated
   - **Expected**: You should receive a confirmation email

### Step 5.4: Handle Modification Proposal
1. If janitorial/admin proposed a modification to your reservation:
   - **Expected**: You should see a prominent yellow alert box on "My Reservations"
   - **Expected**: Status should show "Modification Proposed - Awaiting Your Response"
2. **Test Accept Modification**:
   - Click "Accept Modification"
   - Review the proposed changes
   - Confirm acceptance
   - **Expected**: Reservation should be updated with new details
   - **Expected**: You should receive a confirmation email

3. **Test Reject Modification**:
   - If you have another modification proposal, click "Reject & Cancel"
   - **Expected**: Reservation should be canceled
   - **Expected**: You should receive a cancellation email with fee/refund information

### Step 5.5: Cancel Reservation
1. Find an upcoming reservation
2. Click "Cancel" or similar
3. **Test Cancellation**:
   - **Expected**: A cancellation modal should appear (NOT a popup)
   - Review cancellation details
   - Check the acknowledgment checkbox
   - Confirm cancellation
   - **Expected**: Reservation should be canceled
   - **Expected**: You should see cancellation fee and refund amount
   - **Expected**: You should receive a cancellation email

### Step 5.6: View Damage Assessment
1. If a completed reservation has damage assessed:
   - **Expected**: You should see damage assessment details
   - **Expected**: You should receive an email notification
2. Wait for admin review
3. **Expected**: Once admin reviews, you should receive another notification

### Step 5.7: Profile Settings
1. Navigate to "Profile" tab
2. **Test Email Notification Settings**:
   - Scroll to "Email Notification Settings" section
   - **Expected**: You should see expandable categories:
     - Reservation Notifications
     - Modification Notifications
     - Reminder Notifications
     - Damage Assessment
     - System Notifications
   - Click on a category to expand/collapse
   - Toggle individual notification preferences ON/OFF
   - **Expected**: Changes should save automatically
   - **Expected**: You should see "Saving preferences..." indicator

3. **Test Other Profile Settings**:
   - Update your personal information
   - Save changes
   - **Expected**: Changes should be saved

**✅ Test Complete**: Note any issues with resident features

---

## Test Scenario 6: Email Notifications Testing

**Goal**: Verify that email notifications are sent correctly

### Step 6.1: Registration Emails
- ✅ Welcome email (when creating new community)
- ✅ Email verification email (when registering)
- ✅ Password reset email (if you test forgot password)

### Step 6.2: Reservation Emails
- ✅ Reservation created confirmation
- ✅ Reservation approved notification
- ✅ Reservation rejected notification (with reason)
- ✅ Reservation cancelled notification (with fees/refunds)
- ✅ Reservation completed notification

### Step 6.3: Modification Emails
- ✅ Modification proposed notification
- ✅ Modification accepted notification
- ✅ Modification rejected notification
- ✅ Reservation modified notification

### Step 6.4: Approval Workflow Emails
- ✅ New reservation requires approval (to janitorial/admin)
- ✅ Reservation pending admin approval (to admin)
- ✅ Reservation approved by staff (to admin)

### Step 6.5: Damage Assessment Emails
- ✅ Damage assessment required (to janitorial/admin)
- ✅ Damage assessment reviewed (to resident)

**✅ Test Complete**: Check your email for all notifications and verify they contain correct information

---

## Test Scenario 7: Edge Cases and Error Handling

**Goal**: Test unusual scenarios and error conditions

### Step 7.1: Form Validation
1. Try submitting forms with:
   - Empty required fields
   - Invalid email formats
   - Passwords that don't match
   - Invalid dates (past dates for reservations)
   - Invalid times (end time before start time)
   - Guest count exceeding capacity
2. **Expected**: Appropriate error messages should appear

### Step 7.2: Date/Time Edge Cases
1. Try creating reservations:
   - On the same day (if time allows)
   - Overlapping times for same amenity
   - Very long duration reservations
   - Very short duration reservations
2. **Expected**: System should handle these appropriately

### Step 7.3: Access Control
1. As a resident, try to:
   - Access admin features (should be restricted)
   - Access janitorial features (should be restricted)
   - See other users' reservations (should only see your own)
2. As a banned user, try to:
   - View amenities (should see nothing or only public amenities)
   - Create reservations (should be blocked)
3. **Expected**: Appropriate access restrictions should be in place

### Step 7.4: Browser Testing
1. Test in different browsers:
   - Chrome
   - Firefox
   - Safari
   - Edge
2. **Expected**: Core functionality should work in all browsers

### Step 7.5: Mobile Testing (if possible)
1. Test on a mobile device or mobile browser view
2. Check:
   - Navigation menu
   - Forms
   - Calendar view
   - Modals
3. **Expected**: Interface should be usable on mobile

**✅ Test Complete**: Note any edge cases that break or behave unexpectedly

---

## How to Provide Feedback

### Feedback Methods:
We'd love to hear your thoughts! You can provide feedback in any of the following ways:

1. **Screen Recording**: Record your testing session and share the video file
   - Use screen recording software (built-in on Mac/Windows, or tools like Loom, OBS, etc.)
   - Narrate what you're doing and thinking as you test
   - Share the video file via email or file sharing service

2. **Written Document**: Create a document with notes, screenshots, and observations
   - Use Google Docs, Word, or any text editor
   - Include screenshots of issues or interesting findings
   - Organize by feature or test scenario
   - Share the document via email or file sharing

3. **Email**: Send detailed feedback directly via email
   - Use the contact email provided
   - Include as much detail as possible

4. **Mix of Methods**: Use whatever format works best for you!

### What to Report:
1. **Bugs**: Anything that doesn't work as expected
2. **Confusing UI**: Anything that's unclear or hard to understand
3. **Missing Features**: Things you expected but couldn't find
4. **Performance Issues**: Slow loading, laggy interactions
5. **Email Issues**: Missing emails, incorrect content
6. **Access Issues**: Can't access features you should have access to
7. **Design Feedback**: Colors, fonts, spacing, layout, visual design
8. **Feature Suggestions**: Ideas for new features or improvements
9. **User Experience**: Overall impressions, flow, ease of use
10. **Anything Else**: If you notice it, we want to hear about it!

### How to Report:
- **Email**: [Your support email]
- **Include**:
  - What you were trying to do
  - What you expected to happen
  - What actually happened
  - Screenshots (if possible)
  - Browser and device information
  - Steps to reproduce the issue (if applicable)
  - Your overall impressions and suggestions

### Priority Issues:
Please report immediately if you encounter:
- Complete inability to log in
- Data loss (reservations disappearing)
- Security concerns
- Payment-related errors
- Complete feature breakdowns

---

## Test Completion Checklist

Before you finish testing, please verify:

- [ ] Created a new community successfully
- [ ] Joined an existing community with access code
- [ ] Created at least one amenity (as admin)
- [ ] Created at least one reservation (as resident)
- [ ] Approved/rejected at least one reservation (as janitorial/admin)
- [ ] Proposed a modification (as janitorial)
- [ ] Accepted/rejected a modification proposal (as resident)
- [ ] Cancelled a reservation (as resident)
- [ ] Set cleaning time (as janitorial)
- [ ] Assessed damages (as janitorial)
- [ ] Reviewed damage assessment (as admin)
- [ ] Managed community members (as admin)
- [ ] Updated notification preferences (as any user)
- [ ] Received and verified email notifications
- [ ] Tested on at least 2 different browsers

---

## Thank You! 🙏

Your testing and feedback are crucial to making Neighbri better. We appreciate your time and patience with this beta version!

**Questions?** Feel free to reach out to [Your contact information]

---

**Last Updated**: [Current Date]
**Version**: Beta 1.0

