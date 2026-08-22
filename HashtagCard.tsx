'use client';

import { motion } from 'framer-motion';
import { Hash } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';

interface HashtagCardProps {
  data: AnalysisResult['hashtagIntelligence'];
}

const CATEGORIES = [
  {
    key: 'suggested' as const,
    label: 'General',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
    border: 'rgba(139,92,246,0.3)',
  },
  {
    key: 'niche' as const,
    label: 'Niche',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.12)',
    border: 'rgba(6,182,212,0.3)',
  },
  {
    key: 'trending' as const,
    label: 'Trending-Style',
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.12)',
    border: 'rgba(236,72,153,0.3)',
  },
];

export default function HashtagCard({ data }: HashtagCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6 space-y-5"
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.3)' }}
        >
          <Hash className="w-4 h-4" style={{ color: '#06b6d4' }} />
        </div>
        <h3 className="font-semibold text-white">Hashtag Intelligence</h3>
      </div>

      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {data.explanation}
      </p>

      <div className="space-y-4">
        {CATEGORIES.map(({ key, label, color, bg, border }) => (
          <div key={key}>
            <p
              className="text-xs font-medium uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {label}
            </p>
            <div className="flex flex-wrap gap-2">
              {data[key].map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                  className="hashtag-pill"
                  style={{ color, background: bg, borderColor: border }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
