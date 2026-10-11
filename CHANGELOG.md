# Changelog

## 2026-05-14

- Added React Email templates for core customer and internal workflows, plus Resend delivery helpers with local mock fallback.
- Reworked Convex email actions so sent and queued workflow emails are recorded in `outboundMessages`.
- Added `AI_DEV_PROMPT.md` with the Priority Quick-Win SEO/AEO/CRO Sprint immediately after Phase 0.
- Upgraded long service pages with table-of-contents anchors, page-specific Service and FAQ JSON-LD, and richer service metadata.
- Simplified Coolify deployment to a single Next standalone app container with no host port mappings and a `/health` check.
- Removed the unused Nginx deployment config to avoid stale proxy mounts on Coolify.
- Added missing public product pages for pricing, features, docs, integrations, developer API, support, careers, resources, contact, and legal.
- Added responsive dashboard, admin, onboarding, billing, API keys, notifications, activity, account, and settings pages.
- Wired contact, quote, and booking lead forms to `api.leads.createLead`.
- Added global metadata, OG/Twitter metadata, JSON-LD, PWA icons, and generated sitemap/robots support.
- Added Dockerfile, app docker-compose, optional self-hosted Convex compose file, and health endpoint.
- Hardened Convex auth schema and mutations for registration, login, sessions, rate limiting, audit logs, and lockout behavior.
- Updated README with architecture, setup, deployment, env vars, Convex, Docker, Coolify, API, troubleshooting, and release guidance.
