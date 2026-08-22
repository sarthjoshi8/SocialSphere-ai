'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, FileSearch, Sparkles, Zap } from 'lucide-react';

type Step = 'upload' | 'extract' | 'analyze' | 'done';

interface LoadingOverlayProps {
  status: string;
  progress: number;
  progressLabel: string;
}

const STEPS: { key: Step; label: string; icon: any; description: string }[] = [
  { key: 'upload', label: 'Upload', icon: Zap, description: 'Reading your file' },
  { key: 'extract', label: 'Extract', icon: FileSearch, description: 'Extracting text content' },
  { key: 'analyze', label: 'Analyze', icon: Sparkles, description: 'Running AI analysis' },
  { key: 'done', label: 'Done', icon: CheckCircle2, description: 'Results ready' },
];

function getActiveStep(status: string): Step {
  if (status === 'uploading') return 'upload';
  if (status === 'extracting') return 'extract';
  if (status === 'analyzing') return 'analyze';
  if (status === 'done') return 'done';
  return 'upload';
}

export default function LoadingOverlay({ status, progress, progressLabel }: LoadingOverlayProps) {
  const activeStep = getActiveStep(status);
  const activeIdx = STEPS.findIndex((s) => s.key === activeStep);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-8 space-y-8"
    >
      {/* Step indicators */}
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div
          className="absolute top-5 left-5 right-5 h-px"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        />
        <div
          className="absolute top-5 left-5 h-px transition-all duration-700"
          style={{
            background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
            width: `${(activeIdx / (STEPS.length - 1)) * 90}%`,
          }}
        />

        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < activeIdx;
          const isActive = idx === activeIdx;

          return (
            <div key={step.key} className="relative flex flex-col items-center gap-2 z-10">
              <motion.div
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
                style={{
                  background: isCompleted
                    ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)'
                    : isActive
                    ? 'rgba(139, 92, 246, 0.3)'
                    : 'rgba(255,255,255,0.05)',
                  border: isActive
                    ? '2px solid #8b5cf6'
                    : isCompleted
                    ? '2px solid transparent'
                    : '2px solid rgba(255,255,255,0.1)',
                  boxShadow: isActive ? '0 0 20px rgba(139, 92, 246, 0.4)' : 'none',
                }}
              >
                {isActive && status !== 'done' ? (
                  <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#a78bfa' }} />
                ) : (
                  <Icon
                    className="w-4 h-4"
                    style={{ color: isCompleted || isActive ? 'white' : 'var(--text-muted)' }}
                  />
                )}
              </motion.div>
              <span
                className="text-xs font-medium whitespace-nowrap hidden sm:block"
                style={{ color: isActive ? '#a78bfa' : isCompleted ? 'var(--text-secondary)' : 'var(--text-muted)' }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            <motion.p
              key={progressLabel}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              {progressLabel || 'Processing…'}
            </motion.p>
          </AnimatePresence>
          <span className="text-sm font-semibold gradient-text">{progress}%</span>
        </div>

        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Active step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.15)' }}
        >
          <div
            className="w-2 h-2 rounded-full animate-pulse-glow"
            style={{ background: '#8b5cf6' }}
          />
          <p className="text-sm" style={{ color: '#c4b5fd' }}>
            {STEPS[activeIdx]?.description ?? 'Processing…'}
          </p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
