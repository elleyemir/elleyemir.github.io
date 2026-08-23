interface LogoProps {
  className?: string;
  /** Renders the wordmark next to the knight mark. */
  withWordmark?: boolean;
}

/**
 * Custom inline SVG logo: an abstract chess-knight mark inside a rounded
 * board tile. Monochrome via `currentColor`, with a gold accent eye.
 */
export function KnightMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="Chess knight mark"
    >
      <rect
        x="1.25"
        y="1.25"
        width="45.5"
        height="45.5"
        rx="11"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="1.5"
      />
      {/* two board squares, top-left / bottom-right */}
      <path d="M1.5 12.5h11v-11" stroke="currentColor" strokeOpacity="0.13" strokeWidth="1.2" />
      <path d="M46.5 35.5h-11v11" stroke="currentColor" strokeOpacity="0.13" strokeWidth="1.2" />
      {/* knight */}
      <path
        d="M17 37c0-7.2 2.6-10.9 7.1-13.6l-4.4-3.2 5.6-2-1.6-5.2 6.6 3.4c3.3 1.7 4.4 5.6 2.5 8.5-1.7 2.6-4.2 3.6-5 6.2L31 37"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="13.5" y="37" width="21" height="3.6" rx="1.8" fill="currentColor" />
      <circle cx="28.6" cy="19.4" r="1.35" fill="#e3b447" />
    </svg>
  );
}

export default function Logo({ className = '', withWordmark = true }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-parchment ${className}`}>
      <KnightMark className="h-8 w-8 shrink-0" />
      {withWordmark && (
        <span className="font-display text-[1.05rem] font-bold leading-none tracking-tight">
          Ali<span className="text-gold-500">.</span>Amir
        </span>
      )}
    </span>
  );
}
