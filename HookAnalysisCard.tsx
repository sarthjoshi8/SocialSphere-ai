'use client';

import { motion } from 'framer-motion';
import { Anchor, Star } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';

interface HookAnalysisCardProps {
  data: AnalysisResult['hookAnalysis'];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 * i, duration: 0.3 }}
        >
          <Star
            className="w-3.5 h-3.5"
            fill={i < rating ? '#f59e0b' : 'transparent'}
            style={{ color: i < rating ? '#f59e0b' : 'rgba(255,255,255,0.15)' }}
          />
        </motion.div>
      ))}
      <span className="ml-2 text-sm font-semibold" style={{ color: '#f59e0b' }}>
        {rating}/10
      </span>
    </div>
  );
}

export default function HookAnalysisCard({ data }: HookAnalysisCardProps) {
  const verdictColor =
    data.rating >= 8 ? '#10b981' : data.rating >= 6 ? '#f59e0b' : data.rating >= 4 ? '#f97316' : '#f43f5e';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card p-6 space-y-5"
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)' }}
        >
          <Anchor className="w-4 h-4" style={{ color: '#f59e0b' }} />
        </div>
        <h3 className="font-semibold text-white">Hook Analysis</h3>
        <span
          className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: `${verdictColor}20`,
            border: `1px solid ${verdictColor}40`,
            color: verdictColor,
          }}
        >
          {data.verdict}
        </span>
      </div>

      {/* Rating */}
      <StarRating rating={data.rating} />

      {/* Opening line */}
      <div
        className="p-4 rounded-xl"
        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)' }}
      >
        <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
          Opening Line
        </p>
        <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
          &ldquo;{data.openingLine}&rdquo;
        </p>
      </div>

      {/* Explanation */}
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {data.explanation}
      </p>

      {/* Improved hook */}
      <div
        className="p-4 rounded-xl space-y-2"
        style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}
      >
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#10b981' }}>
          ✦ Improved Hook
        </p>
        <p className="text-sm leading-relaxed" style={{ color: '#a7f3d0' }}>
          &ldquo;{data.improvedHook}&rdquo;
        </p>
      </div>
    </motion.div>
  );
}
