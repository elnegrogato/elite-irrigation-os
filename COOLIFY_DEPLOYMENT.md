# 🚀 Coolify Deployment Guide - Elite Irrigation & Landscaping OS

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured in Convex
- [ ] Stripe webhook endpoints updated to production URLs
- [ ] Twilio webhook endpoints updated to production URLs  
- [ ] Resend domain verified
- [ ] DNS records configured
- [ ] `vite.config.ts` base path set to `/`
- [ ] All secrets stored securely (not in code)

---

## 🎯 Quick Deploy (5 Minutes)

### Step 1: Verify Files

Ensure these files exist in your project root:
- `docker-compose.yml` ✅
- `Dockerfile` ✅
- `nginx.conf` ✅
- `package.json` ✅
- `package-lock.json` ✅

### Step 2: Deploy Backend (Convex)

```bash
# Deploy Convex backend first
npx convex deploy --prod

# Note the deployment URL (e.g., https://your-team.convex.cloud)
```

### Step 3: Configure Environment Variables

In your Convex dashboard, set these environment variables:

**Required**:
```
AUTH_SESSION_SECRET=your_32_character_minimum_secret
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@eliteirrigation.com
```

**Optional**:
```
GOOGLE_CALENDAR_ID=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Step 4: Deploy to Coolify

1. **Login to Coolify Dashboard**
   - Navigate to your Coolify instance
   - Click "Projects" → "New Project"

2. **Connect Repository**
   - Choose "Git Repository" or "GitHub"
   - Select your repository
   - Branch: `main`

3. **Configure Build**
   - Build Pack: "Docker Compose"
   - Dockerfile: `Dockerfile` (auto-detected)
   - Compose File: `docker-compose.yml` (auto-detected)

4. **Set Environment Variables** (Frontend)
   - `VITE_CONVEX_URL=https://your-team.convex.cloud`
   - `NODE_ENV=production`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - Coolify will auto-assign a URL

### Step 5: Configure Domain

1. **Add Custom Domain** (in Coolify)
   - Settings → Domains
   - Add: `eliteirrigation.com`
   - Add: `www.eliteirrigation.com`

2. **Update DNS Records**
   ```
   A Record:    eliteirrigation.com → [Coolify IP]
   CNAME:       www → eliteirrigation.com
   ```

3. **Enable SSL**
   - Coolify auto-generates Let's Encrypt SSL
   - Verify HTTPS works

---

## 🔧 Common Issues & Solutions

### ❌ Issue: 404 on All Routes Except `/`

**Cause**: SPA routing not configured  
**Fix**: Verify `nginx.conf` has `try_files $uri $uri/ /index.html;`

**Check**:
```bash
# SSH into container
docker exec -it [container-id] sh

# Verify nginx config
cat /etc/nginx/conf.d/default.conf
```

---

### ❌ Issue: 502 Bad Gateway

**Cause**: Port conflicts or container not starting  
**Fix**: Remove ALL port mappings from `docker-compose.yml`

**Correct** (No ports):
```yaml
services:
  web:
    build: .
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

**Incorrect** (Has ports):
```yaml
services:
  web:
    build: .
    ports:
      - "3000:80"  # ❌ Remove this
```

---

### ❌ Issue: Assets Return 404

**Cause**: Incorrect build output directory  
**Fix**: Ensure Dockerfile copies from correct directory

**Check `vite.config.ts`**:
```typescript
export default defineConfig({
  build: {
    outDir: "dist-client", // ✅ Must match Dockerfile
  }
});
```

**Check `Dockerfile`**:
```dockerfile
COPY --from=build /app/dist-client /usr/share/nginx/html
```

---

### ❌ Issue: Build Fails with Missing Dependencies

**Cause**: Using `npm ci --only=production` skips devDependencies  
**Fix**: Use `npm ci` (includes devDependencies needed for build)

**Correct**:
```dockerfile
RUN npm ci  # ✅ Includes all dependencies
RUN npm run build
```

**Incorrect**:
```dockerfile
RUN npm ci --only=production  # ❌ Skips devDependencies
RUN npm run build  # Will fail
```

---

### ❌ Issue: Convex Connection Error

**Cause**: Frontend can't reach Convex backend  
**Fix**: Set `VITE_CONVEX_URL` environment variable in Coolify

**In Coolify Dashboard**:
- Settings → Environment Variables
- Add: `VITE_CONVEX_URL=https://your-team.convex.cloud`
- Redeploy

---

### ❌ Issue: Blank White Page

**Cause**: JavaScript errors or incorrect base path  
**Fix**: Check browser console and verify `vite.config.ts`

**Browser Console**:
```
F12 → Console tab → Check for errors
```

**Fix `vite.config.ts`**:
```typescript
export default defineConfig({
  base: '/', // ✅ Must be '/' for root domain
});
```

---

## 📊 Post-Deployment Verification

### 1. Health Check
```bash
curl https://eliteirrigation.com/health
# Expected: "healthy"
```

### 2. Test Critical Paths

- [ ] Homepage loads (`/`)
- [ ] Admin login works (`/admin`)
- [ ] Lead capture form submits
- [ ] Convex queries return data
- [ ] Images load correctly
- [ ] SPA routing works (refresh on `/irrigation` returns page, not 404)

### 3. Test Integrations

- [ ] Stripe checkout creates payment intent
- [ ] Twilio sends SMS (test with real phone)
- [ ] Resend sends email (check spam folder)
- [ ] Convex webhooks receive events

### 4. Performance Check

```bash
# Run Lighthouse audit
npx lighthouse https://eliteirrigation.com --view

# Targets:
# Performance: 90+
# Accessibility: 95+
# Best Practices: 95+
# SEO: 100
```

---

## 🔐 Security Post-Deployment

### 1. Enable Security Headers

Already configured in `nginx.conf`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### 2. Force HTTPS

In Coolify:
- Settings → SSL → "Force HTTPS" → Enable

### 3. Update Webhook URLs

**Stripe**:
1. Dashboard → Developers → Webhooks
2. Update endpoint: `https://your-convex-url.convex.cloud/stripe/webhook`

**Twilio**:
1. Console → Phone Numbers → [Your Number]
2. Messaging webhook: `https://your-convex-url.convex.cloud/twilio/sms`
3. Voice webhook: `https://your-convex-url.convex.cloud/twilio/voice`

---

## 📈 Monitoring Setup

### 1. Uptime Monitoring

Use **UptimeRobot** or **Pingdom**:
- Monitor: `https://eliteirrigation.com/health`
- Interval: 5 minutes
- Alert: Email + SMS

### 2. Error Tracking

Add **Sentry** (already in dependencies):

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

### 3. Analytics

Already configured:
- Google Analytics (if added)
- Convex analytics dashboard
- Admin dashboard metrics

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

In Coolify:
1. Settings → Git
2. Enable "Auto Deploy"
3. Branch: `main`
4. Every push to `main` triggers deployment

### Manual Deployment

```bash
# From Coolify dashboard
Projects → [Your Project] → Deploy
```

---

## 🆘 Emergency Rollback

### Quick Rollback

In Coolify:
1. Deployments → History
2. Find last working deployment
3. Click "Redeploy"

### Manual Rollback

```bash
# Rollback Convex
npx convex deploy --preview [deployment-id]

# Rollback frontend via git
git revert [bad-commit]
git push origin main
# Coolify auto-deploys
```

---

## 📚 Additional Resources

- **Coolify Docs**: https://coolify.io/docs
- **Convex Deployment**: https://docs.convex.dev/production
- **Nginx SPA Config**: https://router.vuejs.org/guide/essentials/history-mode.html#nginx
- **Vite Build**: https://vitejs.dev/guide/build.html

---

## ✅ Success Checklist

- [ ] Backend deployed to Convex
- [ ] Frontend deployed to Coolify
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] All integrations tested
- [ ] Monitoring enabled
- [ ] Security headers verified
- [ ] Performance audit passed
- [ ] Error tracking configured
- [ ] Auto-deploy enabled

---

## 🎉 You're Live!

Your Elite Irrigation & Landscaping OS is now in production!

**Next Steps**:
1. Monitor error logs for 24 hours
2. Test all critical user flows
3. Update social media links
4. Submit sitemap to Google Search Console
5. Enable real-time alerts

**Support**: If issues persist, check Coolify logs or Convex dashboard.

---

**Built with ❤️ for Elite Irrigation & Landscaping**
