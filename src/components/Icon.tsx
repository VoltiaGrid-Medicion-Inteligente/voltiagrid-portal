/**
 * Line icon set of the portal.
 */

import type { ReactNode } from 'react'

/** Name of an icon of the set. */
export type IconName =
  | 'home'
  | 'consumption'
  | 'contract'
  | 'network'
  | 'logout'
  | 'sun'
  | 'moon'
  | 'globe'
  | 'arrowRight'
  | 'bolt'
  | 'user'
  | 'meter'
  | 'transformer'
  | 'circuit'
  | 'shield'
  | 'gauge'
  | 'check'
  | 'eye'
  | 'eyeOff'
  | 'help'

/** Properties of an icon of the portal. */
export interface IconProps {
  name: IconName
  className?: string
  size?: number
}

const PATHS: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </>
  ),
  consumption: (
    <>
      <path d="M4 20v-9" />
      <path d="M10 20V4" />
      <path d="M16 20v-6" />
      <path d="M22 20H2" />
    </>
  ),
  contract: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="5" cy="19" r="2.5" />
      <circle cx="19" cy="19" r="2.5" />
      <path d="M10.5 7.2 6.5 16.8" />
      <path d="m13.5 7.2 4 9.6" />
      <path d="M7.5 19h9" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.9 4.9 1.4 1.4" />
      <path d="m17.7 17.7 1.4 1.4" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m4.9 19.1 1.4-1.4" />
      <path d="m17.7 6.3 1.4-1.4" />
    </>
  ),
  moon: <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.5 3.8 5.6 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3Z" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </>
  ),
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  meter: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="12" cy="11" r="2.5" />
      <path d="M12 13.5V16" />
      <path d="M8 17.5h8" />
    </>
  ),
  transformer: (
    <>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M8 9v6" />
      <path d="M12 9v6" />
      <path d="M16 9v6" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
    </>
  ),
  circuit: (
    <>
      <path d="M4 7h6a4 4 0 0 1 4 4v6" />
      <path d="M20 7h-4" />
      <circle cx="4" cy="7" r="1.5" />
      <circle cx="14" cy="17" r="1.5" />
      <circle cx="20" cy="7" r="1.5" />
      <path d="M14 17h3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 18a8 8 0 1 1 16 0" />
      <path d="m12 14 4-4" />
      <circle cx="12" cy="15" r="1.5" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M4 4 20 20" />
      <path d="M9.9 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 6 10 6a17 17 0 0 1-3.2 3.9" />
      <path d="M6.3 7.4A16.6 16.6 0 0 0 2 12s3.5 6 10 6a10.4 10.4 0 0 0 4.1-.8" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.3c-.7.4-1.1 1-1.1 1.7v.5" />
      <path d="M12 17.5h.01" />
    </>
  ),
}

/**
 * Draws one icon of the portal.
 *
 * @param props Name, size and class of the icon.
 * @returns The inline SVG of the icon.
 */
export default function Icon({ name, className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}
