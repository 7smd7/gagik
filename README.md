# Gagik Harutyunyan Portfolio

A multilingual portfolio website for artist Gagik Harutyunyan, built with Next.js, Payload CMS, and PostgreSQL.

## Tech Stack

- **Framework**: Next.js 16.1 (App Router, standalone output)
- **CMS**: Payload CMS 3.68.4 with `@payloadcms/db-postgres`
- **Database**: PostgreSQL 16
- **Storage**: Cloudflare R2 (via custom adapter)
- **Email**: Resend
- **Deployment**: Docker + Docker Compose (Coolify)
- **Locales**: English (en), Armenian (hy), Russian (ru)

## Features

- 🌍 **Multilingual** content (en/hy/ru) with locale-aware routing
- 🎨 **Collections**: Works, Series, Press, Pages, Media
- 🌐 **Globals**: Site Settings (SEO defaults, social links, analytics), Header, Footer
- 📸 **Media Storage**: R2-backed uploads with custom domain support
- 🔍 **SEO**: Per-page metadata, Open Graph images, structured data
- 📧 **Email**: Resend adapter for transactional emails
- 🚀 **CI/CD**: Automatic migrations on container startup

## Local Development

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local dev without Docker)

### Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd gagik
   ```

2. **Create environment file**

   ```bash
   cp .env.example .env
   ```

   Fill in required values:
   - `POSTGRES_*` — Postgres credentials
   - `PAYLOAD_SECRET` — secret for JWT signing
   - `R2_*` — Cloudflare R2 bucket credentials
   - `RESEND_API_KEY` and `RESEND_FROM` — email adapter
   - `NEXT_PUBLIC_SITE_URL` — site base URL

3. **Start services**

   ```bash
   docker compose up -d
   ```

   The app will be available at `http://localhost:8374` (or the port in `docker-compose.yml`).

4. **Run migrations** (if not auto-applied)

   ```bash
   docker compose run --rm app sh -c "PAYLOAD_CONFIG_PATH=src/payload.config.ts ./node_modules/.bin/payload migrate"
   ```

5. **Create admin user**
   Visit `/admin` and create your first user.

### Development without Docker

If you prefer running locally with a standalone Postgres instance:

```bash
npm install
npm run dev
```

Ensure `POSTGRES_*` env vars point to your local DB.

## Project Structure

```
src/
├── app/
│   ├── (frontend)/[locale]/    # Public-facing pages (multilingual)
│   ├── (payload)/              # Payload admin UI
│   └── api/                    # Custom API routes
├── collections/                # Payload collections (Works, Series, etc.)
├── globals/                    # Payload globals (SiteSettings, Header, Footer)
├── components/                 # React components (Hero, Gallery, etc.)
├── migrations/                 # DB migrations
├── plugins/                    # Custom Payload plugins (R2 adapter, translations)
└── styles/                     # Global CSS
```

## Deployment

The project uses Docker for deployment. The `Dockerfile` builds a Next.js standalone image and runs migrations on startup.

### Build & Deploy

1. **Build the image**

   ```bash
   docker compose build app
   ```

2. **Push to your registry** (if using remote deployment)

   ```bash
   docker tag gagik-app:latest <registry>/gagik-app:latest
   docker push <registry>/gagik-app:latest
   ```

3. **Deploy** (Coolify or any Docker host)
   - Ensure all environment variables are set in your hosting platform
   - The container will automatically run `payload migrate` on startup
   - Expose port `8374` (or configure via `docker-compose.yml`)

### Migrations

Payload migrations are stored in `src/migrations/` and registered in `src/migrations/index.ts`.

- **Create a new migration**:
  ```bash
  docker compose run --rm app sh -c "PAYLOAD_CONFIG_PATH=src/payload.config.ts ./node_modules/.bin/payload migrate:create"
  ```
- **Run migrations**:
  ```bash
  docker compose run --rm app sh -c "PAYLOAD_CONFIG_PATH=src/payload.config.ts ./node_modules/.bin/payload migrate"
  ```
- **Check status**:
  ```bash
  docker compose run --rm app sh -c "PAYLOAD_CONFIG_PATH=src/payload.config.ts ./node_modules/.bin/payload migrate:status"
  ```

## Configuration

### Site Settings (Admin → Globals → Site Settings)

- **General**: Site name, URL, description (localized)
- **SEO Defaults**: Default OG image, Twitter handle
- **Social Links**: Instagram, Facebook, etc.
- **Analytics**: Google Analytics, Clarity, custom scripts
- **Structured Data**: Organization type, contact info

### Collections

- **Pages**: Flexible page builder with Hero, Biography blocks
- **Works**: Artist works with title, year, images, dimensions (localized)
- **Series**: Work series/collections (localized)
- **Press**: Press mentions/articles (localized)
- **Media**: R2-backed uploads with custom domain

## Environment Variables

| Variable               | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `POSTGRES_HOST`        | Postgres hostname                                           |
| `POSTGRES_PORT`        | Postgres port (default: 5432)                               |
| `POSTGRES_USER`        | Postgres user                                               |
| `POSTGRES_PASSWORD`    | Postgres password                                           |
| `POSTGRES_DB`          | Postgres database name                                      |
| `PAYLOAD_SECRET`       | Secret for JWT signing                                      |
| `PAYLOAD_CONFIG_PATH`  | Path to payload config (default: `src/payload.config.ts`)   |
| `R2_BUCKET`            | Cloudflare R2 bucket name                                   |
| `R2_ACCESS_KEY_ID`     | R2 access key                                               |
| `R2_SECRET_ACCESS_KEY` | R2 secret key                                               |
| `R2_ENDPOINT`          | R2 endpoint URL                                             |
| `R2_CUSTOM_DOMAIN`     | Custom domain for media (e.g., `https://files.example.com`) |
| `RESEND_API_KEY`       | Resend API key                                              |
| `RESEND_FROM`          | From email address                                          |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (used for metadata, OG images)              |

## License

Proprietary — All rights reserved.
