/**
 * Theme provider of the portal.
 *
 * The chosen theme lives in `localStorage` and is applied through the `data-theme` attribute of the
 * document, so every color comes from the CSS custom properties of `index.css`.
 */

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme, type ThemeContextValue } from './ThemeContext'

const STORAGE_KEY = 'voltiagrid.theme'

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * Reads the saved theme.
 *
 * @returns The saved theme, or the dark theme when there is none.
 */
function readTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

/**
 * Saves the chosen theme.
 *
 * @param theme Theme to save.
 */
function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    return
  }
}

/**
 * Holds the visual theme of the portal.
 *
 * @param props Component properties.
 * @param props.children Routes that can read the theme context.
 * @returns The theme context provider.
 */
export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(readTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    saveTheme(theme)
  }, [theme])

  const setTheme = useCallback((next: Theme): void => {
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback((): void => {
    setThemeState((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
