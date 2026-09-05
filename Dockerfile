# syntax=docker/dockerfile:1
# Multi-stage build for a Next.js (standalone) app. The runtime listens on port
# 80 so the hosting platform's Traefik can route to it with no extra config.

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Inlined into the client bundle at build time, so it has to be known here rather
# than at run time. The default matches the fallback in lib/site-url.ts, so the
# platform build is unchanged; docker-compose.local.yml overrides it.
ARG NEXT_PUBLIC_SITE_URL=https://smashr.hu
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Where the admin writes the editable content. A volume is mounted here by both
# compose files; without one the file lives in the container layer and a redeploy
# would quietly restore the shipped menu.
ENV SMASHR_DATA_DIR=/data
ENV PORT=80
ENV HOSTNAME=0.0.0.0
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 80
CMD ["node", "server.js"]
