/**
 * Brand mark of VoltiaGrid: a hexagon grid crossed by a lightning bolt.
 */

import { useId } from 'react'

/** Properties of the brand mark. */
export interface BrandMarkProps {
  className?: string
}

/**
 * Draws the isotype of the brand.
 *
 * @param props Size and class of the mark.
 * @returns The inline SVG of the brand mark.
 */
export default function BrandMark({ className }: BrandMarkProps) {
  const gradientId = useId()

  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient
          id={gradientId}
          x1="8"
          y1="3"
          x2="56"
          y2="61"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#2E9BFF" />
          <stop offset="0.55" stopColor="#0762D9" />
          <stop offset="1" stopColor="#073BD9" />
        </linearGradient>
      </defs>
      <path
        d="M32 4 55 17.5v29L32 60 9 46.5v-29L32 4Z"
        stroke={`url(#${gradientId})`}
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <g stroke={`url(#${gradientId})`} strokeWidth="1.8" strokeLinecap="round" opacity="0.85">
        <path d="M9 17.5 32 31l23-13.5" />
        <path d="M9 46.5 32 33l23 13.5" />
        <path d="M32 4v9" />
        <path d="M32 51v9" />
        <path d="M20.5 10.7 32 17.5l11.5-6.8" />
        <path d="M20.5 53.3 32 46.5l11.5 6.8" />
      </g>
      <g fill="#0762D9" stroke="#0B2C6B" strokeWidth="1.2">
        <circle cx="20.5" cy="24" r="2.2" />
        <circle cx="43.5" cy="24" r="2.2" />
        <circle cx="20.5" cy="40" r="2.2" />
        <circle cx="43.5" cy="40" r="2.2" />
      </g>
      <path
        d="M36 9 20 35h9.5L26 55l18-28h-9.5L36 9Z"
        fill="#F2B705"
        stroke="#073BD9"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}
