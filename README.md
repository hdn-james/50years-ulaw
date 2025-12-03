# 50 Years ULAW – Admin Portal

Modernized admin portal for managing ULAW’s 50th anniversary content. Built with Next.js App Router, shadcn UI, React Hook Form, and a PostgreSQL backend managed through Prisma.

---

## Stack Highlights

- **Framework:** Next.js 15 (App Router, Server Components)
- **UI:** shadcn/ui components, Tailwind 4, Lucide icons
- **Forms:** React Hook Form + Zod validation
- **Stateful APIs:** Next.js Route Handlers (`app/api/*`)
- **Persistence:** PostgreSQL (Dockerized) + Prisma ORM
- **Auth:** Cookie-based sessions backed by Prisma `User` + `Session` tables
- **Admin UX:** Login page + protected `/admin` dashboard with rich content management tools

---

## Quick Start

### 1. Environment Setup

```bash
cp .env.example .env
```

Update values as needed (database credentials, admin bootstrap user, auth tuning).

### 2. Dependencies

```bash
npm install
```

### 3. Launch Database (Docker)

```bash
npm run docker:up
```

- Postgres: `localhost:5432`
- Adminer UI: `http://localhost:8080` (optional DB browser)

Stop stack anytime with `npm run docker:down`.

### 4. Prisma Workflow

```bash
npm run db:generate           # regenerate Prisma client
npm run db:migrate -- --name init
npx tsx prisma/seed.ts        # create admin user + sample content
npm run db:studio             # (optional) graphical data explorer
```

Seeding defaults:
- Username: `ADMIN_DEFAULT_USERNAME`
- Password: `ADMIN_DEFAULT_PASSWORD`

### 5. Run the App

```bash
npm run dev
```

Open `http://localhost:3000/login` and sign in with the seeded admin credentials. You’ll be redirected to the protected `/admin` area.

---

## Project Structure

```
app/
  login/               # shadcn login page
  admin/               # protected dashboard + content manager
  api/
    auth/              # login/logout routes
    admin/content/     # Prisma-backed CRUD endpoints
components/            # shared UI components
constants/             # auth/session constants
lib/
  auth.ts              # hashing + token helpers
  prisma.ts            # Prisma client singleton
  session.ts           # cookie/session utilities
prisma/
  schema.prisma        # DB schema (users, sessions, content, tags)
  seed.ts              # bootstrap script
docker-compose.yml     # postgres + adminer stack
docs/
  DATABASE_SETUP.md    # detailed DB workflow
```

---

## Authentication Flow

1. **Login** (`/api/auth/login`)
   - Validates credentials from Prisma `User`.
   - Issues session token + auth cookie.
2. **Proxy Guard** (`proxy.ts`)
   - Redirects unauthenticated users away from `/admin` routes.
3. **Session Utilities**
   - `lib/session.ts` handles issuing, verifying, and revoking sessions.
   - Logout deletes cookies and DB session record.

---

## Content Management

- `/admin/content` fetches/prunes data via the `/api/admin/content` route handler.
- API layer enforces role-based access and persists:
  - News content metadata (title, slug, body, SEO fields, media URLs)
  - Tags (many-to-many via join table)
  - Images (stored as JSON metadata)
- UI handles live filtering, CRUD, and form validation (Zod + RHF).

---

## Useful Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` / `npm run start` | Production build + serve |
| `npm run lint` | Biome lint/format |
| `npm run docker:up` / `docker:down` | Manage Postgres stack |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate -- --name <label>` | Create/apply migrations |
| `npm run db:studio` | Inspect data via Prisma Studio |
| `npx tsx prisma/seed.ts` | Seed admin + sample content |

---

## Troubleshooting

- **Cannot connect to DB:** Ensure Docker stack is up; check logs with `docker logs ulaw-postgres`.
- **Migrations fail:** Verify `DATABASE_URL` matches docker-compose values.
- **Login not working:** Re-run seed script to reset admin credentials; clear cookies if necessary.
- **Need a clean slate:** Stop Docker, remove the `postgres-data` volume, bring stack back up, rerun migrations + seed.

---

## Deployment Notes

- Provision a managed Postgres instance (or reuse dockerized service) and expose its connection string via `DATABASE_URL`.
- Run Prisma migrations as part of your CI/CD flow (`prisma migrate deploy`).
- Set `AUTH_COOKIE_*` values appropriately (secure cookies, HTTPS).
- Consider adding object storage for media instead of storing direct URLs.

---

Happy building! 🎓✨