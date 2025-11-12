import express from 'express';
import { sendEmail } from '../services/emailService';

const router = express.Router();

// POST /api/feedback/test-plan - Submit test plan feedback
router.post('/test-plan', async (req, res) => {
  try {
      const { name, email, feedback, testScenarios, overallExperience, bugs, suggestions, scenarioFeedbacks } = req.body;

    // Validate required fields
    if (!name || !email || !feedback) {
      return res.status(400).json({ 
        message: 'Name, email, and feedback are required' 
      });
    }

    // Build email content
    const emailSubject = `Beta Test Feedback from ${name}`;
    
    const emailHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:#355B45;margin-bottom:20px;">Beta Test Feedback Submission</h2>
        
        <div style="background:#f3f4f6;padding:16px;border-radius:6px;margin-bottom:20px;">
          <p style="margin:0;font-size:14px;color:#374151;"><strong>Tester Name:</strong> ${name}</p>
          <p style="margin:0;font-size:14px;color:#374151;"><strong>Tester Email:</strong> ${email}</p>
          <p style="margin:0;font-size:14px;color:#374151;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>

        ${testScenarios ? `
        <div style="margin-bottom:20px;">
          <h3 style="color:#374151;font-size:16px;margin-bottom:8px;">Test Scenarios Completed:</h3>
          <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${testScenarios}</div>
        </div>
        ` : ''}

        <div style="margin-bottom:20px;">
          <h3 style="color:#374151;font-size:16px;margin-bottom:8px;">Overall Experience:</h3>
          <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${overallExperience || 'Not provided'}</div>
        </div>

        <div style="margin-bottom:20px;">
          <h3 style="color:#374151;font-size:16px;margin-bottom:8px;">Bugs & Issues Found:</h3>
          <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${bugs || 'None reported'}</div>
        </div>

        <div style="margin-bottom:20px;">
          <h3 style="color:#374151;font-size:16px;margin-bottom:8px;">Suggestions & Improvements:</h3>
          <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${suggestions || 'None provided'}</div>
        </div>

        ${scenarioFeedbacks ? `
        <div style="margin-bottom:20px;">
          <h3 style="color:#374151;font-size:16px;margin-bottom:12px;">Scenario-Specific Feedback:</h3>
          ${scenarioFeedbacks.scenario1 ? `
          <div style="margin-bottom:12px;">
            <h4 style="color:#355B45;font-size:14px;margin-bottom:4px;">Scenario 1: New Community Creation</h4>
            <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${scenarioFeedbacks.scenario1}</div>
          </div>
          ` : ''}
          ${scenarioFeedbacks.scenario2 ? `
          <div style="margin-bottom:12px;">
            <h4 style="color:#355B45;font-size:14px;margin-bottom:4px;">Scenario 2: Registering with The Sanctuary</h4>
            <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${scenarioFeedbacks.scenario2}</div>
          </div>
          ` : ''}
          ${scenarioFeedbacks.scenario3 ? `
          <div style="margin-bottom:12px;">
            <h4 style="color:#355B45;font-size:14px;margin-bottom:4px;">Scenario 3: Admin Perspective Testing</h4>
            <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${scenarioFeedbacks.scenario3}</div>
          </div>
          ` : ''}
          ${scenarioFeedbacks.scenario4 ? `
          <div style="margin-bottom:12px;">
            <h4 style="color:#355B45;font-size:14px;margin-bottom:4px;">Scenario 4: Janitorial Perspective Testing</h4>
            <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${scenarioFeedbacks.scenario4}</div>
          </div>
          ` : ''}
          ${scenarioFeedbacks.scenario5 ? `
          <div style="margin-bottom:12px;">
            <h4 style="color:#355B45;font-size:14px;margin-bottom:4px;">Scenario 5: Resident Perspective Testing</h4>
            <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${scenarioFeedbacks.scenario5}</div>
          </div>
          ` : ''}
          ${scenarioFeedbacks.scenario6 ? `
          <div style="margin-bottom:12px;">
            <h4 style="color:#355B45;font-size:14px;margin-bottom:4px;">Scenario 6: Email Notifications Testing</h4>
            <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${scenarioFeedbacks.scenario6}</div>
          </div>
          ` : ''}
          ${scenarioFeedbacks.scenario7 ? `
          <div style="margin-bottom:12px;">
            <h4 style="color:#355B45;font-size:14px;margin-bottom:4px;">Scenario 7: Edge Cases and Error Handling</h4>
            <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${scenarioFeedbacks.scenario7}</div>
          </div>
          ` : ''}
        </div>
        ` : ''}

        <div style="margin-bottom:20px;">
          <h3 style="color:#374151;font-size:16px;margin-bottom:8px;">General Feedback:</h3>
          <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${feedback}</div>
        </div>

        <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">
            This feedback was submitted through the Neighbri Beta Testing form.
          </p>
        </div>
      </div>
    `;

    // Send email to neighbriapp@gmail.com
    try {
      await sendEmail({
        to: 'neighbriapp@gmail.com',
        subject: emailSubject,
        html: emailHtml
      });
      console.log(`✅ Feedback email sent to neighbriapp@gmail.com from ${email}`);
    } catch (emailError) {
      console.error('❌ Error sending feedback email:', emailError);
      // Don't fail the request if email fails, but log it
    }

    // Send confirmation copy to the tester
    try {
      const confirmationHtml = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
          <h2 style="color:#355B45;margin-bottom:20px;">Thank You for Your Feedback!</h2>
          
          <p style="font-size:16px;line-height:1.6;color:#374151;">
            Hi ${name},
          </p>
          
          <p style="font-size:16px;line-height:1.6;color:#374151;margin-bottom:24px;">
            Thank you for taking the time to test Neighbri and provide feedback. We've received your submission and will review it carefully. Below is a copy of your submission:
          </p>

          <div style="background:#f3f4f6;padding:16px;border-radius:6px;margin-bottom:20px;">
            <p style="margin:0;font-size:14px;color:#374151;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>

          ${testScenarios ? `
          <div style="margin-bottom:20px;">
            <h3 style="color:#374151;font-size:16px;margin-bottom:8px;">Test Scenarios Completed:</h3>
            <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${testScenarios}</div>
          </div>
          ` : ''}

          ${scenarioFeedbacks ? `
          <div style="margin-bottom:20px;">
            <h3 style="color:#374151;font-size:16px;margin-bottom:12px;">Scenario-Specific Feedback:</h3>
            ${scenarioFeedbacks.scenario1 ? `
            <div style="margin-bottom:12px;">
              <h4 style="color:#355B45;font-size:14px;margin-bottom:4px;">Scenario 1: New Community Creation</h4>
              <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${scenarioFeedbacks.scenario1}</div>
            </div>
            ` : ''}
            ${scenarioFeedbacks.scenario2 ? `
            <div style="margin-bottom:12px;">
              <h4 style="color:#355B45;font-size:14px;margin-bottom:4px;">Scenario 2: Registering with The Sanctuary</h4>
              <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${scenarioFeedbacks.scenario2}</div>
            </div>
            ` : ''}
            ${scenarioFeedbacks.scenario3 ? `
            <div style="margin-bottom:12px;">
              <h4 style="color:#355B45;font-size:14px;margin-bottom:4px;">Scenario 3: Admin Perspective Testing</h4>
              <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${scenarioFeedbacks.scenario3}</div>
            </div>
            ` : ''}
            ${scenarioFeedbacks.scenario4 ? `
            <div style="margin-bottom:12px;">
              <h4 style="color:#355B45;font-size:14px;margin-bottom:4px;">Scenario 4: Janitorial Perspective Testing</h4>
              <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${scenarioFeedbacks.scenario4}</div>
            </div>
            ` : ''}
            ${scenarioFeedbacks.scenario5 ? `
            <div style="margin-bottom:12px;">
              <h4 style="color:#355B45;font-size:14px;margin-bottom:4px;">Scenario 5: Resident Perspective Testing</h4>
              <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${scenarioFeedbacks.scenario5}</div>
            </div>
            ` : ''}
            ${scenarioFeedbacks.scenario6 ? `
            <div style="margin-bottom:12px;">
              <h4 style="color:#355B45;font-size:14px;margin-bottom:4px;">Scenario 6: Email Notifications Testing</h4>
              <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${scenarioFeedbacks.scenario6}</div>
            </div>
            ` : ''}
            ${scenarioFeedbacks.scenario7 ? `
            <div style="margin-bottom:12px;">
              <h4 style="color:#355B45;font-size:14px;margin-bottom:4px;">Scenario 7: Edge Cases and Error Handling</h4>
              <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${scenarioFeedbacks.scenario7}</div>
            </div>
            ` : ''}
          </div>
          ` : ''}

          <div style="margin-bottom:20px;">
            <h3 style="color:#374151;font-size:16px;margin-bottom:8px;">Overall Experience:</h3>
            <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${overallExperience || 'Not provided'}</div>
          </div>

          <div style="margin-bottom:20px;">
            <h3 style="color:#374151;font-size:16px;margin-bottom:8px;">Bugs & Issues Found:</h3>
            <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${bugs || 'None reported'}</div>
          </div>

          <div style="margin-bottom:20px;">
            <h3 style="color:#374151;font-size:16px;margin-bottom:8px;">Suggestions & Improvements:</h3>
            <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${suggestions || 'None provided'}</div>
          </div>

          <div style="margin-bottom:20px;">
            <h3 style="color:#374151;font-size:16px;margin-bottom:8px;">General Feedback:</h3>
            <div style="background:#f9fafb;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#6b7280;">${feedback}</div>
          </div>

          <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:14px;color:#6b7280;">
              Best regards,<br>
              <strong>The Neighbri Team</strong>
            </p>
            <p style="margin:8px 0 0 0;font-size:12px;color:#9ca3af;">
              This is an automated confirmation email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `;

      await sendEmail({
        to: email,
        subject: 'Thank You for Your Neighbri Beta Test Feedback',
        html: confirmationHtml
      });
      console.log(`✅ Confirmation email sent to ${email}`);
    } catch (confirmationError) {
      console.error('❌ Error sending confirmation email:', confirmationError);
      // Don't fail the request if confirmation email fails
    }

    return res.status(200).json({
      message: 'Feedback submitted successfully. Thank you!',
      success: true
    });

  } catch (error: any) {
    console.error('Error processing feedback:', error);
    return res.status(500).json({
      message: 'Failed to submit feedback. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

