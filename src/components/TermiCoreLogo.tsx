/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function TermiCoreLogo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="tc-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0D9488" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#tc-grad)" />
      {/* DIN Rail Profile Base */}
      <path d="M8 29H32V32H8V29Z" fill="#334155" opacity="0.6" />
      {/* Terminal Block Housing 1 */}
      <rect x="9" y="8" width="8" height="18" rx="2" fill="#2DD4BF" />
      {/* Terminal Block Housing 2 (Center) */}
      <rect x="19" y="6" width="12" height="20" rx="2.5" fill="white" />
      {/* Current Bar / Screw Accent */}
      <circle cx="25" cy="12" r="2" fill="#0D9488" />
      <path d="M22 17H28V19H22V17Z" fill="#0F766E" />
      {/* Connection wire marker */}
      <path d="M4 22H9" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M31 22H36" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
