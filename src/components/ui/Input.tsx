"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-mente-muted mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-mente-surface border border-slate-600 rounded-2xl px-5 py-4 text-mente-text placeholder:text-mente-muted/60 focus:outline-none focus:ring-2 focus:ring-mente-primary/50 focus:border-mente-primary/50 transition-all duration-200 ${className}`}
        {...props}
      />
    </div>
  );
}
