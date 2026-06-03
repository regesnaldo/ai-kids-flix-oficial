"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "agent";
  agentColor?: string;
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  agentColor,
  size = "md",
  className = "",
  style,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-full",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
  };

  const variantClasses: Record<string, string> = {
    primary: "bg-mente-primary text-white hover:bg-mente-primary/90 font-medium",
    secondary:
      "bg-mente-surface text-mente-text border border-slate-600 hover:border-slate-500 font-medium",
    ghost: "bg-transparent text-mente-muted hover:text-mente-text hover:bg-white/5 font-normal",
    agent: "",
  };

  const agentStyle =
    variant === "agent" && agentColor
      ? {
          backgroundColor: `${agentColor}18`,
          color: agentColor,
          borderColor: `${agentColor}44`,
          ...style,
        }
      : style;

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mente-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      style={variant === "agent" ? agentStyle : style}
      {...props}
    >
      {children}
    </button>
  );
}
