"use client";

/** Wraps a block and feeds the pointer position to the CSS spotlight (.spot::before uses --mx / --my). */
export function Spot({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`spot ${className}`}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}
