'use client';

import { motion } from 'framer-motion';
import { Smile } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';

interface ToneCardProps {
  data: AnalysisResult['toneDetection'];
}

const TONE_COLORS: Record<string, string> = {
  Professional: '#06b6d4',
  Casual: '#10b981',
  Inspirational: '#f59e0b',
  Educational: '#8b5cf6',
  Humorous: '#ec4899',
  Urgent: '#f43f5e',
  Empathetic: '#a78bfa',
  Formal: '#0ea5e9',
  Conversational: '#34d399',
};

function getToneColor(tone: string): string {
  for (const [key, color] of Object.entries(TONE_COLORS)) {
    if (tone.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return '#8b5cf6';
}

export default function ToneCard({ data }: ToneCardProps) {
  const primaryColor = getToneColor(data.primaryTone);
  const entries = Object.entries(data.toneBreakdown).sort(([, a], [, b]) => b - a);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="glass-card p-6 space-y-5"
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${primaryColor}25`, border: `1px solid ${primaryColor}40` }}
        >
          <Smile className="w-4 h-4" style={{ color: primaryColor }} />
        </div>
        <h3 className="font-semibold text-white">Tone Detection</h3>
      </div>

      {/* Primary + Secondary tones */}
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ background: `${primaryColor}20`, border: `1px solid ${primaryColor}40`, color: primaryColor }}
        >
          {data.primaryTone}
        </span>
        {data.secondaryTone && (
          <>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>+</span>
            <span
              className="px-3 py-1.5 rounded-xl text-sm"
              style={{
                background: `${getToneColor(data.secondaryTone)}15`,
                border: `1px solid ${getToneColor(data.secondaryTone)}30`,
                color: getToneColor(data.secondaryTone),
              }}
            >
              {data.secondaryTone}
            </span>
          </>
        )}
      </div>

      {/* Tone breakdown bars */}
      <div className="space-y-3">
        {entries.map(([tone, pct]) => {
          const color = getToneColor(tone);
          return (
            <div key={tone} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>{tone}</span>
                <span style={{ color }} className="font-semibold">
                  {pct}%
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Audience fit */}
      <div
        className="p-3 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}
      >
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Audience Fit: </span>
          {data.audienceFit}
        </p>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {data.explanation}
      </p>
    </motion.div>
  );
}
