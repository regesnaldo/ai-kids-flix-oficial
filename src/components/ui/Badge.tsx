"use client";

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function Badge({ children, color, className = "" }: BadgeProps) {
  const baseStyle = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

  if (color) {
    return (
      <span
        className={`${baseStyle} ${className}`}
        style={{
          backgroundColor: `${color}18`,
          color,
          border: `1px solid ${color}33`,
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <span className={`${baseStyle} bg-mente-surface text-mente-muted border border-slate-600 ${className}`}>
      {children}
    </span>
  );
}
