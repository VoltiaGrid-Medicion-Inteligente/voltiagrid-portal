/**
 * Decorative electrical scene: night sky, transmission towers and the brand curves.
 */

import { useId } from 'react'

/** Properties of the energy scene. */
export interface EnergySceneProps {
  className?: string
}

/**
 * Draws the decorative scene used by the login screen and the home hero.
 *
 * @param props Class applied to the SVG.
 * @returns The inline SVG of the scene.
 */
export default function EnergyScene({ className }: EnergySceneProps) {
  const skyId = useId()
  const sunId = useId()
  const groundId = useId()

  return (
    <svg
      className={className}
      viewBox="0 0 720 480"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={skyId} x1="360" y1="0" x2="360" y2="480" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#030817" />
          <stop offset="0.5" stopColor="#071B46" />
          <stop offset="0.78" stopColor="#0A3A85" />
          <stop offset="1" stopColor="#0B4DA8" />
        </linearGradient>
        <radialGradient id={sunId} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE9A3" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#F2B705" stopOpacity="0.55" />
          <stop offset="1" stopColor="#F2B705" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id={groundId}
          x1="0"
          y1="380"
          x2="0"
          y2="480"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#06122B" stopOpacity="0.35" />
          <stop offset="1" stopColor="#030817" />
        </linearGradient>
      </defs>

      <rect width="720" height="480" fill={`url(#${skyId})`} />
      <circle cx="548" cy="332" r="150" fill={`url(#${sunId})`} />
      <circle cx="548" cy="332" r="34" fill="#F7C948" opacity="0.55" />

      <g fill="#DCEAFF" opacity="0.5">
        <circle cx="86" cy="62" r="1.6" />
        <circle cx="196" cy="38" r="1.2" />
        <circle cx="318" cy="84" r="1.4" />
        <circle cx="452" cy="52" r="1.1" />
        <circle cx="620" cy="96" r="1.5" />
        <circle cx="688" cy="44" r="1.2" />
      </g>

      <g fill="#061530" opacity="0.85">
        <rect x="24" y="352" width="34" height="68" rx="3" />
        <rect x="66" y="336" width="24" height="84" rx="3" />
        <rect x="98" y="364" width="40" height="56" rx="3" />
        <rect x="148" y="344" width="22" height="76" rx="3" />
        <rect x="470" y="356" width="30" height="64" rx="3" />
        <rect x="510" y="338" width="22" height="82" rx="3" />
        <rect x="544" y="362" width="38" height="58" rx="3" />
        <rect x="596" y="348" width="26" height="72" rx="3" />
        <rect x="634" y="366" width="44" height="54" rx="3" />
        <rect x="686" y="346" width="20" height="74" rx="3" />
      </g>
      <g fill="#F2B705" opacity="0.35">
        <rect x="32" y="362" width="4" height="4" />
        <rect x="44" y="378" width="4" height="4" />
        <rect x="74" y="348" width="4" height="4" />
        <rect x="106" y="376" width="4" height="4" />
        <rect x="480" y="370" width="4" height="4" />
        <rect x="518" y="352" width="4" height="4" />
        <rect x="556" y="378" width="4" height="4" />
        <rect x="604" y="362" width="4" height="4" />
        <rect x="648" y="382" width="4" height="4" />
      </g>

      <g stroke="#4D8FE0" strokeWidth="2" strokeLinecap="round" opacity="0.55">
        <path d="M-10 206C90 236 138 292 168 322" />
        <path d="M168 322c70-12 128-12 192 0" />
        <path d="M360 322c76-14 140-12 200 4" />
        <path d="M560 326c60 12 110 44 170 62" />
      </g>

      <g stroke="#7FB6FF" strokeWidth="0.8" opacity="0.4">
        <path d="M0 250C80 274 122 304 152 330" />
        <path d="M376 326c64-12 120-10 176 6" />
        <path d="M560 326c56 12 106 32 160 44" />
      </g>

      <g stroke="#0B2C6B" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <g transform="translate(168 206)">
          <path d="M-24 116 -10 0h20l14 116" />
          <path d="M-30 34h60M-26 60h52M-22 86h44M-34 116h68" />
          <path d="M-10 0-30 34M10 0l20 34M-26 34-40 70M26 34l14 36M-34 70-46 116M34 70l12 46" />
          <path d="M-48 6h96M-38 18h76" />
        </g>
        <g transform="translate(360 196)">
          <path d="M-26 126 -11 0h22l15 126" />
          <path d="M-33 36h66M-29 64h58M-25 92h50M-37 126h74" />
          <path d="M-11 0-33 36M11 0l22 36M-29 36-44 74M29 36l15 38M-37 74-50 126M37 74l13 52" />
          <path d="M-52 6h104M-42 18h84" />
        </g>
        <g transform="translate(560 214)">
          <path d="M-22 108 -9 0h18l13 108" />
          <path d="M-28 32h56M-24 56h48M-20 80h40M-31 108h62" />
          <path d="M-9 0-28 32M9 0l19 32M-24 32-37 66M24 32l13 34M-31 66-43 108M31 66l12 42" />
          <path d="M-44 6h88M-35 17h70" />
        </g>
      </g>

      <g stroke="#7FB6FF" strokeWidth="1.1" opacity="0.65">
        <path d="M120 212h96" />
        <path d="M308 202h104" />
        <path d="M516 220h88" />
        <path d="M120 212c62 40 124 40 188 0" />
        <path d="M308 202c68 42 136 42 204 0" />
      </g>

      <rect y="380" width="720" height="100" fill={`url(#${groundId})`} />

      <path
        d="M0 462c96-24 168-70 244-86 78-16 120 12 190 30 92 24 166 30 286 22v52H0v-18Z"
        fill="#F2B705"
        opacity="0.92"
      />
      <path
        d="M0 430c108-18 180-64 258-78 80-14 128 16 196 34 90 24 164 28 266 20"
        stroke="#F7C948"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M0 448c110-20 190-58 262-72 80-16 132 18 200 34 92 22 158 24 258 18"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.18"
      />
    </svg>
  )
}
