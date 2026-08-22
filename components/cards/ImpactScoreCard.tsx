'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';

interface ImpactScoreCardProps {
  data: AnalysisResult['impactScore'];
}

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f97316' : '#f43f5e';

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* Background ring */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="8"
      />
      {/* Score ring */}
      <motion.circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        filter={`drop-shadow(0 0 6px ${color}80)`}
      />
      {/* Score text */}
      <text
        x="50"
        y="46"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="20"
        fontWeight="700"
        fontFamily="Inter, sans-serif"
      >
        {score}
      </text>
      <text
        x="50"
        y="63"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="rgba(255,255,255,0.4)"
        fontSize="9"
        fontFamily="Inter, sans-serif"
      >
        /100
      </text>
    </svg>
  );
}

function SubScoreBar({ label, value }: { label: string; value: number }) {
  const color =
    value >= 80 ? '#10b981' : value >= 60 ? '#f59e0b' : value >= 40 ? '#f97316' : '#f43f5e';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ color }} className="font-semibold">{value}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        />
      </div>
    </div>
  );
}

export default function ImpactScoreCard({ data }: ImpactScoreCardProps) {
  const gradeColor =
    data.score >= 80 ? '#10b981' : data.score >= 60 ? '#f59e0b' : data.score >= 40 ? '#f97316' : '#f43f5e';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}
        >
          <Zap className="w-4 h-4" style={{ color: '#a78bfa' }} />
        </div>
        <h3 className="font-semibold text-white">Content Impact Score</h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* Ring */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0">
          <ScoreRing score={data.score} size={130} />
          <div
            className="text-3xl font-black"
            style={{ color: gradeColor }}
          >
            {data.grade}
          </div>
        </div>

        {/* Sub-scores + summary */}
        <div className="flex-1 space-y-4 w-full">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {data.summary}
          </p>
          <div className="space-y-3">
            {Object.entries(data.subScores).map(([key, val]) => (
              <SubScoreBar
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={val}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
