# Site Upgrade Plan: Local NC Outdoor Services Conversion Engine

## Objective
Upgrade the entire Elite Irrigation & Landscaping OS site into an award-winning, high-converting, local-focused property services platform. The tone will emphasize "Local & Approachable", rooted in NC community trust, fast response, and frictionless booking, without inventing any claims.

## Phased Approach

### Phase 1: Core Conversion & Brand Foundation
* **Homepage & Layout**: Redesign the hero section, navigation, and footer in `PublicPages.tsx` and `Layout.tsx` to highlight local NC trust factors, clearer value propositions, and stronger CTAs.
* **Global Metadata & Schema**: Update `seo.ts`, `metaDynamic.ts`, `PageSeo.tsx`, and `index.html` to inject robust local business schema, refined OG images, and high-converting meta descriptions.
* **Essential Static Assets**: Update the `favicon.svg`, improve the `404` page, `robots.txt`, and create/update `llms.txt` and `README.md` to reflect the modernized OS.
* **Contact & Booking**: Refine the Quick Quote, Contact, and Lead generation flows to be highly inviting and frictionless.

### Phase 2: Deep Content & SEO Optimization
* **Service Pages**: Overhaul individual service pages (Irrigation, Drainage, Hardscapes, Lighting, etc.) with approachable, problem-solving copy, clear local proof, and logical breadcrumbs.
* **Area/Spoke Pages**: Enhance location-specific pages to feel deeply integrated with local NC neighborhoods, mentioning real geography without over-promising or inventing stats.
* **Sitemaps & Link Graph**: Re-run the scripts (`generate-sitemaps.ts`, `generate-link-graph.ts`, `generate-robots.ts`) to ensure perfect crawling pathways.

### Phase 3: Performance, Speed & Trust Signals
* **Core Web Vitals**: Audit all components for Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS). Ensure all images are appropriately prioritized.
* **Trust Elements**: Refine icons, typography, and case study/project layouts to instantly convey professionalism and approachability.
* **Final Review**: Validate all copy claims against actual platform capabilities.

## Verification
* Run Vite build and tests to ensure no broken links.
* Check Lighthouse scores for performance improvements.
* Manually inspect schema structure.
* Confirm all text reflects the local, approachable, NC-based brand voice.
