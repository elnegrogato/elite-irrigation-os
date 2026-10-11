/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  async redirects() {
    return [
      { source: '/irrigation-quick-quote', destination: '/quick-quote', permanent: false },
      { source: '/drainage-assessment', destination: '/services/drainage-assessment', permanent: false },
      { source: '/maintenance-plans', destination: '/services/hoa-grounds-contract', permanent: false },
      { source: '/outdoor-facilities-services', destination: '/services/commercial-landscape-maintenance', permanent: false },
      { source: '/hoa-outdoor-services', destination: '/services/hoa-grounds-contract', permanent: false },
      { source: '/property-manager-outdoor-services', destination: '/services/commercial-landscape-maintenance', permanent: false },
      { source: '/multifamily-outdoor-maintenance', destination: '/services/commercial-landscape-maintenance', permanent: false },
      { source: '/office-park-landscape-maintenance', destination: '/services/commercial-landscape-maintenance', permanent: false },
      { source: '/church-grounds-maintenance', destination: '/services/commercial-landscape-maintenance', permanent: false },
      { source: '/country-club-outdoor-services', destination: '/services/commercial-irrigation-maintenance', permanent: false },
      { source: '/project-process', destination: '/about', permanent: false },
      { source: '/photo-documented-service', destination: '/about', permanent: false },
      { source: '/outdoor-punch-list', destination: '/quick-quote', permanent: false },
      { source: '/outdoor-site-review', destination: '/quick-quote', permanent: false },
      { source: '/customer-portal', destination: '/book-now', permanent: false },
    ];
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "img-src 'self' data: blob: https://images.unsplash.com https://*.convex.cloud",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "connect-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:* https://*.convex.cloud https://*.convex.site https://api.stripe.com https://*.stripe.com",
      "frame-src https://*.stripe.com",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.convex.cloud',
      }
    ],
  },
};

export default nextConfig;
