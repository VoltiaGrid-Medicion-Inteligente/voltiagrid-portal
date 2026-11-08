# voltiagrid-portal

Customer portal of VoltiaGrid Medición Inteligente (US-69): contract, network connection and consumption of each customer.
Built with React, TypeScript and Vite. It reads the customer consumption API (`voltiagrid-api`).

## Setup

```bash
npm ci
cp .env.example .env   # set VITE_API_URL to the API address
npm run dev            # http://localhost:5173
```

## Checks (same as CI)

```bash
npm run lint           # ESLint
npm run format:check   # Prettier
npm test               # Vitest + Testing Library
npm run build          # type check and production build into dist/
```

## Layout

- `src/App.tsx`: routes.
- `src/pages/`: one component per page.
- `src/config.ts`: API address from `VITE_API_URL`.
- `src/test/setup.ts`: test setup (jest-dom matchers).
