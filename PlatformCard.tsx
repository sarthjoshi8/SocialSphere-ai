'use client';

import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import type { AnalysisResult, PlatformAnalysis } from '@/lib/types';

interface PlatformCardProps {
  data: AnalysisResult['platformAnalysis'];
}

const PLATFORM_CONFIG = {
  LinkedIn: {
    color: '#0a66c2',
    bg: 'rgba(10,102,194,0.1)',
    border: 'rgba(10,102,194,0.3)',
    icon: '💼',
  },
  'X (Twitter)': {
    color: '#1d9bf0',
    bg: 'rgba(29,155,240,0.1)',
    border: 'rgba(29,155,240,0.3)',
    icon: '𝕏',
  },
  Instagram: {
    color: '#e1306c',
    bg: 'rgba(225,48,108,0.1)',
    border: 'rgba(225,48,108,0.3)',
    icon: '📸',
  },
};

function ScoreMeter({ score, color }: { score: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex-1 h-2 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
        />
      </div>
      <span className="text-sm font-bold" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

function PlatformPanel({ p }: { p: PlatformAnalysis }) {
  const config =
    PLATFORM_CONFIG[p.platform as keyof typeof PLATFORM_CONFIG] ?? PLATFORM_CONFIG.LinkedIn;

  return (
    <div
      className="p-5 rounded-2xl space-y-4"
      style={{ background: config.bg, border: `1px solid ${config.border}` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.icon}</span>
          <span className="font-semibold text-white">{p.platform}</span>
        </div>
        <span
          className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ background: `${config.color}20`, color: config.color }}
        >
          {p.estimatedReach}
        </span>
      </div>

      <ScoreMeter score={p.score} color={config.color} />

      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {p.feedback}
      </p>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Tips
        </p>
        <ul className="space-y-1.5">
          {p.suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span style={{ color: config.color, flexShrink: 0 }}>→</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      {p.characterCount && (
        <div
          className="text-xs px-3 py-2 rounded-lg"
          style={{ background: 'rgba(0,0,0,0.2)' }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Ideal length: </span>
          <span style={{ color: config.color }} className="font-semibold">
            ~{p.characterCount} chars
          </span>
        </div>
      )}
    </div>
  );
}

export default function PlatformCard({ data }: PlatformCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-6 space-y-5"
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)' }}
        >
          <Globe className="w-4 h-4" style={{ color: '#10b981' }} />
        </div>
        <h3 className="font-semibold text-white">Platform-Specific Analysis</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {data.map((p) => (
          <PlatformPanel key={p.platform} p={p} />
        ))}
      </div>
    </motion.div>
  );
}
