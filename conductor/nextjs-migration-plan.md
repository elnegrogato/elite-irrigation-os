# Next.js Migration Plan

## Objective
Convert the Elite Irrigation & Landscaping OS from a Vite React SPA to a Next.js (App Router) application. This will provide best-in-class SEO, dramatically faster initial page loads (LCP), and eliminate the need for brittle, custom static pre-rendering scripts.

## Phase 1: Configuration & Dependencies
- **Update `package.json`**: Install `next`, `eslint-config-next`. Remove `vite`, `@vitejs/plugin-react`, `react-router-dom`, `react-helmet-async`.
- **Config Files**: Create `next.config.js` or `next.config.mjs`. Update `tsconfig.json` to be compatible with Next.js strict requirements.

## Phase 2: Core Architecture & Providers
- **App Layout**: Create `app/layout.tsx` to replace `index.html`. This file will include the HTML structure, global fonts, and CSS imports.
- **Convex Provider**: Create `app/ConvexClientProvider.tsx` (with `'use client'`) to wrap the application in the Convex provider, as context providers must be client components in Next.js.
- **Global CSS**: Move Tailwind CSS imports into an `app/globals.css` file.

## Phase 3: Public Routing & SEO (Server Components)
- **Static Pages**: Migrate the core pages (Home, About, Contact, Quick Quote, etc.) into `app/page.tsx`, `app/about/page.tsx`, etc.
- **Dynamic Routing**: Convert dynamic routes like `/services/:slug` and `/areas/:locationSlug` into `app/services/[slug]/page.tsx` and `app/areas/[locationSlug]/page.tsx`.
- **Static Generation (SSG)**: Implement `generateStaticParams` for the dynamic routes using your existing data sets (`services.ts`, `locations.ts`) to pre-build all spoke pages at build time, replacing the old `prerender.ts` script.
- **Metadata**: Replace all `PageSeo` and `react-helmet-async` usages with Next.js native `export const metadata` or `export async function generateMetadata()`.

## Phase 4: Component Adaptation
- **Link Component**: Replace all instances of `import { Link } from 'react-router-dom'` with `import Link from 'next/link'`.
- **Client Components**: Identify components that use `useState`, `useEffect`, or browser APIs (like the `Navbar` scroll listener) and add the `'use client'` directive at the top of the file.

## Phase 5: Portals (Admin & Tech)
- **Dashboard Migration**: Move the `/admin` and `/tech` routes into `app/admin/layout.tsx` and `app/tech/layout.tsx`. Since these are highly interactive authenticated dashboards, they will predominantly be marked as `'use client'`.

## Phase 6: Cleanup
- Remove the old Vite config, `index.html`, `App.tsx`, and `AppRoutes.tsx`.
- Verify the build with `npm run build` and test the application with `npm run start`.
