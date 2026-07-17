# CrackerSwap Admin Panel

React 19 + Vite + Tailwind admin panel for the CrackerSwap DEX backend. It is
wired to the backend admin API (`/v1/admin/*`): JWT auth, dashboard metrics,
token moderation, featured-token curation, platform health, admin-user
management, and a transactions feed.

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL to your backend
npm run dev            # http://localhost:3000
```

`VITE_API_BASE_URL` must point at the backend including the `/v1` prefix
(default `http://localhost:8000/v1`). Sign in at `/admin/login` with the admin
credentials provisioned on the backend (seeded from `ADMIN_EMAIL` /
`ADMIN_PASSWORD`).

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build (outputs to `out/`)
- `npm run preview` — preview the production build

## Admin pages

| Page | Backend endpoint |
|------|------------------|
| Login | `POST /admin/auth/login`, `GET /admin/auth/me` |
| Dashboard | `GET /admin/dashboard` |
| Token Moderation | `GET/PATCH/DELETE /admin/tokens` |
| Featured Tokens | `GET/POST/PATCH/DELETE /admin/featured` |
| Platform Monitoring | `GET /admin/platform/health` |
| Admin Users (super-admin) | `GET/POST/PATCH/DELETE /admin/users` |
| Transactions | `GET /admin/transactions` |
| Platform Fee | `GET/PUT /admin/platform/fee` |

## Notes

- Roles: `super_admin` (can manage admins) and `admin` (everything else).
- UI elements without a backing API (token ingestion queue, settings, audit
  logs, granular permission matrix, token social/liquidity fields, etc.) are
  commented out with `NO API` markers rather than showing mock data.
