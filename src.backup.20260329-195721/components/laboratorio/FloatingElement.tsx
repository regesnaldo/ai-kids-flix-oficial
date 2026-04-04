import type { ReactNode } from "react";

export default function FloatingElement({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`animate-[float_6s_ease-in-out_infinite] rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}
