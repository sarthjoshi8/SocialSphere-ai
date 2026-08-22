'use client';

import { motion } from 'framer-motion';
import { MousePointerClick, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';

interface CTADetectionCardProps {
  data: AnalysisResult['ctaDetection'];
}

const STRENGTH_CONFIG = {
  strong: { color: '#10b981', icon: CheckCircle, label: 'Strong CTA' },
  moderate: { color: '#f59e0b', icon: AlertTriangle, label: 'Moderate CTA' },
  weak: { color: '#f97316', icon: AlertTriangle, label: 'Weak CTA' },
  missing: { color: '#f43f5e', icon: XCircle, label: 'No CTA Found' },
};

export default function CTADetectionCard({ data }: CTADetectionCardProps) {
  const config = STRENGTH_CONFIG[data.ctaStrength];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="glass-card p-6 space-y-5"
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(236,72,153,0.2)', border: '1px solid rgba(236,72,153,0.3)' }}
        >
          <MousePointerClick className="w-4 h-4" style={{ color: '#ec4899' }} />
        </div>
        <h3 className="font-semibold text-white">CTA Detection</h3>
      </div>

      {/* CTA status badge */}
      <div
        className="flex items-center gap-3 p-4 rounded-xl"
        style={{
          background: `${config.color}10`,
          border: `1px solid ${config.color}30`,
        }}
      >
        <Icon className="w-6 h-6 flex-shrink-0" style={{ color: config.color }} />
        <div>
          <p className="font-semibold text-sm" style={{ color: config.color }}>
            {config.label}
          </p>
          {data.detectedCTA && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Found: &ldquo;{data.detectedCTA}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Explanation */}
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {data.explanation}
      </p>

      {/* Suggested CTA */}
      <div
        className="p-4 rounded-xl space-y-2"
        style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}
      >
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#a78bfa' }}>
          ✦ Suggested CTA
        </p>
        <p className="text-sm font-medium" style={{ color: '#ddd6fe' }}>
          &ldquo;{data.suggestedCTA}&rdquo;
        </p>
      </div>
    </motion.div>
  );
}
