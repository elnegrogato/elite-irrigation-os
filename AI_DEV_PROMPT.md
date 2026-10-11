# Master AI Dev Prompt

This repo should be treated as a production-ready SaaS/product website upgrade project for Elite Irrigation & Landscaping. Work in this order:

1. Phase 0 — Build & Deployment Stability
2. Priority Quick-Win SEO/AEO/CRO Sprint
3. Phase 1 — UI System
4. Phase 2 — Public Website
5. Phase 3 — App/Dashboard
6. Phase 4 — Backend/Admin
7. Phase 5 — SEO/CRO/Performance
8. Phase 6 — Docs & QA

## Phase 0 — Build & Deployment Stability

- Fix package lock.
- Fix Docker.
- Fix Coolify deployment files.
- Fix SPA/Next routing.
- Confirm build passes.
- Confirm app starts.

## Addendum: Priority Quick-Win SEO/AEO/CRO Sprint

Before doing deeper refactors, complete this first-pass launch sprint. These are high-leverage items that should be implemented immediately because they improve search visibility, AI-answer visibility, user trust, mobile conversion, and site functionality quickly.

### Priority Order

#### 1. Per-Page Metadata

Implement unique metadata for every public page.

Each page must include:

- Title tag
- Meta description
- Canonical URL
- Open Graph title
- Open Graph description
- Open Graph image
- Twitter card metadata
- Robots directive where appropriate

Every page should have one clear SEO target and one clear search intent.

Acceptance criteria:

- No duplicate titles.
- No missing descriptions.
- No generic "Home" or "Untitled" metadata.
- Each page has metadata aligned to the service/location/search intent.

#### 2. JSON-LD Schemas

Add structured data for AEO, SEO, and rich snippet eligibility.

Implement relevant schemas:

- `Organization`
- `LocalBusiness`
- `Service`
- `FAQPage`
- `BreadcrumbList`
- `Article` or `BlogPosting` for guides
- `WebSite`
- `WebPage`
- `Product` only where actually applicable
- `HowTo` only for true step-by-step guide content

For local service pages, include:

- Business/service name
- Service area
- Phone number if available
- URL
- Description
- Services offered
- Breadcrumbs
- FAQs

Acceptance criteria:

- JSON-LD validates.
- Schema is page-specific, not generic.
- FAQ schema matches visible on-page FAQ content.
- No fake reviews, ratings, or claims.

#### 3. Guide Content Expansion

Expand thin service pages into useful guide-style pages.

Each major service page should include:

- Hero section
- Problem/pain framing
- Service overview
- Common use cases
- Materials/options
- Process
- Pricing factors
- Timeline factors
- Maintenance tips
- Service-area relevance
- FAQ section
- CTA section
- Related services
- Internal links

The goal is not filler. The content should answer real homeowner/customer questions and be useful enough to rank and be cited by AI answers.

Acceptance criteria:

- No thin pages.
- Each guide answers buyer-intent questions.
- Each guide has internal links.
- Each guide has FAQs.
- Each guide has a CTA.
- Content is clear, local, and service-specific.

#### 4. Breadcrumbs: UI + Schema

Add visual breadcrumbs to all deep pages.

Also add `BreadcrumbList` JSON-LD matching the visible breadcrumb.

Acceptance criteria:

- Breadcrumbs appear near the top of service/content pages.
- Breadcrumb links work.
- Breadcrumb schema matches the UI.
- Breadcrumbs improve crawl structure and user orientation.

#### 5. Sticky Mobile CTA

Add a sticky bottom CTA on mobile service and landing pages.

For local service sites, use:

- Call
- Text
- Request Quote
- Schedule Estimate

Rules:

- Mobile only or mobile-prioritized.
- Do not cover important form fields.
- Use 44px+ tap targets.
- Keep CTA visible but not obnoxious.
- Use actual phone/form links if available.

Acceptance criteria:

- CTA appears on mobile.
- Buttons work.
- CTA does not break layout.
- CTA improves conversion path from any scroll depth.

#### 6. Table of Contents

For long guide pages, add a table of contents.

It should:

- Use anchor links.
- Appear near the top.
- Be collapsible on mobile if needed.
- Help users jump to pricing, process, FAQs, materials, and quote actions.

Acceptance criteria:

- TOC links work.
- Headings have stable IDs.
- TOC improves long-page usability.
- Mobile version is clean.

#### 7. Form Endpoint

Make the main lead form functional.

At minimum, every quote/contact form must:

- Capture name
- Phone
- Email
- Service needed
- Location/town
- Message/details
- Optional photo upload placeholder if not yet implemented
- Submit to a real endpoint or safe backend handler
- Show success state
- Show error state
- Prevent empty/spam submissions

If no production backend exists yet, implement one of:

- API route
- Formspree/Resend-compatible structure
- Convex mutation
- Supabase insert
- Server action
- Clearly documented placeholder adapter

Acceptance criteria:

- Form submits.
- User sees confirmation.
- Admin/business owner can access the submission.
- Errors are handled.
- No fake "sent" state unless data is actually captured.

#### 8. Trust Signals

Add trust-building sections to conversion pages.

Use only truthful trust signals.

Potential sections:

- Licensed/insured statement if true
- Local service-area positioning
- Before/after gallery placeholder
- Process explanation
- Warranty/guarantee explanation if true
- Financing mention if true
- Brands/materials used
- "What happens after you request a quote"
- Service-area coverage
- Project types handled
- Safety/cleanup promise
- FAQ objection handling

Do not invent:

- Reviews
- Star ratings
- Awards
- Certifications
- Years in business
- Customer counts

Acceptance criteria:

- Trust signals are visible near CTAs.
- No fake claims.
- Objections are addressed.
- User feels safer taking the next step.

#### 9. Accessibility + Polish

Perform a fast accessibility and polish pass.

Fix:

- Missing alt text
- Low contrast text
- Button labels
- Form labels
- Focus states
- Keyboard navigation
- Heading order
- Tap target size
- Mobile overflow
- Broken links
- Empty hrefs
- Console errors
- Layout shifts
- Inconsistent spacing
- Inconsistent icon sizing

Acceptance criteria:

- No obvious accessibility failures.
- Forms are labeled.
- Buttons are keyboard reachable.
- Mobile layout has no horizontal scroll.
- Page feels polished, not generated.

## Implementation Instruction

Complete these nine quick-win items before moving into deeper backend, admin, billing, or advanced feature work:

1. Metadata
2. JSON-LD
3. Guide expansion
4. Breadcrumbs
5. Sticky mobile CTA
6. Table of contents
7. Functional form endpoint
8. Trust signals
9. Accessibility polish

After completing the sprint, provide a report:

```md
# Quick-Win SEO/AEO/CRO Sprint Report

## Completed
- Per-page metadata:
- JSON-LD schemas:
- Guide content expanded:
- Breadcrumbs:
- Sticky mobile CTA:
- Table of contents:
- Form endpoint:
- Trust signals:
- Accessibility polish:

## Files Changed
- ...

## Remaining Issues
| Issue | Why Pending | Required Input |
|---|---|---|

## Recommended Next Sprint
- ...
```
