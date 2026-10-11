const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://eliteirrigation.com';

function extractSlugs(filePath, pattern) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const regex = new RegExp(pattern, 'g');
  const slugs = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (!slugs.includes(match[1])) slugs.push(match[1]);
  }
  return slugs;
}

function urlEntry(loc, changefreq = 'monthly', priority = '0.5') {
  const today = new Date().toISOString().split('T')[0];
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const serviceSlugs = extractSlugs('data/services.ts', 'slug:\\s*"([^"]+)"');
const locationSlugs = extractSlugs('data/locations_full.ts', 'slug:\\s*"([^"]+)"');

const urls = [];

urls.push(urlEntry(DOMAIN + '/', 'weekly', '1.0'));
urls.push(urlEntry(DOMAIN + '/services', 'weekly', '0.9'));
urls.push(urlEntry(DOMAIN + '/areas-we-serve', 'monthly', '0.8'));
urls.push(urlEntry(DOMAIN + '/contact', 'monthly', '0.8'));
urls.push(urlEntry(DOMAIN + '/quick-quote', 'weekly', '0.9'));
urls.push(urlEntry(DOMAIN + '/irrigation-quick-quote', 'weekly', '0.9'));
urls.push(urlEntry(DOMAIN + '/send-us-your-outdoor-list', 'weekly', '0.9'));
urls.push(urlEntry(DOMAIN + '/outdoor-issue-review', 'monthly', '0.8'));
urls.push(urlEntry(DOMAIN + '/drainage-assessment', 'monthly', '0.8'));
urls.push(urlEntry(DOMAIN + '/process', 'monthly', '0.7'));
urls.push(urlEntry(DOMAIN + '/photo-documented-service', 'monthly', '0.7'));
urls.push(urlEntry(DOMAIN + '/maintenance-plans', 'monthly', '0.8'));
urls.push(urlEntry(DOMAIN + '/outdoor-property-review', 'monthly', '0.8'));
urls.push(urlEntry(DOMAIN + '/submit-property-issue', 'monthly', '0.7'));
urls.push(urlEntry(DOMAIN + '/post-storm-drainage-inspection', 'monthly', '0.7'));
urls.push(urlEntry(DOMAIN + '/outdoor-site-reports', 'monthly', '0.7'));
urls.push(urlEntry(DOMAIN + '/board-ready-outdoor-reports', 'monthly', '0.7'));
urls.push(urlEntry(DOMAIN + '/outdoor-facilities-services', 'monthly', '0.8'));
urls.push(urlEntry(DOMAIN + '/outdoor-facility-review', 'monthly', '0.8'));
urls.push(urlEntry(DOMAIN + '/outdoor-site-review', 'monthly', '0.7'));
urls.push(urlEntry(DOMAIN + '/guide', 'monthly', '0.7'));
urls.push(urlEntry(DOMAIN + '/projects', 'monthly', '0.7'));
urls.push(urlEntry(DOMAIN + '/customer-portal', 'monthly', '0.5'));
urls.push(urlEntry(DOMAIN + '/hoa-outdoor-services', 'monthly', '0.8'));
urls.push(urlEntry(DOMAIN + '/property-manager-outdoor-services', 'monthly', '0.8'));
urls.push(urlEntry(DOMAIN + '/multifamily-outdoor-services', 'monthly', '0.8'));
urls.push(urlEntry(DOMAIN + '/office-park-outdoor-services', 'monthly', '0.7'));
urls.push(urlEntry(DOMAIN + '/retail-center-outdoor-services', 'monthly', '0.7'));
urls.push(urlEntry(DOMAIN + '/church-school-outdoor-services', 'monthly', '0.7'));
urls.push(urlEntry(DOMAIN + '/country-club-outdoor-services', 'monthly', '0.7'));
urls.push(urlEntry(DOMAIN + '/luxury-hoa-outdoor-services', 'monthly', '0.7'));
urls.push(urlEntry(DOMAIN + '/municipal-outdoor-services', 'monthly', '0.6'));
urls.push(urlEntry(DOMAIN + '/construction-outdoor-services', 'monthly', '0.7'));
urls.push(urlEntry(DOMAIN + '/realtor-outdoor-punch-list', 'monthly', '0.7'));
urls.push(urlEntry(DOMAIN + '/builder-outdoor-punch-list', 'monthly', '0.7'));
urls.push(urlEntry(DOMAIN + '/pool-builder-landscape-partner', 'monthly', '0.7'));
urls.push(urlEntry(DOMAIN + '/book', 'monthly', '0.6'));
urls.push(urlEntry(DOMAIN + '/sprinkler-repair-qr', 'monthly', '0.6'));
urls.push(urlEntry(DOMAIN + '/drainage-review-qr', 'monthly', '0.6'));
urls.push(urlEntry(DOMAIN + '/hoa-outdoor-review-qr', 'monthly', '0.6'));
urls.push(urlEntry(DOMAIN + '/lighting-quote-qr', 'monthly', '0.6'));
urls.push(urlEntry(DOMAIN + '/maintenance-plan-qr', 'monthly', '0.6'));
urls.push(urlEntry(DOMAIN + '/facility-walkthrough-qr', 'monthly', '0.6'));
urls.push(urlEntry(DOMAIN + '/property-review-qr', 'monthly', '0.6'));
urls.push(urlEntry(DOMAIN + '/post-storm-qr', 'monthly', '0.6'));

serviceSlugs.forEach(slug => {
  urls.push(urlEntry(`${DOMAIN}/services/${slug}`, 'monthly', '0.7'));
});

locationSlugs.forEach(slug => {
  urls.push(urlEntry(`${DOMAIN}/areas/${slug}`, 'monthly', '0.6'));
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

fs.writeFileSync('public/sitemap.xml', sitemap);
console.log(`Sitemap generated: ${urls.length} URLs (${serviceSlugs.length} services, ${locationSlugs.length} locations)`);
