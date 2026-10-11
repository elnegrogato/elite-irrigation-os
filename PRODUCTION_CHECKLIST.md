# Production Checklist

Status date: 2026-05-14

## Completed In Repo

- [x] Responsive public page shell, navigation, footer, cards, forms, and sticky mobile CTA.
- [x] Homepage, services, service pages, areas, projects, quick quote, booking, pricing, docs, features, resources, support, careers, contact, and legal pages exist.
- [x] Dashboard, admin, onboarding, billing, API keys, notifications, activity, account, and settings pages exist.
- [x] 404 and app error pages exist.
- [x] Quote, booking, and contact forms call `api.leads.createLead`.
- [x] Auth pages call Convex auth mutations when `NEXT_PUBLIC_CONVEX_URL` is configured.
- [x] Convex schema includes users, sessions, rate limits, blocked IPs, and audit logs.
- [x] SEO metadata, JSON-LD, PWA manifest, icons, robots, and sitemap generation are implemented.
- [x] Dockerfile, `docker-compose.yml`, optional `docker-compose.convex.yml`, Next standalone output, and `/health` route exist.
- [x] React Email workflow templates and Resend delivery helpers exist for welcome, estimate, invoice, receipt, reminders, reviews, password reset, internal lead alerts, and work-order updates.
- [x] Quick-Win SEO/AEO/CRO Sprint prompt is tracked in `AI_DEV_PROMPT.md`.
- [x] Long service pages include guide sections, table-of-contents anchors, service/FAQ JSON-LD, breadcrumb UI/schema, trust signals, related services, and conversion CTAs.
- [x] README and changelog are updated.

## Must Be Verified With Production Credentials

- [ ] Deploy Convex hosted or self-hosted and set `NEXT_PUBLIC_CONVEX_URL`.
- [ ] Run `npx convex deploy` against the production backend.
- [ ] Generate and store the self-hosted Convex admin key if using `docker-compose.convex.yml`.
- [ ] Configure Stripe keys, price IDs, and webhook secret.
- [ ] Configure Twilio SMS/voice webhook URLs.
- [ ] Configure Resend sender domain and production API key.
- [ ] Send a production test email and confirm the `outboundMessages` record contains the Resend provider message ID.
- [ ] Configure Google Calendar OAuth credentials if calendar sync is required.
- [ ] Seed at least one admin user with a strong password.
- [ ] Confirm auth token storage policy. Current client stores the token in `localStorage`; use an httpOnly cookie route before high-security launch.
- [ ] Run a full user flow: homepage -> signup/login -> dashboard -> create lead -> admin view -> work order -> invoice -> payment webhook.
- [ ] Test every public form and confirm records appear in the admin dashboard.
- [ ] Test every modal, dropdown, tab, and button on desktop and mobile.
- [ ] Run Lighthouse on deployed pages and fix any score below 95.
- [ ] Verify no console errors on deployed desktop and mobile pages.
- [ ] Verify no broken links after final domain routing.
- [ ] Verify SSL, CSP, secure headers, and Coolify routing in production.
- [ ] Confirm backup and restore procedure for Convex data.

## Known External Blockers

- Production credentials and webhook endpoints are not present in this workspace.
- Lighthouse 95+ must be measured against the deployed production URL.
- Final SSL and domain routing must be confirmed in Coolify or the chosen host.
