// scripts/generate-robots.ts
import fs from "node:fs";
import path from "node:path";

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://eliteirrigation.com").replace(/\/$/, "");
const outFile = path.join((process as any).cwd(), "public/robots.txt");

function main() {
  const txt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /tech
Disallow: /login
Disallow: /signup
Disallow: /forgot-password
Disallow: /account
Disallow: /billing
Disallow: /settings
Disallow: /api-keys
Disallow: /notifications
Disallow: /activity
Disallow: /onboarding
Disallow: /invoice/
Disallow: /public/invoices/

Sitemap: ${BASE_URL}/sitemap.xml
`;
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, txt, "utf8");
  console.log("✅ robots.txt written");
}

main();
