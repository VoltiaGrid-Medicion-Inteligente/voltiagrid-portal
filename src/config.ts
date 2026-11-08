/** Base URL of the customer consumption API, read at build time from `VITE_API_URL` (see `.env.example`). */
export const API_URL: string = import.meta.env.VITE_API_URL ?? '/api'
