# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.mjs file.
# From https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:22.17.0-alpine AS base

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

# R2 Storage build args (needed for Next.js build)
ARG R2_BUCKET
ARG R2_ACCESS_KEY_ID
ARG R2_SECRET_ACCESS_KEY
ARG R2_ENDPOINT
ENV R2_BUCKET=${R2_BUCKET}
ENV R2_ACCESS_KEY_ID=${R2_ACCESS_KEY_ID}
ENV R2_SECRET_ACCESS_KEY=${R2_SECRET_ACCESS_KEY}
ENV R2_ENDPOINT=${R2_ENDPOINT}

# Disable Turbopack for production builds (Payload compatibility)
ENV TURBOPACK=0

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# Disable Turbopack for production builds (PayloadCMS doesn't support it)
ENV TURBOPACK=0

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build --legacy-peer-deps; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
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
CMD ["sh", "-c", "cd /app && if [ ! -d ./src/migrations ] || [ -z \"$(ls -A ./src/migrations 2>/dev/null)\" ]; then PAYLOAD_CONFIG_PATH=src/payload.config.ts ./node_modules/.bin/payload migrate:create --skip-empty --force-accept-warning init; fi; PAYLOAD_CONFIG_PATH=src/payload.config.ts ./node_modules/.bin/payload migrate; HOSTNAME=0.0.0.0 node server.js"]
