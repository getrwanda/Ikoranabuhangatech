export function ImigongoPattern({ className = "", opacity = 0.1 }: { className?: string; opacity?: number }) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity }}
    >
      <defs>
        <pattern id="imigongo-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M0 60 L60 0 L120 60 L60 120 Z" fill="hsl(203 100% 33%)" opacity="0.3" />
          <path d="M30 60 L60 30 L90 60 L60 90 Z" fill="hsl(195 100% 47%)" opacity="0.4" />
          <path d="M0 0 L40 0 L20 20 Z" fill="hsl(203 100% 33%)" opacity="0.2" />
          <path d="M80 0 L120 0 L100 20 Z" fill="hsl(203 100% 33%)" opacity="0.2" />
          <path d="M0 80 L20 100 L0 120 Z" fill="hsl(195 100% 47%)" opacity="0.25" />
          <path d="M100 100 L120 80 L120 120 Z" fill="hsl(195 100% 47%)" opacity="0.25" />
          
          <circle cx="60" cy="60" r="8" fill="hsl(195 100% 47%)" opacity="0.5" />
          <circle cx="0" cy="0" r="4" fill="hsl(203 100% 33%)" opacity="0.4" />
          <circle cx="120" cy="0" r="4" fill="hsl(203 100% 33%)" opacity="0.4" />
          <circle cx="0" cy="120" r="4" fill="hsl(203 100% 33%)" opacity="0.4" />
          <circle cx="120" cy="120" r="4" fill="hsl(203 100% 33%)" opacity="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#imigongo-pattern)" />
    </svg>
  );
}

export function ImigongoAccent({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg width="100%" height="4" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <pattern id="accent-pattern" x="0" y="0" width="40" height="4" patternUnits="userSpaceOnUse">
            <polygon points="0,0 20,0 10,4" fill="hsl(203 100% 33%)" />
            <polygon points="20,0 40,0 30,4" fill="hsl(195 100% 47%)" />
          </pattern>
        </defs>
        <rect width="100%" height="4" fill="url(#accent-pattern)" />
      </svg>
    </div>
  );
}
