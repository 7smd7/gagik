# syntax=docker/dockerfile:1.6
# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.mjs file.
# From https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:25.5.0-alpine AS base

# Disable npm update notifier and upgrade to npm 11.x
ENV NO_UPDATE_NOTIFIER=1
RUN npm install -g npm@latest

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm install --legacy-peer-deps; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time secrets (avoid ENV so they don't persist into the final image)
ARG R2_BUCKET
ARG R2_ACCESS_KEY_ID
ARG R2_SECRET_ACCESS_KEY
ARG R2_ENDPOINT
ARG R2_CUSTOM_DOMAIN

# Public environment variables (needed at build time for Next.js)
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Disable Turbopack for production builds (Payload compatibility)
ENV TURBOPACK=0

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# Disable Turbopack for production builds (PayloadCMS doesn't support it)
ENV TURBOPACK=0

RUN \
  if [ -f yarn.lock ]; then \
    R2_BUCKET="$R2_BUCKET" \
    R2_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID" \
    R2_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY" \
    R2_ENDPOINT="$R2_ENDPOINT" \
    R2_CUSTOM_DOMAIN="$R2_CUSTOM_DOMAIN" \
    yarn run build; \
  elif [ -f package-lock.json ]; then \
    R2_BUCKET="$R2_BUCKET" \
    R2_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID" \
    R2_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY" \
    R2_ENDPOINT="$R2_ENDPOINT" \
    R2_CUSTOM_DOMAIN="$R2_CUSTOM_DOMAIN" \
    npm run build --legacy-peer-deps; \
  elif [ -f pnpm-lock.yaml ]; then \
    R2_BUCKET="$R2_BUCKET" \
    R2_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID" \
    R2_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY" \
    R2_ENDPOINT="$R2_ENDPOINT" \
    R2_CUSTOM_DOMAIN="$R2_CUSTOM_DOMAIN" \
    corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Disable Turbopack at runtime as well
ENV TURBOPACK=0
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next
# Create media directory and give ownership to the runtime user
RUN mkdir media
RUN chown nextjs:nodejs media

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Include full node_modules so payload CLI is available for migrations
COPY --from=deps /app/node_modules ./node_modules

# Include source config for Payload CLI
COPY --from=builder --chown=nextjs:nodejs /app/src ./src

USER nextjs

EXPOSE 8374

ENV PORT=8374

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
# Create an initial migration if none exist, run migrations, then start the server
CMD ["sh", "-c", "cd /app && PAYLOAD_CONFIG_PATH=src/payload.config.ts ./node_modules/.bin/payload migrate; HOSTNAME=0.0.0.0 node server.js"]
