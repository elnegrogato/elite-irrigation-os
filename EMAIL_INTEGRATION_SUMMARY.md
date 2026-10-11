# Email Integration Summary - Elite Irrigation & Landscaping OS

## Overview
Complete email integration has been implemented using **Resend** as the email provider. The system includes professional HTML email templates, preference management, delivery tracking, and seamless UI integration.

## Features Implemented

### 1. Email Provider Integration
- **Provider**: Resend (modern, reliable, 3,000 free emails/month)
- **File**: `/convex/lib/email.ts`
- **Features**:
  - Graceful degradation (logs if API key not set)
  - Retry logic with exponential backoff
  - HTML + text multipart emails
  - Custom from addresses and names

### 2. Professional Email Templates
- **File**: `/convex/lib/emailTemplates.ts`
- **Templates Created**:
  - ✉️ **Estimate** - Professional estimates with line items and pricing
  - 💰 **Invoice** - Invoices with payment links
  - 📅 **Appointment Reminder** - Upcoming appointment details
  - ⭐ **Review Request** - Request for Google reviews
  - 🎉 **Welcome** - Welcome email for new leads
- **Design**:
  - Clean, modern HTML with inline styles
  - Email client compatible
  - Responsive design
  - Company branding (Elite Irrigation & Landscaping)

### 3. Email Preferences System
- **File**: `/convex/emailPreferences.ts`
- **Table**: `emailPreferences`
- **Features**:
  - Category-based preferences (estimates, invoices, reminders, promotions, reviews)
  - Global unsubscribe functionality
  - Email engagement tracking (opens, clicks)
  - Per-lead email statistics

### 4. Database Schema Updates
- **File**: `/convex/schema.ts`
- **New Table**: `emailPreferences`
  - Tracks per-category preferences
  - Engagement metrics
  - Unsubscribe status
- **Enhanced Table**: `outboundMessages`
  - Email-specific fields (subject, templateType)
  - Delivery tracking (deliveredAt, openedAt, clickedAt)
  - Bounce handling (bouncedAt, bounceReason)
  - Provider message ID

### 5. Backend Email Functions
- **File**: `/convex/emails.ts`
- **Actions**:
  - `sendEstimate` - Send estimate email
  - `sendInvoice` - Send invoice with payment link
  - `sendAppointmentReminder` - Send appointment reminders
  - `sendReviewRequest` - Request reviews after work completion
  - `sendWelcome` - Welcome new leads
  - `queueEmail` - Queue emails for scheduled sending
  - `retryEmail` - Retry failed emails
  - `listEmails` - List all sent emails
  - `getEmailStats` - Get delivery statistics

### 6. UI Integration

#### Estimates Page (`/src/pages/admin/EstimatesPage.tsx`)
- ✅ "Send Email" button on each estimate
- ✅ Email sent status indicator
- ✅ Loading state while sending
- ✅ Error handling for unsubscribed leads

#### Invoices Page (`/src/pages/admin/InvoicesPage.tsx`)
- ✅ "Email Invoice" button
- ✅ "SMS Invoice" button (existing)
- ✅ Includes payment link in email
- ✅ Delivery status tracking

#### Email Dashboard (`/src/pages/admin/EmailsPage.tsx`)
- ✅ **NEW**: Comprehensive email dashboard
- ✅ **Stats Cards**:
  - Total sent
  - Delivered (with rate)
  - Opened (with rate)
  - Clicked (with rate)
  - Pending
  - Failed/bounced
- ✅ **Filters**:
  - By status (sent, pending, failed, bounced)
  - By type (estimate, invoice, reminder, review, welcome)
- ✅ **Email List**:
  - Shows recipient, subject, status, date
  - Retry failed emails
  - View email details
- ✅ **Navigation**: Added to sidebar menu

### 7. Environment Variables
- **File**: `/.env.example`
- **Variables**:
  ```bash
  RESEND_API_KEY=your_resend_api_key
  EMAIL_FROM=noreply@eliteirrigation.com
  EMAIL_FROM_NAME=Elite Irrigation & Landscaping
  ```

## How to Use

### Setup

1. **Get Resend API Key**:
   - Sign up at https://resend.com
   - Create an API key
   - Add to `.env.local`:
     ```bash
     RESEND_API_KEY=re_xxxxxxxxxxxxx
     ```

2. **Verify Domain** (Optional but recommended):
   - Go to Resend dashboard
   - Add your domain (e.g., eliteirrigation.com)
   - Add DNS records to verify

3. **Deploy Schema Changes**:
   ```bash
   npx convex dev
   ```

### Sending Emails

#### From Estimates Page:
1. Navigate to `/admin/estimates`
2. Find an estimate
3. Click "Send Email" button
4. Email will be sent to the lead's email address

#### From Invoices Page:
1. Navigate to `/admin/invoices`
2. Find an invoice
3. Click "Email Invoice" button
4. Invoice includes payment link if PDF is generated

#### Programmatically:
```typescript
// Send estimate
await ctx.runAction(api.emails.sendEstimate, { estimateId });

// Send invoice
await ctx.runAction(api.emails.sendInvoice, {
  invoiceId,
  paymentUrl: "https://..."
});

// Send reminder
await ctx.runAction(api.emails.sendAppointmentReminder, { appointmentId });

// Send review request
await ctx.runAction(api.emails.sendReviewRequest, { workOrderId });

// Send welcome
await ctx.runAction(api.emails.sendWelcome, { leadId });
```

### Managing Preferences

```typescript
// Check if can send email
const canSend = await ctx.runQuery(api.emailPreferences.canSendEmail, {
  leadId,
  category: "estimates"
});

// Update preferences
await ctx.runMutation(api.emailPreferences.updatePreferences, {
  leadId,
  preferences: {
    estimates: true,
    invoices: true,
    promotions: false
  }
});

// Unsubscribe
await ctx.runMutation(api.emailPreferences.unsubscribe, {
  leadId,
  category: "all" // or "estimates", "invoices", etc.
});
```

### Viewing Email Stats

1. Navigate to `/admin/emails`
2. View delivery statistics at top
3. Filter by status or type
4. Click retry on failed emails

## Email Templates

### Estimate Email
- Professional header with company branding
- Estimate number and date
- Line items with quantities and pricing
- Total in prominent display
- Notes section
- Valid until date

### Invoice Email
- Invoice number and date
- Subtotal, tax, and total
- Payment link button (if available)
- Notes section
- Payment due date

### Appointment Reminder
- Appointment date and time
- Time window
- Service type
- Location/address
- What to expect section

### Review Request
- Friendly greeting
- Request for Google review
- Direct link to Google review
- Thank you message

### Welcome Email
- Warm welcome message
- What happens next
- Company benefits
- Contact information

## Error Handling

### Graceful Degradation
- If `RESEND_API_KEY` is not set, emails are logged to console
- No errors thrown in production without API key
- Useful for development/testing

### Retry Logic
- Automatic retry with exponential backoff
- Max 3 attempts by default
- Configurable delay between retries

### Bounce Handling
- Bounced emails tracked in database
- Status updated to "bounced"
- Bounce reason stored for analysis
- Can retry bounced emails from dashboard

## Testing

### Without API Key (Development)
```bash
# No API key needed
# Emails will be logged to console
npx convex dev
```

### With API Key (Production)
```bash
# Add to .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Test sending
npx convex dev
```

### Test Email Sending
```typescript
// Test estimate email
await ctx.runAction(api.emails.sendEstimate, { estimateId: "..." });

// Check Email Dashboard
// Navigate to /admin/emails
```

## File Structure

```
convex/
├── lib/
│   ├── email.ts              # Email sending functions
│   └── emailTemplates.ts     # HTML email templates
├── emailPreferences.ts       # Preference management
├── emails.ts                 # Email actions & queries
├── messages.ts               # Enhanced with email status updates
├── schema.ts                 # Updated with email preferences & tracking
├── estimates.ts              # Added get query
└── appointments.ts           # Added get query

src/pages/admin/
├── EstimatesPage.tsx         # Added email functionality
├── InvoicesPage.tsx          # Added email functionality
├── EmailsPage.tsx            # NEW: Email dashboard
└── AdminLayout.tsx           # Added Emails to navigation

src/
└── AppRoutes.tsx             # Added /admin/emails route
```

## Analytics & Metrics

### Tracked Metrics
- Total emails sent
- Delivery rate
- Open rate
- Click rate
- Bounce rate
- Per-category engagement

### Dashboard Views
- Real-time statistics
- Filter by status/type
- View individual email details
- Retry failed emails

## Security & Compliance

### Privacy
- Email preferences respected
- Global unsubscribe honored
- No spam - only transactional emails

### Compliance
- CAN-SPAM compliant
- Unsubscribe link in footer
- Physical address in footer
- Clear subject lines

## Future Enhancements (Optional)

### Webhook Integration
- Resend webhooks for real-time delivery updates
- Track opens/clicks via webhooks
- Automatic bounce handling

### Advanced Templates
- A/B testing for subject lines
- Dynamic content based on lead data
- Scheduled email campaigns

### Analytics
- Email performance reports
- Lead engagement scoring
- Conversion tracking

### Automation
- Automated reminder emails
- Dunning emails for unpaid invoices
- Re-engagement campaigns

## Support

### Resend Documentation
- API Docs: https://resend.com/docs/api-reference
- Dashboard: https://resend.com/dashboard
- Pricing: https://resend.com/pricing

### Common Issues

**Emails not sending?**
- Check `RESEND_API_KEY` is set
- Check Convex function logs
- Verify lead has email address

**High bounce rate?**
- Verify email addresses are valid
- Check domain is verified in Resend
- Review bounce reasons in dashboard

**Low open rate?**
- Improve subject lines
- Verify email is not in spam folder
- Check sender reputation

## Summary

The Elite Irrigation & Landscaping OS now has a complete, production-ready email integration with:

✅ Professional HTML email templates
✅ Preference management system
✅ Delivery tracking and analytics
✅ Seamless UI integration
✅ Error handling and retry logic
✅ Graceful degradation for development
✅ Email dashboard for management
✅ Category-based subscriptions
✅ Bounce handling
✅ Engagement tracking

**Ready to use!** Just add your Resend API key and start sending emails.
