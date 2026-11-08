# voltiagrid-portal

Customer portal of VoltiaGrid Medición Inteligente (US-69): contract, network connection and consumption of each customer.
Built with React, TypeScript and Vite. It reads the customer consumption API (`voltiagrid-api`).

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

## Checks (same as CI)

```powershell
npm run lint           # ESLint
npm run format:check   # Prettier
npm test               # Vitest + Testing Library
npm run build          # type check and production build into dist/
```

## Layout

- `src/App.tsx`: routes.
- `src/api/`: typed fetch client and the TypeScript types of the API responses.
- `src/auth/`: in-memory session token and authentication provider.
- `src/components/`: shared components.
- `src/pages/`: one component per page.
- `src/config.ts`: API address from `VITE_API_URL`.
- `src/test/setup.ts`: test setup (jest-dom matchers).

## Session

The login page requests a token from `POST /auth/token`. The token lives in memory only (never in
`localStorage` or `sessionStorage`), so reloading the page requires logging in again. Any `401`
closes the session and sends the customer back to the login page.
