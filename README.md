# voltiagrid-portal

Customer portal of VoltiaGrid Medición Inteligente (US-69): contract, network connection and
consumption of each customer, with light and dark themes and a Spanish/English interface.
Built with React, TypeScript and Vite. It reads the customer consumption API (`voltiagrid-api`).

## Requirements

- Node.js 22 (same version as CI)
- npm

## Setup

```powershell
npm ci
Copy-Item .env.example .env   # VITE_API_URL=/api uses the development proxy
npm run dev                   # http://localhost:5173
```

In development the Vite server proxies `/api` to the customer consumption API on
`http://localhost:8001` (see `vite.config.ts`), so the browser talks to a single origin and CORS does
not apply. Point `VITE_API_URL` to the API address in any other environment and enable CORS for the
portal origin there.

## Demo access

Sign-in uses the customer code and the password issued by the API (`POST /auth/token`). The
repository stores no credentials.

The visual review of this work used a temporary local mock of the API with synthetic values:

- Customer code: `CU-MAC000002`
- Password: `demo-password`

That mock listens on `http://localhost:8001` and is not part of this repository. Those values only
work while the mock is running and are not valid against the real API; use the demo customer of
`voltiagrid-api` in any other environment.

## Checks (same as CI)

```powershell
npm run lint           # ESLint
npm run format:check   # Prettier
npm test               # Vitest + Testing Library
npm run build          # type check and production build into dist/
```

## Theme and language

- The header has a theme toggle for the light and dark themes. Dark is the default and the choice is
  persisted in `localStorage` under `voltiagrid.theme`.
- The language selector switches between Spanish and English. Spanish is the default and the choice
  is persisted in `localStorage` under `voltiagrid.language`.
- The dictionaries live in `src/i18n/translations.ts`; add every new key to both languages.

## Layout

- `src/App.tsx`: routes, theme and language providers, and the authenticated layout.
- `src/api/`: typed fetch client and the TypeScript types of the API responses.
- `src/auth/`: in-memory session token and authentication provider.
- `src/components/`: shared components (`AppLayout`, `BrandMark`, `EnergyScene`, `Icon`,
  `ThemeToggle`, `LanguageToggle`).
- `src/i18n/`: language provider, context and the ES/EN dictionaries.
- `src/theme/`: theme provider and context.
- `src/pages/`: one component per page.
- `src/config.ts`: API address from `VITE_API_URL`.
- `src/test/setup.ts`: test setup (jest-dom matchers).

## Session

The login page requests a token from `POST /auth/token`. The token lives in memory only (never in
`localStorage` or `sessionStorage`), so reloading the page requires logging in again. Any `401`
closes the session and sends the customer back to the login page.
