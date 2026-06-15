"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className = "", style, onClick, hoverable = false }: CardProps) {
  return (
    <div
      className={`bg-mente-surface border border-slate-700 rounded-2xl transition-all duration-200 ${
        hoverable
          ? "cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:shadow-mente-primary/5"
          : ""
      } ${className}`}
      style={style}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
