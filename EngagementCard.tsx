'use client';

import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';

interface EngagementCardProps {
  data: AnalysisResult['engagementPotential'];
}

const LEVEL_CONFIG = {
  low: { color: '#f43f5e', label: 'Low Engagement', emoji: '📉', glow: 'rgba(244,63,94,0.2)' },
  medium: { color: '#f59e0b', label: 'Medium Engagement', emoji: '📊', glow: 'rgba(245,158,11,0.2)' },
  high: { color: '#10b981', label: 'High Engagement', emoji: '📈', glow: 'rgba(16,185,129,0.2)' },
  viral: { color: '#8b5cf6', label: 'Viral Potential', emoji: '🚀', glow: 'rgba(139,92,246,0.3)' },
};

export default function EngagementCard({ data }: EngagementCardProps) {
  const config = LEVEL_CONFIG[data.level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="glass-card p-6 space-y-5"
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}
        >
          <TrendingUp className="w-4 h-4" style={{ color: '#a78bfa' }} />
        </div>
        <h3 className="font-semibold text-white">Engagement Potential</h3>
      </div>

      {/* Level badge */}
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ boxShadow: [`0 0 20px ${config.glow}`, `0 0 40px ${config.glow}`, `0 0 20px ${config.glow}`] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl w-16 h-16 flex items-center justify-center rounded-2xl flex-shrink-0"
          style={{ background: `${config.color}15`, border: `1px solid ${config.color}30` }}
        >
          {config.emoji}
        </motion.div>
        <div>
          <p className="text-xl font-bold" style={{ color: config.color }}>
            {config.label}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-1.5 w-32 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: config.color }}
                initial={{ width: 0 }}
                animate={{ width: `${data.score}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
            <span className="text-sm font-bold" style={{ color: config.color }}>
              {data.score}/100
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {data.reasoning}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#10b981' }}>
            Strengths
          </p>
          <ul className="space-y-1.5">
            {data.keyStrengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#10b981' }} />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#f43f5e' }}>
            Weaknesses
          </p>
          <ul className="space-y-1.5">
            {data.keyWeaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#f43f5e' }} />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
