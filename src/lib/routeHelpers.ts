// src/lib/routeHelpers.ts
export const routes = {
  home: () => "/",
  servicesIndex: () => "/services",
  service: (serviceSlug: string) => `/services/${serviceSlug}`,
  areasIndex: () => "/areas-we-serve",
  area: (locationSlug: string) => `/areas/${locationSlug}`,

  // Spoke pages (service × location)
  spoke: (serviceSlug: string, locationSlug: string) => `/${serviceSlug}-${locationSlug}`,

  problemsIndex: () => "/problems",
  problem: (problemSlug: string) => `/problems/${problemSlug}`,
  problemSpoke: (problemSlug: string, locationSlug: string) => `/problems/${problemSlug}/${locationSlug}`,

  brandsIndex: () => "/brands",
  brand: (brandSlug: string) => `/brands/${brandSlug}`,
  brandSpoke: (brandSlug: string, locationSlug: string) => `/brands/${brandSlug}/${locationSlug}`,

  nearMe: (variantSlug: string, locationSlug: string) => `/${variantSlug}/${locationSlug}`,

  costIndex: () => "/cost",
  cost: (costSlug: string) => `/cost/${costSlug}`,

  compareIndex: () => "/compare",
  compare: (compareSlug: string) => `/compare/${compareSlug}`,

  bookNow: () => "/book-now",
} as const;