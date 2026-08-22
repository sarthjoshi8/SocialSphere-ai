'use client';

import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';

interface SuggestionsCardProps {
  data: AnalysisResult['improvementSuggestions'];
}

const PRIORITY_CONFIG = {
  high: { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.25)', label: 'High' },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', label: 'Medium' },
  low: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', label: 'Low' },
};

export default function SuggestionsCard({ data }: SuggestionsCardProps) {
  // Sort by priority: high → medium → low
  const sorted = [...data].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-6 space-y-5"
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)' }}
        >
          <Lightbulb className="w-4 h-4" style={{ color: '#f59e0b' }} />
        </div>
        <h3 className="font-semibold text-white">Content Improvement Suggestions</h3>
        <span
          className="ml-auto text-xs font-medium px-2 py-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}
        >
          {data.length} suggestions
        </span>
      </div>

      <div className="space-y-3">
        {sorted.map((s, i) => {
          const pc = PRIORITY_CONFIG[s.priority];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.4 }}
              className="p-4 rounded-xl space-y-2"
              style={{ background: pc.bg, border: `1px solid ${pc.border}` }}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${pc.color}20`, color: pc.color }}
                >
                  {pc.label} Priority
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}
                >
                  {s.category}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {s.suggestion}
              </p>
              {s.example && (
                <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>
                  Example: &ldquo;{s.example}&rdquo;
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
