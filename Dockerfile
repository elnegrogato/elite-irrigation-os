FROM node:20-alpine AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_SITE_URL=https://eliteirrigation.com
ARG NEXT_PUBLIC_CONVEX_URL=https://placeholder.convex.cloud
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_CONVEX_URL=$NEXT_PUBLIC_CONVEX_URL
# Increase Node heap for the large build (14k+ generated pages)
ENV NODE_OPTIONS="--max-old-space-size=8192"
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_SITE_URL=https://eliteirrigation.com
ENV NEXT_PUBLIC_CONVEX_URL=https://placeholder.convex.cloud
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=5 \
  CMD wget -qO- http://127.0.0.1:3000/health >/dev/null 2>&1 || exit 1

CMD ["node", "server.js"]
