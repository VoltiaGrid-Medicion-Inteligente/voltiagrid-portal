/**
 * Visual theme context shared by the pages of the portal.
 */

import { createContext, useContext } from 'react'

/** Theme of the portal. */
export type Theme = 'light' | 'dark'

/** State and operations that the theme provider exposes to the portal. */
export interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
})

/**
 * Reads the theme context.
 *
 * @returns The current theme and the operations that change it.
 */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
