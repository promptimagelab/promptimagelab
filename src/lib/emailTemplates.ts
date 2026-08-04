/**
 * Transactional Email Templates
 * 
 * Production-ready HTML email templates for:
 * 1. Welcome Email
 * 2. Email Verification
 * 3. Password Reset
 * 4. Email Magic Link
 * 5. Trial Expiration Warning
 * 6. Payment & Subscription Invoice Receipt
 */

export interface EmailTemplateData {
  recipientName: string;
  recipientEmail: string;
  actionUrl?: string;
  tierName?: string;
  amountPaid?: string;
  daysRemaining?: number;
}

const BRAND_HEADER = `
  <div style="background-color: #0f172a; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 24px; font-weight: 800; margin: 0; tracking: -0.5px;">
      Prompt<span style="color: #6366f1;">Image</span>Lab
    </h1>
    <p style="color: #94a3b8; font-family: sans-serif; font-size: 12px; margin: 4px 0 0 0;">Enterprise AI Engineering Platform</p>
  </div>
`;

const BRAND_FOOTER = `
  <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border-t: 1px solid #e2e8f0;">
    <p style="color: #64748b; font-family: sans-serif; font-size: 11px; margin: 0;">
      © 2026 PromptImageLab Inc. • Zero Data Retention • BYOK Key Vault<br/>
      San Francisco, CA • <a href="https://promptimagelab.com/privacy" style="color: #6366f1; text-decoration: none;">Privacy Policy</a>
    </p>
  </div>
`;

// ── 1. WELCOME EMAIL ────────────────────────────────────────────────────────
export function getWelcomeEmailHtml(data: EmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="background-color: #f1f5f9; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; shadow: 0 4px 12px rgba(0,0,0,0.05);">
        ${BRAND_HEADER}
        <div style="padding: 32px; color: #1e293b;">
          <h2 style="font-size: 20px; font-weight: 700; margin-top: 0;">Welcome to PromptImageLab, ${data.recipientName}!</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            Your enterprise AI engineering workspace is ready. You now have access to <strong>Agent Studio</strong> for multi-model prompt testing across Gemini, OpenAI, and Claude, alongside <strong>OpsPilot</strong> for automated ServiceNow IT incident triage.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${data.actionUrl || 'https://promptimagelab.com/agent-studio'}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px; display: inline-block;">
              Launch Agent Studio Workspace →
            </a>
          </div>
        </div>
        ${BRAND_FOOTER}
      </div>
    </body>
    </html>
  `;
}

// ── 2. EMAIL VERIFICATION ───────────────────────────────────────────────────
export function getVerifyEmailHtml(data: EmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="background-color: #f1f5f9; padding: 20px; font-family: sans-serif;">
      <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px;">
        ${BRAND_HEADER}
        <div style="padding: 32px; color: #1e293b;">
          <h2 style="font-size: 20px; font-weight: 700; margin-top: 0;">Verify your email address</h2>
          <p style="font-size: 14px; color: #475569; line-height: 1.6;">
            Please click the button below to confirm <strong>${data.recipientEmail}</strong> for your PromptImageLab enterprise workspace.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${data.actionUrl || '#'}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="font-size: 12px; color: #94a3b8;">If you did not create an account, you can safely ignore this message.</p>
        </div>
        ${BRAND_FOOTER}
      </div>
    </body>
    </html>
  `;
}

// ── 3. PASSWORD RESET ───────────────────────────────────────────────────────
export function getPasswordResetEmailHtml(data: EmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="background-color: #f1f5f9; padding: 20px; font-family: sans-serif;">
      <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px;">
        ${BRAND_HEADER}
        <div style="padding: 32px; color: #1e293b;">
          <h2 style="font-size: 20px; font-weight: 700; margin-top: 0;">Password Reset Request</h2>
          <p style="font-size: 14px; color: #475569; line-height: 1.6;">
            We received a request to reset the password for <strong>${data.recipientEmail}</strong>. Click below to choose a new password.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${data.actionUrl || '#'}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 12px; color: #94a3b8;">Link expires in 60 minutes.</p>
        </div>
        ${BRAND_FOOTER}
      </div>
    </body>
    </html>
  `;
}

// ── 4. TRIAL EXPIRATION WARNING ──────────────────────────────────────────────
export function getTrialExpiringEmailHtml(data: EmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="background-color: #f1f5f9; padding: 20px; font-family: sans-serif;">
      <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px;">
        ${BRAND_HEADER}
        <div style="padding: 32px; color: #1e293b;">
          <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; color: #e11d48;">Your enterprise trial expires in ${data.daysRemaining || 3} days</h2>
          <p style="font-size: 14px; color: #475569; line-height: 1.6;">
            Upgrade to PromptImageLab Pro to retain uninterrupted access to multi-agent prompt chains, ServiceNow webhooks, and BYOK API key execution.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${data.actionUrl || 'https://promptimagelab.com/pricing'}" style="background-color: #10b981; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px; display: inline-block;">
              Upgrade to Pro Plan ($79/mo) →
            </a>
          </div>
        </div>
        ${BRAND_FOOTER}
      </div>
    </body>
    </html>
  `;
}

// ── 5. INVOICE RECEIPT ──────────────────────────────────────────────────────
export function getPaymentReceiptEmailHtml(data: EmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="background-color: #f1f5f9; padding: 20px; font-family: sans-serif;">
      <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px;">
        ${BRAND_HEADER}
        <div style="padding: 32px; color: #1e293b;">
          <h2 style="font-size: 20px; font-weight: 700; margin-top: 0;">Payment Receipt</h2>
          <p style="font-size: 14px; color: #475569;">Thank you for your business! Your subscription payment was processed successfully.</p>
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 24px 0;">
            <p style="margin: 4px 0; font-size: 13px;"><strong>Plan:</strong> ${data.tierName || 'Pro Plan'}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Amount:</strong> ${data.amountPaid || '$79.00 USD'}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Billing Period:</strong> Monthly</p>
          </div>
        </div>
        ${BRAND_FOOTER}
      </div>
    </body>
    </html>
  `;
}
