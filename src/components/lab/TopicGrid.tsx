"use client";

import React from "react";
import type { Topic } from "@/types/topic";

interface TopicGridProps {
  topics: Topic[];
  onSelect: (question: string) => void;
}

export function TopicGrid({ topics, onSelect }: TopicGridProps) {
  return (
    <div>
      <p className="text-xs font-medium text-mente-muted uppercase tracking-wider mb-3">
        Tópicos para explorar
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelect(topic.question)}
            className="group text-left bg-mente-surface border border-slate-700 rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-mente-primary/50"
          >
            <div className="flex items-start gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                style={{ backgroundColor: topic.color }}
              />
              <div>
                <p className="text-sm font-medium text-mente-text group-hover:text-white transition-colors">
                  {topic.label}
                </p>
                <p className="text-xs text-mente-muted mt-1 line-clamp-2">
                  {topic.question}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
