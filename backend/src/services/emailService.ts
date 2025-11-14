import sgMail from '@sendgrid/mail';
import { User } from '../models';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'NeighbriApp@gmail.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://www.neighbri.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(payload: EmailPayload): Promise<void> {
  console.log(`📧 sendEmail called for ${payload.to}`);
  console.log(`📧 SENDGRID_API_KEY set: ${!!SENDGRID_API_KEY}`);
  console.log(`📧 FROM_EMAIL: ${FROM_EMAIL}`);
  
  if (!SENDGRID_API_KEY) {
    console.warn('⚠️ SENDGRID_API_KEY not set; email not sent.');
    console.warn('⚠️ Check your environment variables. SENDGRID_API_KEY must be set for emails to work.');
    return;
  }
  
  try {
    console.log(`📧 Attempting to send email via SendGrid to ${payload.to}...`);
    await sgMail.send({
      to: payload.to,
      from: FROM_EMAIL,
      subject: payload.subject,
      html: payload.html,
    });
    console.log(`✅ Email sent successfully to ${payload.to}`);
  } catch (error: any) {
    console.error('❌ SendGrid Error:', error.response?.body || error.message);
    console.error('❌ Full error:', error);
    // Re-throw so calling code can handle it
    throw error;
  }
}

/**
 * Check if a user wants to receive a specific notification type
 * @param user User object with notificationPreferences
 * @param notificationType The notification preference key to check
 * @param defaultValue Default value if preference is not set (defaults to true for most notifications)
 * @returns boolean indicating if the user wants this notification
 */
export function shouldSendNotification(
  user: User | null,
  notificationType: string,
  defaultValue: boolean = true
): boolean {
  if (!user) return false;
  
  const preferences = user.notificationPreferences || {};
  // If preference is explicitly set, use it; otherwise use default
  return preferences[notificationType] !== undefined 
    ? preferences[notificationType] === true 
    : defaultValue;
}

/**
 * Send a notification email if the user has enabled it
 * @param user User to send notification to
 * @param notificationType The notification preference key
 * @param emailBuilder Function that returns { subject, html }
 * @param defaultValue Default value if preference not set
 */
export async function sendNotificationIfEnabled(
  user: User | null,
  notificationType: string,
  emailBuilder: () => { subject: string; html: string },
  defaultValue: boolean = true
): Promise<void> {
  console.log(`📧 Attempting to send ${notificationType} notification...`);
  
  if (!user || !user.email) {
    console.warn(`⚠️ Cannot send notification ${notificationType}: user or email missing`, { 
      hasUser: !!user, 
      hasEmail: user?.email 
    });
    return;
  }

  const shouldSend = shouldSendNotification(user, notificationType, defaultValue);
  console.log(`📧 Notification ${notificationType} check for ${user.email}:`, {
    shouldSend,
    preferences: user.notificationPreferences,
    defaultValue
  });

  if (!shouldSend) {
    console.log(`📧 Notification ${notificationType} disabled for user ${user.email}`);
    return;
  }

  try {
    console.log(`📧 Building email for ${notificationType} to ${user.email}...`);
    const email = emailBuilder();
    console.log(`📧 Email built, subject: ${email.subject}`);
    
    await sendEmail({
      to: user.email,
      subject: email.subject,
      html: email.html,
    });
    console.log(`✅ ${notificationType} notification sent successfully to ${user.email}`);
  } catch (error) {
    console.error(`❌ Failed to send ${notificationType} notification to ${user.email}:`, error);
    // Don't throw - email failures shouldn't break the main flow
  }
}

export function buildVerificationEmail(firstName: string, verifyUrl: string) {
  return {
    subject: 'Verify Your Neighbri Account',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <h2>Welcome to Neighbri, ${firstName}!</h2>
        <p>Please verify your email to activate your account.</p>
        <p><a href="${verifyUrl}" style="background:#355B45;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:600;">Verify Email</a></p>
        <p>This link expires in 24 hours. If the button doesn't work, copy and paste this URL:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      </div>
    `,
  };
}

export function buildPasswordResetEmail(firstName: string, resetUrl: string) {
  return {
    subject: 'Reset Your Neighbri Password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <h2>Password reset request</h2>
        <p>Hi ${firstName}, click the button below to reset your password.</p>
        <p><a href="${resetUrl}" style="background:#355B45;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:600;">Reset Password</a></p>
        <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
      </div>
    `,
  };
}

export function buildWelcomeEmail(firstName: string, communityName: string, accessCode: string) {
  const baseUrl = process.env.FRONTEND_URL || 'https://www.neighbri.com';
  const appUrl = `${baseUrl}/app`;
  
  return {
    subject: `Welcome to Neighbri - ${communityName} Community Setup Complete!`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:#355B45;margin-bottom:20px;">Welcome to Neighbri, ${firstName}!</h2>
        
        <p style="font-size:16px;line-height:1.6;color:#374151;">
          Congratulations! Your community <strong>${communityName}</strong> has been successfully set up on Neighbri.
        </p>
        
        <div style="background:#f0f9f4;border:2px solid #355B45;border-radius:8px;padding:20px;margin:24px 0;text-align:center;">
          <div style="font-size:14px;color:#6b7280;margin-bottom:8px;font-weight:600;">Your Community Access Code</div>
          <div style="font-size:32px;font-weight:700;color:#355B45;letter-spacing:4px;font-family:monospace;">${accessCode}</div>
          <p style="font-size:12px;color:#6b7280;margin-top:12px;margin-bottom:0;">
            Share this code with residents so they can join your community
          </p>
        </div>
        
        <p style="font-size:16px;line-height:1.6;color:#374151;">
          As the community administrator, you can now:
        </p>
        <ul style="font-size:16px;line-height:1.8;color:#374151;padding-left:20px;">
          <li>Create and manage amenities for your community</li>
          <li>Approve or manage reservations</li>
          <li>Invite residents to join using the access code above</li>
          <li>Configure community settings and preferences</li>
        </ul>
        
        <div style="margin:32px 0;text-align:center;">
          <a href="${appUrl}" style="background:#355B45;color:#fff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;font-size:16px;">
            Access Your Community Dashboard
          </a>
        </div>
        
        <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:6px;padding:16px;margin:24px 0;">
          <p style="margin:0;font-size:14px;color:#78350f;font-weight:600;margin-bottom:8px;">
            💳 Monthly Subscription
          </p>
          <p style="margin:0;font-size:14px;color:#78350f;">
            Your community is set up with a monthly subscription fee of $175/month. Square payment integration will be available soon for automated billing.
          </p>
        </div>
        
        <p style="font-size:14px;line-height:1.6;color:#6b7280;margin-top:32px;">
          If you have any questions or need assistance, please don't hesitate to reach out to our support team.
        </p>
        
        <p style="font-size:14px;line-height:1.6;color:#6b7280;margin-top:16px;">
          Best regards,<br>
          <strong>The Neighbri Team</strong>
        </p>
      </div>
    `
  };
}

// ============================================================================
// RESERVATION NOTIFICATION TEMPLATES
// ============================================================================

interface ReservationEmailData {
  firstName: string;
  amenityName: string;
  date: string;
  partyTimeStart: string;
  partyTimeEnd: string;
  guestCount: number;
  eventName?: string | null;
  status?: string;
  reservationId?: number;
  specialRequirements?: string | null;
}

export function buildReservationCreatedEmail(data: ReservationEmailData) {
  const { firstName, amenityName, date, partyTimeStart, partyTimeEnd, guestCount, eventName, status, reservationId } = data;
  const statusText = status === 'FULLY_APPROVED' ? 'approved' : status === 'JANITORIAL_APPROVED' ? 'pending final approval' : 'pending approval';
  const nextSteps = status === 'FULLY_APPROVED' 
    ? 'Your reservation is confirmed!'
    : status === 'JANITORIAL_APPROVED'
    ? 'Your reservation is pending final admin approval.'
    : 'Your reservation is pending janitorial approval.';

  return {
    subject: `Reservation Created: ${amenityName} on ${date}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:#355B45;">Reservation Created</h2>
        <p>Hi ${firstName},</p>
        <p>Your reservation has been created and is currently <strong>${statusText}</strong>.</p>
        
        <div style="background:#f9fafb;padding:15px;border-radius:8px;margin:20px 0;">
          <h3 style="margin-top:0;color:#1f2937;">Reservation Details</h3>
          <p><strong>Amenity:</strong> ${amenityName}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${partyTimeStart} - ${partyTimeEnd}</p>
          <p><strong>Guests:</strong> ${guestCount}</p>
          ${eventName ? `<p><strong>Event:</strong> ${eventName}</p>` : ''}
        </div>
        
        <p><strong>${nextSteps}</strong></p>
        ${reservationId ? `<p><a href="${FRONTEND_URL}/reservations" style="color:#355B45;">View Reservation</a></p>` : ''}
      </div>
    `,
  };
}

export function buildReservationApprovedEmail(data: ReservationEmailData) {
  const { firstName, amenityName, date, partyTimeStart, partyTimeEnd, guestCount, eventName, reservationId } = data;
  
  return {
    subject: `Reservation Approved: ${amenityName} on ${date}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:#059669;">Reservation Approved ✅</h2>
        <p>Hi ${firstName},</p>
        <p>Great news! Your reservation has been <strong>fully approved</strong> and is confirmed.</p>
        
        <div style="background:#f9fafb;padding:15px;border-radius:8px;margin:20px 0;">
          <h3 style="margin-top:0;color:#1f2937;">Reservation Details</h3>
          <p><strong>Amenity:</strong> ${amenityName}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${partyTimeStart} - ${partyTimeEnd}</p>
          <p><strong>Guests:</strong> ${guestCount}</p>
          ${eventName ? `<p><strong>Event:</strong> ${eventName}</p>` : ''}
        </div>
        
        <p>Your reservation is confirmed. We look forward to hosting your event!</p>
        ${reservationId ? `<p><a href="${FRONTEND_URL}/reservations" style="color:#355B45;">View Reservation</a></p>` : ''}
      </div>
    `,
  };
}

export function buildReservationRejectedEmail(data: ReservationEmailData & { reason?: string }) {
  const { firstName, amenityName, date, partyTimeStart, partyTimeEnd, guestCount, eventName, reason, reservationId } = data;
  
  return {
    subject: `Reservation Rejected: ${amenityName} on ${date}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:#dc2626;">Reservation Rejected</h2>
        <p>Hi ${firstName},</p>
        <p>Unfortunately, your reservation request has been <strong>rejected</strong>.</p>
        
        <div style="background:#f9fafb;padding:15px;border-radius:8px;margin:20px 0;">
          <h3 style="margin-top:0;color:#1f2937;">Reservation Details</h3>
          <p><strong>Amenity:</strong> ${amenityName}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${partyTimeStart} - ${partyTimeEnd}</p>
          <p><strong>Guests:</strong> ${guestCount}</p>
          ${eventName ? `<p><strong>Event:</strong> ${eventName}</p>` : ''}
        </div>
        
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>If you have questions, please contact your HOA administrator.</p>
        ${reservationId ? `<p><a href="${FRONTEND_URL}/reservations" style="color:#355B45;">View Reservation</a></p>` : ''}
      </div>
    `,
  };
}

export function buildReservationCancelledEmail(data: ReservationEmailData & { cancellationFee?: number; refundAmount?: number; reason?: string }) {
  const { firstName, amenityName, date, partyTimeStart, partyTimeEnd, guestCount, eventName, cancellationFee, refundAmount, reservationId } = data;
  
  return {
    subject: `Reservation Cancelled: ${amenityName} on ${date}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:#dc2626;">Reservation Cancelled</h2>
        <p>Hi ${firstName},</p>
        <p>Your reservation has been <strong>cancelled</strong>.</p>
        
        <div style="background:#f9fafb;padding:15px;border-radius:8px;margin:20px 0;">
          <h3 style="margin-top:0;color:#1f2937;">Reservation Details</h3>
          <p><strong>Amenity:</strong> ${amenityName}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${partyTimeStart} - ${partyTimeEnd}</p>
          <p><strong>Guests:</strong> ${guestCount}</p>
          ${eventName ? `<p><strong>Event:</strong> ${eventName}</p>` : ''}
        </div>
        
        ${cancellationFee !== undefined && cancellationFee > 0 ? `<p><strong>Cancellation Fee:</strong> $${cancellationFee.toFixed(2)}</p>` : ''}
        ${refundAmount !== undefined && refundAmount > 0 ? `<p><strong>Refund Amount:</strong> $${refundAmount.toFixed(2)}</p>` : ''}
        ${reservationId ? `<p><a href="${FRONTEND_URL}/reservations" style="color:#355B45;">View Reservation</a></p>` : ''}
      </div>
    `,
  };
}

export function buildReservationCompletedEmail(data: ReservationEmailData) {
  const { firstName, amenityName, date, eventName, reservationId } = data;
  
  return {
    subject: `Thank You: ${amenityName} Reservation Completed`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:#355B45;">Thank You!</h2>
        <p>Hi ${firstName},</p>
        <p>Your reservation for <strong>${amenityName}</strong> on <strong>${date}</strong> has been marked as completed.</p>
        ${eventName ? `<p>We hope your event "${eventName}" was a success!</p>` : ''}
        <p>Thank you for using our amenities. We look forward to hosting your next event!</p>
        ${reservationId ? `<p><a href="${FRONTEND_URL}/reservations" style="color:#355B45;">View Reservation</a></p>` : ''}
      </div>
    `,
  };
}

// ============================================================================
// MODIFICATION NOTIFICATION TEMPLATES
// ============================================================================

interface ModificationEmailData extends ReservationEmailData {
  proposedDate?: string;
  proposedPartyTimeStart?: string;
  proposedPartyTimeEnd?: string;
  modificationReason?: string;
  originalDate?: string;
  originalPartyTimeStart?: string;
  originalPartyTimeEnd?: string;
}

export function buildModificationProposedEmail(data: ModificationEmailData) {
  const { firstName, amenityName, originalDate, originalPartyTimeStart, originalPartyTimeEnd, proposedDate, proposedPartyTimeStart, proposedPartyTimeEnd, modificationReason, reservationId } = data;
  
  return {
    subject: `Modification Proposed for Your ${amenityName} Reservation`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:#f59e0b;">Reservation Modification Proposed</h2>
        <p>Hi ${firstName},</p>
        <p>A modification has been proposed for your reservation. Please review and respond.</p>
        
        <div style="background:#fef3c7;padding:15px;border-radius:8px;margin:20px 0;border-left:4px solid #f59e0b;">
          <h3 style="margin-top:0;color:#92400e;">Current Reservation</h3>
          <p><strong>Date:</strong> ${originalDate}</p>
          <p><strong>Time:</strong> ${originalPartyTimeStart} - ${originalPartyTimeEnd}</p>
        </div>
        
        <div style="background:#dbeafe;padding:15px;border-radius:8px;margin:20px 0;border-left:4px solid #3b82f6;">
          <h3 style="margin-top:0;color:#1e40af;">Proposed Changes</h3>
          <p><strong>New Date:</strong> ${proposedDate}</p>
          <p><strong>New Time:</strong> ${proposedPartyTimeStart} - ${proposedPartyTimeEnd}</p>
          ${modificationReason ? `<p><strong>Reason:</strong> ${modificationReason}</p>` : ''}
        </div>
        
        <p><strong>Action Required:</strong> Please accept or reject this modification. If you reject, your reservation will be cancelled and you'll need to book a new one.</p>
        ${reservationId ? `<p><a href="${FRONTEND_URL}/reservations" style="background:#355B45;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;">Review Modification</a></p>` : ''}
      </div>
    `,
  };
}

export function buildModificationAcceptedEmail(data: ModificationEmailData) {
  const { firstName, amenityName, date, partyTimeStart, partyTimeEnd, reservationId } = data;
  
  return {
    subject: `Reservation Modified: ${amenityName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:#059669;">Reservation Modified ✅</h2>
        <p>Hi ${firstName},</p>
        <p>Your reservation modification has been <strong>accepted</strong> and your reservation has been updated.</p>
        
        <div style="background:#f9fafb;padding:15px;border-radius:8px;margin:20px 0;">
          <h3 style="margin-top:0;color:#1f2937;">Updated Reservation Details</h3>
          <p><strong>Amenity:</strong> ${amenityName}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${partyTimeStart} - ${partyTimeEnd}</p>
        </div>
        
        <p>Your reservation is confirmed with the new details.</p>
        ${reservationId ? `<p><a href="${FRONTEND_URL}/reservations" style="color:#355B45;">View Reservation</a></p>` : ''}
      </div>
    `,
  };
}

export function buildModificationRejectedEmail(data: ReservationEmailData) {
  const { firstName, amenityName, date, reservationId } = data;
  
  return {
    subject: `Reservation Cancelled: ${amenityName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:#dc2626;">Reservation Cancelled</h2>
        <p>Hi ${firstName},</p>
        <p>You rejected the proposed modification for your <strong>${amenityName}</strong> reservation on <strong>${date}</strong>.</p>
        <p>As a result, your reservation has been <strong>cancelled</strong>.</p>
        <p>If you'd like to book this amenity, please create a new reservation.</p>
        ${reservationId ? `<p><a href="${FRONTEND_URL}/reservations" style="color:#355B45;">Create New Reservation</a></p>` : ''}
      </div>
    `,
  };
}

export function buildReservationModifiedEmail(data: ModificationEmailData) {
  const { firstName, amenityName, date, partyTimeStart, partyTimeEnd, reservationId } = data;
  
  return {
    subject: `Reservation Updated: ${amenityName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:#059669;">Reservation Updated</h2>
        <p>Hi ${firstName},</p>
        <p>Your reservation has been <strong>updated</strong>.</p>
        
        <div style="background:#f9fafb;padding:15px;border-radius:8px;margin:20px 0;">
          <h3 style="margin-top:0;color:#1f2937;">Updated Details</h3>
          <p><strong>Amenity:</strong> ${amenityName}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${partyTimeStart} - ${partyTimeEnd}</p>
        </div>
        
        ${reservationId ? `<p><a href="${FRONTEND_URL}/reservations" style="color:#355B45;">View Reservation</a></p>` : ''}
      </div>
    `,
  };
}

// ============================================================================
// REMINDER NOTIFICATION TEMPLATES
// ============================================================================

export function buildReservationReminderEmail(data: ReservationEmailData & { reminderType: '24h' | '7d' }) {
  const { firstName, amenityName, date, partyTimeStart, partyTimeEnd, guestCount, eventName, reminderType, reservationId } = data;
  const reminderText = reminderType === '24h' ? '24 hours' : '7 days';
  
  return {
    subject: `Reminder: ${amenityName} Reservation in ${reminderText}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:#355B45;">Upcoming Reservation Reminder</h2>
        <p>Hi ${firstName},</p>
        <p>This is a friendly reminder that you have a reservation coming up in <strong>${reminderText}</strong>.</p>
        
        <div style="background:#f9fafb;padding:15px;border-radius:8px;margin:20px 0;">
          <h3 style="margin-top:0;color:#1f2937;">Reservation Details</h3>
          <p><strong>Amenity:</strong> ${amenityName}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${partyTimeStart} - ${partyTimeEnd}</p>
          <p><strong>Guests:</strong> ${guestCount}</p>
          ${eventName ? `<p><strong>Event:</strong> ${eventName}</p>` : ''}
        </div>
        
        <p>We look forward to hosting your event!</p>
        ${reservationId ? `<p><a href="${FRONTEND_URL}/reservations" style="color:#355B45;">View Reservation</a></p>` : ''}
      </div>
    `,
  };
}

// ============================================================================
// DAMAGE ASSESSMENT NOTIFICATION TEMPLATES
// ============================================================================

interface DamageAssessmentEmailData {
  firstName: string;
  amenityName: string;
  date: string;
  damageCharge?: number | null;
  damageDescription?: string | null;
  status?: 'PENDING' | 'APPROVED' | 'ADJUSTED' | 'DENIED';
  reservationId?: number;
}

export function buildDamageAssessmentReviewedEmail(data: DamageAssessmentEmailData) {
  const { firstName, amenityName, date, damageCharge, damageDescription, status, reservationId } = data;
  
  let statusText = '';
  let statusColor = '';
  if (status === 'APPROVED') {
    statusText = 'approved';
    statusColor = '#059669';
  } else if (status === 'ADJUSTED') {
    statusText = 'adjusted';
    statusColor = '#f59e0b';
  } else if (status === 'DENIED') {
    statusText = 'denied';
    statusColor = '#dc2626';
  }
  
  return {
    subject: `Damage Assessment ${statusText ? statusText.charAt(0).toUpperCase() + statusText.slice(1) : 'Reviewed'}: ${amenityName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:${statusColor || '#355B45'};">Damage Assessment ${statusText ? statusText.charAt(0).toUpperCase() + statusText.slice(1) : 'Reviewed'}</h2>
        <p>Hi ${firstName},</p>
        <p>Your damage assessment for your <strong>${amenityName}</strong> reservation on <strong>${date}</strong> has been reviewed.</p>
        
        <div style="background:#f9fafb;padding:15px;border-radius:8px;margin:20px 0;">
          <h3 style="margin-top:0;color:#1f2937;">Assessment Details</h3>
          ${damageDescription ? `<p><strong>Description:</strong> ${damageDescription}</p>` : ''}
          ${damageCharge !== undefined && damageCharge !== null ? `<p><strong>Charge:</strong> $${damageCharge.toFixed(2)}</p>` : ''}
          ${status ? `<p><strong>Status:</strong> ${status}</p>` : ''}
        </div>
        
        ${reservationId ? `<p><a href="${FRONTEND_URL}/reservations" style="color:#355B45;">View Reservation</a></p>` : ''}
      </div>
    `,
  };
}

// ============================================================================
// APPROVAL WORKFLOW NOTIFICATION TEMPLATES (For Staff)
// ============================================================================

interface ApprovalWorkflowEmailData {
  firstName: string;
  amenityName: string;
  date: string;
  partyTimeStart: string;
  partyTimeEnd: string;
  guestCount: number;
  residentName: string;
  eventName?: string | null;
  reservationId?: number;
}

export function buildNewReservationRequiresApprovalEmail(data: ApprovalWorkflowEmailData) {
  const { firstName, amenityName, date, partyTimeStart, partyTimeEnd, guestCount, residentName, eventName, reservationId } = data;
  
  return {
    subject: `New Reservation Requires Approval: ${amenityName} on ${date}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:#f59e0b;">New Reservation Requires Approval</h2>
        <p>Hi ${firstName},</p>
        <p>A new reservation requires your approval.</p>
        
        <div style="background:#f9fafb;padding:15px;border-radius:8px;margin:20px 0;">
          <h3 style="margin-top:0;color:#1f2937;">Reservation Details</h3>
          <p><strong>Resident:</strong> ${residentName}</p>
          <p><strong>Amenity:</strong> ${amenityName}</p>
          ${eventName ? `<p><strong>Event:</strong> ${eventName}</p>` : ''}
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${partyTimeStart} - ${partyTimeEnd}</p>
          <p><strong>Guests:</strong> ${guestCount}</p>
        </div>
        
        <p><strong>Action Required:</strong> Please review and approve or reject this reservation.</p>
        ${reservationId ? `<p><a href="${FRONTEND_URL}/janitorial" style="background:#355B45;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;">Review Reservation</a></p>` : ''}
      </div>
    `,
  };
}

export function buildReservationPendingAdminApprovalEmail(data: ApprovalWorkflowEmailData) {
  const { firstName, amenityName, date, partyTimeStart, partyTimeEnd, guestCount, residentName, reservationId } = data;
  
  return {
    subject: `Reservation Pending Admin Approval: ${amenityName} on ${date}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:#3b82f6;">Reservation Pending Admin Approval</h2>
        <p>Hi ${firstName},</p>
        <p>A reservation has been approved by janitorial and is now pending your final approval.</p>
        
        <div style="background:#f9fafb;padding:15px;border-radius:8px;margin:20px 0;">
          <h3 style="margin-top:0;color:#1f2937;">Reservation Details</h3>
          <p><strong>Resident:</strong> ${residentName}</p>
          <p><strong>Amenity:</strong> ${amenityName}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${partyTimeStart} - ${partyTimeEnd}</p>
          <p><strong>Guests:</strong> ${guestCount}</p>
        </div>
        
        <p><strong>Action Required:</strong> Please review and provide final approval.</p>
        ${reservationId ? `<p><a href="${FRONTEND_URL}/janitorial" style="background:#355B45;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;">Review Reservation</a></p>` : ''}
      </div>
    `,
  };
}

export function buildReservationApprovedStaffEmail(data: ApprovalWorkflowEmailData) {
  const { firstName, amenityName, date, residentName, eventName, reservationId } = data;
  
  return {
    subject: `Reservation Approved: ${amenityName} on ${date}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:#059669;">Reservation Approved ✅</h2>
        <p>Hi ${firstName},</p>
        <p>The reservation you approved for <strong>${residentName}</strong> has been fully approved.</p>
        ${eventName ? `<p><strong>Event:</strong> ${eventName}</p>` : ''}
        
        <div style="background:#f9fafb;padding:15px;border-radius:8px;margin:20px 0;">
          <h3 style="margin-top:0;color:#1f2937;">Reservation Details</h3>
          <p><strong>Resident:</strong> ${residentName}</p>
          <p><strong>Amenity:</strong> ${amenityName}</p>
          <p><strong>Date:</strong> ${date}</p>
        </div>
        
        ${reservationId ? `<p><a href="${FRONTEND_URL}/janitorial" style="color:#355B45;">View Reservation</a></p>` : ''}
      </div>
    `,
  };
}

export function buildDamageAssessmentRequiredEmail(data: ApprovalWorkflowEmailData) {
  const { firstName, amenityName, date, residentName, reservationId } = data;
  
  return {
    subject: `Damage Assessment Required: ${amenityName} on ${date}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:#dc2626;">Damage Assessment Required</h2>
        <p>Hi ${firstName},</p>
        <p>A damage assessment is required for a completed reservation.</p>
        
        <div style="background:#f9fafb;padding:15px;border-radius:8px;margin:20px 0;">
          <h3 style="margin-top:0;color:#1f2937;">Reservation Details</h3>
          <p><strong>Resident:</strong> ${residentName}</p>
          <p><strong>Amenity:</strong> ${amenityName}</p>
          <p><strong>Date:</strong> ${date}</p>
        </div>
        
        <p><strong>Action Required:</strong> Please assess any damages and submit your assessment.</p>
        ${reservationId ? `<p><a href="${FRONTEND_URL}/janitorial" style="background:#355B45;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;">Assess Damage</a></p>` : ''}
      </div>
    `,
  };
}

