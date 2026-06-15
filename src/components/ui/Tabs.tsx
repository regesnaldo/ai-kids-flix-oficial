"use client";

import React from "react";

interface TabsProps<T extends string> {
  tabs: Array<{ id: T; label: string; color?: string }>;
  activeTab: T;
  onChange: (id: T) => void;
  className?: string;
}

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className = "",
}: TabsProps<T>) {
  return (
    <div
      className={`flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-label={tab.label}
            onClick={() => onChange(tab.id)}
            className={`
              relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mente-primary/50
              ${
                isActive
                  ? "text-white shadow-sm"
                  : "text-mente-muted hover:text-mente-text hover:bg-white/5"
              }
            `}
            style={
              isActive && tab.color
                ? {
                    backgroundColor: `${tab.color}20`,
                    border: `1px solid ${tab.color}50`,
                    color: tab.color,
                  }
                : {
                    backgroundColor: "transparent",
                    border: "1px solid transparent",
                  }
            }
          >
            {tab.label}
            {isActive && (
              <span
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ backgroundColor: tab.color ?? "#7C3AED" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
