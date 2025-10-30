# Registration & Email Verification Implementation Plan

## Overview
This plan outlines the implementation of standard registration and email verification features that users expect in modern web applications.

---

## 📋 Standard Registration Features

### Current State
- ✅ Basic registration form
- ✅ Password hashing
- ✅ JWT token generation
- ✅ Auto-login after registration
- ❌ Email verification
- ❌ Welcome email
- ❌ Email confirmation before account activation
- ❌ Password reset via email
- ❌ Resend verification email
- ❌ Terms of service acceptance

---

## 🎯 Implementation Plan

### Phase 1: Database Schema Updates

#### 1.1 Update User Model
**File**: `backend/src/models/User.ts`

**New Fields Needed**:
```typescript
- emailVerified: boolean (default: false)
- emailVerificationToken: string (nullable, unique)
- emailVerificationTokenExpires: Date (nullable)
- passwordResetToken: string (nullable, unique)
- passwordResetTokenExpires: Date (nullable)
- passwordResetRequestedAt: Date (nullable)
```

**Database Migration Required**:
- Add columns to `users` table
- Create index on `emailVerificationToken`
- Create index on `passwordResetToken`

---

### Phase 2: Email Service Setup

#### 2.1 Email Service Integration
**Technology**: SendGrid (already planned in env.example)

**Files to Create**:
- `backend/src/services/emailService.ts` - Email sending service
- `backend/src/templates/emailTemplates.ts` - Email template definitions

**Email Templates Needed**:
1. **Email Verification**
   - Subject: "Verify Your HOA Amenities Account"
   - Contains: Verification link, expiration time, welcome message
   
2. **Welcome Email** (after verification)
   - Subject: "Welcome to HOA Amenities!"
   - Contains: Account activation confirmation, next steps

3. **Password Reset Request**
   - Subject: "Reset Your Password"
   - Contains: Reset link, expiration time, security notice

4. **Password Reset Confirmation**
   - Subject: "Password Successfully Reset"
   - Contains: Confirmation, security recommendations

5. **Resend Verification Email**
   - Same as verification email, but with context message

**Environment Variables Needed**:
```bash
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@yourhoa.com
FRONTEND_URL=http://localhost:3000 (already exists)
```

---

### Phase 3: Backend API Endpoints

#### 3.1 Registration Flow Updates
**File**: `backend/src/routes/auth.ts`

**Changes to `/api/auth/register`**:
- ✅ Generate email verification token
- ✅ Set `emailVerified: false`
- ✅ Send verification email (don't auto-login)
- ✅ Return message: "Please check your email to verify your account"
- ✅ Create user account with `isActive: false` until verified (optional - can verify later)

#### 3.2 New Endpoints

**POST `/api/auth/verify-email`**
- Purpose: Verify email using token from email link
- Request: `{ token: string }`
- Response: Success/error message
- Action: 
  - Find user by token
  - Check token expiration
  - Set `emailVerified: true`
  - Optionally activate account (`isActive: true`)
  - Send welcome email

**POST `/api/auth/resend-verification`**
- Purpose: Resend verification email
- Request: `{ email: string }` or use authenticated user
- Response: Confirmation message
- Action:
  - Generate new token
  - Send verification email
  - Update expiration time

**POST `/api/auth/forgot-password`**
- Purpose: Request password reset
- Request: `{ email: string }`
- Response: Always success (for security - don't reveal if email exists)
- Action:
  - Find user by email
  - Generate reset token (if user exists)
  - Send password reset email (if user exists)
  - Log the attempt

**POST `/api/auth/reset-password`**
- Purpose: Reset password using token
- Request: `{ token: string, newPassword: string }`
- Response: Success/error message
- Action:
  - Find user by token
  - Check token expiration
  - Hash new password
  - Clear reset token
  - Send confirmation email

**GET `/api/auth/check-verification-status`**
- Purpose: Check if user's email is verified
- Authentication: Required
- Response: `{ emailVerified: boolean }`

---

### Phase 4: Frontend Updates

#### 4.1 Registration Component Updates
**File**: `frontend/src/components/Register.tsx`

**Changes**:
- ✅ Add Terms of Service checkbox (required)
- ✅ Remove auto-login after registration
- ✅ Show verification message instead
- ✅ Add "Resend Verification Email" option
- ✅ Add link to login page

**New Success Message**:
```
"Registration successful! Please check your email to verify your account. 
You won't be able to make reservations until your email is verified."
```

#### 4.2 New Components

**EmailVerificationPage.tsx**
- Route: `/verify-email/:token`
- Purpose: Handle email verification link clicks
- Features:
  - Extract token from URL
  - Call verification API
  - Show success/error message
  - Redirect to login on success
  - Show "token expired" if needed

**ResendVerificationPage.tsx** (or add to Register)
- Purpose: Allow users to resend verification email
- Features:
  - Email input
  - Submit button
  - Success message

**ForgotPasswordPage.tsx**
- Route: `/forgot-password`
- Purpose: Request password reset
- Features:
  - Email input
  - Submit button
  - Success message (always show same message for security)

**ResetPasswordPage.tsx**
- Route: `/reset-password/:token`
- Purpose: Reset password using token
- Features:
  - Token extraction from URL
  - New password input
  - Confirm password input
  - Submit button
  - Validation

#### 4.3 Login Component Updates
**File**: `frontend/src/components/Login.tsx`

**Changes**:
- ✅ Check email verification status after login
- ✅ If not verified, show warning message
- ✅ Provide link to resend verification email
- ✅ Optionally block access to reservations until verified

#### 4.4 App Routing Updates
**File**: `frontend/src/App.tsx`

**New Routes**:
```typescript
<Route path="/verify-email/:token" element={<EmailVerificationPage />} />
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password/:token" element={<ResetPasswordPage />} />
```

---

### Phase 5: Middleware & Security

#### 5.1 Email Verification Middleware
**File**: `backend/src/middleware/requireEmailVerification.ts`

**Purpose**: 
- Protect routes that require verified email
- Check `emailVerified` status
- Return appropriate error if not verified

**Usage**:
- Apply to reservation creation endpoints
- Optionally apply to all authenticated routes

#### 5.2 Token Management
**Security Features**:
- ✅ Tokens expire after 24 hours (verification)
- ✅ Tokens expire after 1 hour (password reset)
- ✅ One-time use tokens (can be invalidated after use)
- ✅ Secure random token generation
- ✅ Tokens stored as hashes in database (optional - for extra security)

---

### Phase 6: Email Template Design

#### 6.1 Verification Email Template
**Key Elements**:
- Professional design
- Clear call-to-action button
- Verification link (with frontend URL + token)
- Expiration notice
- Support contact information
- Fallback instructions if button doesn't work

**Example Structure**:
```
Subject: Verify Your HOA Amenities Account

Hi {firstName},

Welcome to HOA Amenities! Please verify your email address 
to complete your registration.

[Verify Email Button]

This link expires in 24 hours.

If the button doesn't work, copy this link:
{verificationUrl}

If you didn't create this account, please ignore this email.

Thanks,
HOA Amenities Team
```

#### 6.2 Password Reset Template
**Key Elements**:
- Clear reset link
- Security warnings
- Short expiration time notice

---

### Phase 7: User Experience Flow

#### 7.1 Registration Flow
1. User fills out registration form
2. Accepts terms of service ✓
3. Submits form
4. **NEW**: Sees "Check your email" message (instead of auto-login)
5. Receives verification email
6. Clicks verification link
7. Redirected to verification success page
8. Can now log in

#### 7.2 Login Flow (Unverified User)
1. User attempts to log in
2. Login succeeds
3. **NEW**: Warning message: "Please verify your email"
4. Link to resend verification email
5. User can view calendar but cannot create reservations

#### 7.3 Password Reset Flow
1. User clicks "Forgot Password" on login page
2. Enters email address
3. Receives password reset email
4. Clicks reset link
5. Enters new password
6. Password is reset
7. Receives confirmation email
8. Can log in with new password

---

## 📦 Dependencies Needed

### Backend
```json
{
  "@sendgrid/mail": "^7.7.0",
  "crypto": "built-in",
  "uuid": "^9.0.0" (optional - for token generation)
}
```

### Frontend
- No new dependencies needed
- Use existing React Router for new pages

---

## 🔒 Security Considerations

### Token Security
- ✅ Use cryptographically secure random tokens
- ✅ Hash tokens in database (optional but recommended)
- ✅ Short expiration times
- ✅ One-time use tokens where applicable
- ✅ Rate limiting on token generation endpoints

### Email Security
- ✅ Never reveal if email exists in forgot-password
- ✅ HTTPS-only verification links
- ✅ Prevent token reuse
- ✅ Log verification attempts

### User Privacy
- ✅ GDPR compliance considerations
- ✅ Clear privacy policy link
- ✅ Opt-out options for marketing emails (future)

---

## 🧪 Testing Requirements

### Unit Tests
- [ ] Token generation
- [ ] Email template rendering
- [ ] Token expiration validation
- [ ] Password reset validation

### Integration Tests
- [ ] Registration flow with email sending
- [ ] Email verification flow
- [ ] Resend verification flow
- [ ] Password reset flow
- [ ] Expired token handling

### Manual Testing Checklist
- [ ] Registration sends verification email
- [ ] Verification link works
- [ ] Expired tokens are rejected
- [ ] Resend verification works
- [ ] Password reset flow works
- [ ] Unverified users see appropriate messages
- [ ] Verified users can access all features

---

## 📊 Success Metrics

### Email Delivery
- Verification email delivery rate > 95%
- Average time to verification < 5 minutes
- Password reset completion rate

### User Experience
- Registration completion rate
- Email verification rate
- Password reset success rate

---

## 🚀 Implementation Priority

### High Priority (MVP)
1. ✅ Database schema updates
2. ✅ Email service setup (SendGrid)
3. ✅ Registration verification flow
4. ✅ Email verification endpoint
5. ✅ Frontend verification page
6. ✅ Login check for verified email

### Medium Priority
7. ✅ Resend verification email
8. ✅ Password reset flow
9. ✅ Terms of service checkbox

### Low Priority (Future)
10. Email templates enhancement
11. Email preferences
12. Two-factor authentication (optional)
13. Account deletion flow

---

## 📝 Implementation Notes

### Email Service Choice: SendGrid
- **Pros**: Easy integration, good deliverability, free tier available
- **Alternative**: AWS SES, Mailgun, Nodemailer with SMTP
- **Recommendation**: Start with SendGrid, can migrate later if needed

### Token Storage
- **Option 1**: Store plain tokens (simpler, faster)
- **Option 2**: Hash tokens in DB (more secure, requires more logic)
- **Recommendation**: Start with Option 1, upgrade to Option 2 if needed

### User Activation Strategy
- **Option A**: `isActive: false` until email verified (stricter)
- **Option B**: `emailVerified: false`, but account active (more lenient)
- **Recommendation**: Option B - allow viewing calendar, but block reservations

---

## ✅ Approval Checklist

Before implementation, please confirm:
- [ ] SendGrid account created and API key obtained
- [ ] Frontend URL configured correctly
- [ ] Database migration plan approved
- [ ] Email template designs approved
- [ ] Security approach approved
- [ ] Terms of service content ready (if adding checkbox)

---

## 🎯 Ready for Implementation?

Once approved, implementation will proceed in phases:
1. **Phase 1**: Database & Backend API (2-3 hours)
2. **Phase 2**: Email Service Integration (2-3 hours)
3. **Phase 3**: Frontend Components (2-3 hours)
4. **Phase 4**: Testing & Refinement (1-2 hours)

**Total Estimated Time**: 7-11 hours

---

*Plan Created: October 26, 2025*
*Version: 1.0*
