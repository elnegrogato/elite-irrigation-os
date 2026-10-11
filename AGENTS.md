# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

Elite Irrigation & Landscaping OS is a comprehensive business management system for a landscaping/irrigation company. It combines:
- **Public marketing website** with SEO-optimized content pages
- **Admin dashboard** for business operations (CRM, scheduling, invoicing, fleet management)
- **Tech portal** for field crews
- **Convex backend** for real-time database, server functions, and webhooks

The app uses a hybrid static rendering approach with Convex for dynamic data.

## Development Commands

### Local Development
```bash
npm install                 # Install dependencies
npm run dev                # Start Vite dev server
```

### Build & Deployment
```bash
npm run build              # TypeScript check + Vite build
npm run preview            # Preview production build
```

### Content Generation (Pre-deployment)
```bash
npm run gen:all            # Generate all static content (routes, FAQs, manifests, etc.)
npm run gen:sitemaps       # Generate XML sitemaps
npm run export:case-studies  # Export case studies for static pages
```

### Full Static Build
```bash
npm run build:static       # Complete static build pipeline
                           # (generate content → build → sitemaps → robots.txt → prerender)
```

### Code Quality
```bash
npm run lint               # ESLint with TypeScript rules
```

## Architecture

### Frontend Structure

**Entry Points:**
- `index.tsx` - Browser entry point
- `App.tsx` - Root component with HashRouter (public + admin routes)
- `src/AppRoutes.tsx` - Comprehensive route definitions for public website

**Route Organization:**
- `/` - Public marketing website (home, services, areas, case studies, etc.)
- `/admin` - Admin dashboard (CRM, scheduling, fleet, compliance, etc.)
- `/tech` - Field crew portal (job views, check-ins)
- `/public/*` - Public invoice payment pages

**Key Directories:**
- `components/` - Shared UI components (AdminPages.tsx, PublicPages.tsx)
- `src/pages/` - Page components organized by route (admin/, tech/, projects/, public/)
- `src/lib/` - Utilities for SEO, content generation, formatting
- `src/ops/` - Business logic helpers (CRM schema, data ingestion, UTM tracking)
- `data/` - Static data (services, locations, brands, problems - for content generation)
- `scripts/` - Build-time scripts for route generation, sitemaps, content variants

### Backend Structure (Convex)

**Schema (`convex/schema.ts`):**
Core tables:
- `leads` - Customer inquiries with stage tracking, SLAs, assignment
- `events` - Timeline of all lead interactions (calls, texts, emails)
- `appointments` - Scheduled jobs with crews and time windows
- `estimates` - Line-item estimates with tier options
- `outboundMessages` - Queued messages (SMS, email) with retry logic
- `workOrders` - Job execution with proof of completion, budget tracking
- `invoices` & `payments` - Stripe-integrated billing with partial payments
- `caseStudies` - Verified project gallery for marketing
- `complianceDocs` - License/insurance tracking with expiry alerts
- `fleet` & `maintenanceLogs` - Vehicle/equipment management
- `staff` & `crews` - Team organization
- `inventory` - Parts and supplies with reorder points
- `policies` - Business rules (discount thresholds, approval workflows)
- `agentRuns` - AI agent execution logs
- `approvalRequests` - Manager approval queue for discounts/overrides

**HTTP Endpoints (`convex/http.ts`):**
- `/twilio/sms` - Inbound SMS → lead creation
- `/twilio/voice` - Inbound calls with speech recognition → lead creation
- `/stripe/webhook` - Payment completion → invoice status updates

**Key Backend Files:**
- `leads.ts` - Lead creation, stage transitions, SLA tracking
- `estimates.ts` - Estimate generation with tiered options
- `workOrders.ts` - Job creation, scheduling, completion
- `invoices.ts` & `payments.ts` - Stripe integration, PDF generation
- `followUps.ts` - Automated drip campaigns
- `automations.ts` - Scheduled jobs, SLA monitoring
- `compliance.ts` - License expiry monitoring
- `lib/normalize.ts` - Phone/email normalization, urgency/intent/entity inference
- `lib/stripe.ts` - Stripe client initialization

### Content Generation System

The app uses a sophisticated static content generation system for SEO:

**Data Sources:**
- `data/services.ts` - 50+ service offerings with slugs, pricing, descriptions
- `data/locations.ts` - Service areas (Charlotte Metro, Lake Norman, etc.)
- `data/problems.ts` - Common customer problems (drainage issues, lighting failures)
- `data/brands.ts` - Equipment brands (Hunter, Rain Bird, Rachio)

**Generated Content:**
- Service pages → Area pages → Problem pages → Brand pages
- FAQ variants, cost guides, comparison pages
- "Near Me" local SEO pages
- Case study manifests with geo-tagging

**Build Scripts:**
- `scripts/generate-routes.ts` - Creates route manifest from content matrix
- `scripts/generate-page-manifests.ts` - Page metadata for SEO
- `scripts/generate-faq-variants.ts` - FAQs for each service/area combo
- `scripts/generate-sitemaps.ts` - XML sitemaps for search engines
- `scripts/prerender.ts` - Static HTML generation

## Key Business Logic

### Lead Management
Leads progress through stages: `new` → `contacted` → `estimated` → `booked` → `completed`

**SLA Rules:**
- Emergency: 10-minute response
- High urgency: 30-minute response
- Standard: 60-minute response

**Lead Inference:**
- Phone numbers normalized to E.164 format
- Urgency inferred from message keywords (flooding, stuck zones, etc.)
- Intent detected (repair vs install vs maintenance)
- Entity type detected (homeowner vs HOA vs commercial)

### Approval Workflow
Certain actions require manager approval:
- Discounts exceeding policy thresholds
- Work orders exceeding not-to-exceed budgets
- Manager overrides for scheduling/closing

### Proof of Completion
Work orders require photo/video proof before closing. Managers can override in exceptional cases.

### Payment Flow
1. Estimate approved → Work order created
2. Invoice generated → Stripe checkout link sent
3. Customer pays → Webhook updates invoice status
4. Partial payments tracked in `amountPaid` / `balanceDue`

### Automation Agents
Background agents execute periodically:
- SLA watcher - Alerts on overdue responses
- Follow-up agent - Sends drip campaigns based on lead stage
- Compliance watcher - Checks expiring licenses

## Important Implementation Details

### Path Aliases
`@/*` maps to project root (configured in `tsconfig.json`)

### Routing
- Public site: HashRouter for static compatibility
- Admin: HashRouter with `/admin` prefix
- Tech: HashRouter with `/tech` prefix

### State Management
- Convex `useQuery` for real-time data sync
- React state for UI-only concerns (modals, forms)

### Invoice PDF Generation
Uses `pdf-lib` to generate PDFs server-side, stores in Convex storage

### SEO Strategy
- Static HTML pre-rendering at build time
- Dynamic meta tags via `react-helmet-async`
- Sitemap auto-generation with all content combinations
- Local "near me" pages for geographic targeting

### Integration Points
- **Twilio** - SMS/voice webhook handlers in `convex/http.ts`
- **Stripe** - Checkout sessions + webhook in `convex/http.ts`
- **Google/AI Studio** - Content generation via GEMINI_API_KEY

## Common Patterns

### Adding a New Admin Page
1. Create page in `src/pages/admin/YourPage.tsx`
2. Add route in `src/pages/admin/AdminLayout.tsx` navigation
3. Create Convex queries in `convex/yourFeature.ts`
4. Add mutations for write operations

### Adding Content Pages
1. Add data to appropriate `data/*.ts` file
2. Run `npm run gen:all` to regenerate routes
3. Page component in `src/pages/` using generated manifests

### Modifying Business Rules
Update `policies` table in Convex schema for:
- Discount thresholds
- SLA timeframes
- Approval requirements

### Testing Webhooks Locally
Use ngrok or similar to tunnel to localhost, update webhook URLs in Twilio/Stripe dashboards.

## Authentication System

### Overview
The application uses a custom session-based authentication system with secure token management.

### Authentication Flow
1. **Login**: User submits credentials to `/auth/login` mutation
2. **Session Creation**: Server creates session token with expiry
3. **Storage**: Session token stored in httpOnly cookie
4. **Validation**: Each request validates session via `getSession` query
5. **Logout**: Session invalidated on server and cookie cleared

### Session Management
- **Token Format**: Cryptographically secure random tokens
- **Expiry**: Configurable (default 24 hours)
- **Storage**: Convex `sessions` table
- **Security**: HttpOnly, Secure, SameSite cookies

### Authentication Files
- `convex/auth.ts` - Authentication queries and mutations
- `src/pages/auth/LoginPage.tsx` - Login UI
- `src/pages/auth/LogoutPage.tsx` - Logout handler
- `components/AuthGuard.tsx` - Route protection wrapper

### Protected Routes
All `/admin` routes require authentication. Use `AuthGuard` component to protect pages.

### Environment Variables
```
AUTH_SESSION_SECRET=your_random_secret_key_here_min_32_chars
AUTH_SESSION_EXPIRY_HOURS=24
```

## Testing Guide

### Test Structure
```
convex/__tests__/     # Backend tests
src/__tests__/        # Frontend tests
e2e/                  # End-to-end tests (if configured)
```

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in UI mode
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests once (CI mode)
npm run test:run

# Run smoke tests only
npm run smoke-test
```

### Writing Tests

**Backend Tests (Convex)**:
```typescript
import { defineTest } from "convex-test";

export default defineTest({
  mutation: "leads:create",
  args: { name: "Test Lead", phone: "+1234567890" },
  expected: { leadId: expect.any(String) }
});
```

**Frontend Tests**:
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('LeadForm', () => {
  it('renders lead input fields', () => {
    render(<LeadForm />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });
});
```

### Test Coverage
- Aim for >80% code coverage
- Focus on critical business logic (authentication, payments, SLA)
- Test error paths and edge cases
- Mock external dependencies (Stripe, Twilio)

### Testing Checklist
- [ ] All mutations have tests
- [ ] All queries have tests
- [ ] Authentication flow tested
- [ ] Payment flow tested (with Stripe mocks)
- [ ] Webhook handlers tested
- [ ] Error handling tested

## Performance Optimization Guide

### Frontend Optimization

**Code Splitting**:
- Lazy load admin pages: `React.lazy()`
- Dynamic imports for large components
- Separate vendor and app bundles

**Asset Optimization**:
- Compress images (WebP format preferred)
- Minimize JavaScript and CSS
- Use CDN for static assets
- Enable gzip/brotli compression

**Rendering Optimization**:
- Memoize expensive computations
- Use `useMemo` and `useCallback` appropriately
- Avoid unnecessary re-renders
- Virtualize long lists

### Backend Optimization

**Query Optimization**:
- Use indexes on frequently queried fields
- Limit query results with pagination
- Avoid N+1 queries with proper joins
- Cache expensive computations

**Mutation Optimization**:
- Batch operations when possible
- Use transactions for atomic updates
- Avoid redundant database writes
- Implement debouncing for user inputs

### Build Optimization

**Vite Configuration** (vite.config.ts):
```typescript
build: {
  minify: 'terser',
  sourcemap: false,
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        convex: ['convex']
      }
    }
  }
}
```

### Performance Monitoring
- Monitor Core Web Vitals (LCP, FID, CLS)
- Track API response times
- Monitor database query performance
- Set up alerts for performance degradation

## Security Best Practices

### Authentication Security
- Use strong session secrets (32+ characters)
- Implement rate limiting on login attempts
- Use httpOnly cookies for session tokens
- Implement session timeout after inactivity
- Log authentication attempts for audit

### Data Protection
- Validate all user inputs
- Sanitize data before database operations
- Use parameterized queries (Convex handles this)
- Encrypt sensitive data at rest
- Implement proper access control

### API Security
- Implement rate limiting on all endpoints
- Validate request payloads
- Use CORS properly (restrict origins in production)
- Implement CSRF protection
- Keep dependencies updated

### Payment Security (Stripe)
- Never log full credit card numbers
- Use Stripe Elements for PCI compliance
- Verify webhook signatures
- Implement proper error handling for payment failures
- Use test keys in development

### Communication Security
- Enforce HTTPS in production
- Use secure headers (HSTS, CSP, X-Frame-Options)
- Implement proper email verification
- Sanitize user-generated content in emails/SMS
- Rate limit messaging endpoints

### Environment Variables
- Never commit `.env` files
- Use different secrets for dev/staging/prod
- Rotate secrets periodically
- Use secret management services in production
- Document required environment variables

### Security Checklist
- [ ] Dependencies updated and vulnerability-free
- [ ] Session secrets are strong and unique
- [ ] Rate limiting configured
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Webhook signatures verified
- [ ] Input validation on all endpoints
- [ ] Access control implemented
- [ ] Security headers configured
- [ ] Logging and monitoring in place

## Deployment Procedures

### Pre-Deployment Checklist
1. **Code Quality**:
   - All tests passing: `npm run test:run`
   - Linting clean: `npm run lint`
   - No console errors
   - Security audit: `npm audit`

2. **Environment Setup**:
   - All environment variables configured
   - Production Convex deployment created
   - Stripe production keys configured
   - Twilio production account configured
   - Email service configured

3. **Testing**:
   - Smoke tests passing
   - Integration tests passing
   - Manual testing of critical paths
   - Payment flow tested in test mode

4. **Build**:
   - Static content generated: `npm run gen:all`
   - Production build successful: `npm run build`
   - Sitemaps generated
   - Assets optimized

### Deployment Steps

**Option 1: Vite Static Hosting (Vercel, Netlify)**
```bash
# Build static files
npm run build:static

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod --dir=dist-client
```

**Option 2: Convex Deployment**
```bash
# Deploy Convex backend
npx convex deploy

# Verify deployment
npx convex dashboard
```

**Option 3: Docker Deployment**
```bash
# Build Docker image
docker build -t elite-os .

# Run container
docker run -p 3000:3000 --env-file .env.production elite-os
```

### Post-Deployment Verification
1. Check health endpoint: `GET /health`
2. Test authentication flow
3. Test payment flow with small amount
4. Verify all integrations working
5. Check error logs
6. Monitor performance metrics
7. Test critical user paths

### Rollback Procedures
```bash
# Quick rollback to previous Convex deployment
npx convex deploy --preview <previous-deployment>

# Rollback static hosting (Vercel)
vercel rollback [deployment-url]

# Restore from backup
./scripts/rollback.sh
```

## Troubleshooting Guide

### Build Errors

**TypeScript Errors**:
```
Error: Cannot find module '@/...'
Solution: Check tsconfig.json paths are correct
```

**Import Errors**:
```
Error: Failed to resolve import
Solution: Verify file path and extension (use .tsx for components)
```

**Vite Build Errors**:
```
Error: Rollup build failed
Solution: Check for circular dependencies, use dynamic imports
```

### Runtime Errors

**Convex Connection Errors**:
```
Error: Failed to connect to Convex
Solution: Check CONVEX_DEPLOYMENT environment variable
```

**Authentication Errors**:
```
Error: Invalid session token
Solution: Clear cookies, check AUTH_SESSION_SECRET
```

**Stripe Payment Errors**:
```
Error: Payment_intent failed
Solution: Check Stripe webhook signature, verify API keys
```

**Twilio SMS Errors**:
```
Error: Message sending failed
Solution: Verify TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN
```

### Performance Issues

**Slow Page Loads**:
- Check bundle size
- Enable compression
- Optimize images
- Use lazy loading

**Slow API Response**:
- Check database indexes
- Optimize queries
- Add caching
- Use pagination

### Deployment Issues

**Environment Variables Not Loading**:
- Verify .env file exists
- Check variable names match exactly
- Restart deployment after changes

**Webhook Not Receiving Events**:
- Verify webhook URL is publicly accessible
- Check webhook secret matches
- Test with webhook testing tools

**Assets Not Loading**:
- Check build output directory
- Verify asset paths in production
- Clear CDN cache

### Common Development Issues

**Hot Module Replacement Not Working**:
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

**Convex Schema Migrations**:
```bash
# Push schema changes
npx convex dev --push-schema
```

**Stale Data**:
```bash
# Clear Convex dev data
npx convex dev --configure
```

## Calendar Integration

### Overview
The system integrates with Google Calendar for scheduling appointments and syncing with field crews.

### Setup
1. Create Google Cloud project
2. Enable Calendar API
3. Create OAuth 2.0 credentials
4. Set up webhook for calendar events
5. Configure environment variables

### Environment Variables
```
GOOGLE_CALENDAR_ID=your_calendar_id
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri
```

### API Endpoints
- `GET /api/calendar/events` - List calendar events
- `POST /api/calendar/events` - Create event
- `PUT /api/calendar/events/:id` - Update event
- `DELETE /api/calendar/events/:id` - Delete event

### Implementation Files
- `convex/calendar.ts` - Calendar queries and mutations
- `src/lib/calendar.ts` - Calendar client wrapper

### Sync Behavior
- Appointments automatically synced to calendar
- Calendar events update appointment times
- Two-way sync for real-time updates
- Conflict resolution for overlapping events

## Email Integration

### Overview
Email integration uses Resend for transactional emails (invoices, estimates, notifications).

### Setup
1. Create Resend account
2. Verify sender domain
3. Generate API key
4. Configure environment variables

### Environment Variables
```
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=noreply@eliteirrigation.com
EMAIL_FROM_NAME=Elite Irrigation & Landscaping
```

### Email Templates
Templates stored in `convex/emails.ts`:
- `invoiceEmail` - Invoice delivery
- `estimateEmail` - Estimate delivery
- `leadFollowUp` - Automated follow-ups
- `appointmentReminder` - Appointment notifications
- `paymentConfirmation` - Payment receipts
- `passwordReset` - Password reset (if applicable)

### Implementation Files
- `convex/emails.ts` - Email queries and mutations
- `convex/emailPreferences.ts` - Email preference management
- `src/lib/email.ts` - Email client wrapper

### Sending Emails
```typescript
// Send invoice
await ctx.runMutation(api.emails.sendInvoiceEmail, {
  invoiceId,
  recipientEmail,
});

// Send batch emails
await ctx.runMutation(api.emails.sendBatchEmails, {
  template: 'leadFollowUp',
  recipients: [...],
});
```

### Email Preferences
Users can manage email preferences via:
- `emailPreferences` table in Convex
- Preference center UI (if implemented)
- Unsubscribe links in emails

### Deliverability Best Practices
- Use verified sender domain
- Implement SPF, DKIM, DMARC records
- Monitor email analytics
- Respect unsubscribe requests
- Implement rate limiting
