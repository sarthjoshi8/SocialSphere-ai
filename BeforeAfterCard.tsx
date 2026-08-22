'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, ArrowLeftRight, Copy, Check, SplitSquareHorizontal } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';
import DiffMatchPatch from 'diff-match-patch';

interface BeforeAfterCardProps {
  originalText: string;
  data: AnalysisResult['improvedVersion'];
}

export default function BeforeAfterCard({ originalText, data }: BeforeAfterCardProps) {
  const [view, setView] = useState<'side-by-side' | 'diff' | 'after'>('side-by-side');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.rewrittenText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const diffElements = useMemo(() => {
    const dmp = new DiffMatchPatch();
    const diffs = dmp.diff_main(originalText, data.rewrittenText);
    dmp.diff_cleanupSemantic(diffs);
    
    return diffs.map((diff, index) => {
      const [op, text] = diff;
      if (op === 1) { // Insertion
        return <span key={index} style={{ background: 'rgba(16,185,129,0.2)', color: '#6ee7b7', padding: '0 4px', borderRadius: '4px' }}>{text}</span>;
      } else if (op === -1) { // Deletion
        return <span key={index} style={{ background: 'rgba(244,63,94,0.2)', color: '#fda4af', textDecoration: 'line-through', padding: '0 4px', borderRadius: '4px' }}>{text}</span>;
      }
      return <span key={index}>{text}</span>; // Equal
    });
  }, [originalText, data.rewrittenText]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="glass-card p-6 space-y-5 col-span-full"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.3)' }}
          >
            <GitCompare className="w-4 h-4" style={{ color: '#06b6d4' }} />
          </div>
          <h3 className="font-semibold text-white">Before vs After</h3>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{ 
              background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(139,92,246,0.1)', 
              color: copied ? '#10b981' : '#c4b5fd',
              border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(139,92,246,0.3)'}`
            }}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Improved'}
          </button>

          <div
            className="flex rounded-xl overflow-hidden"
            style={{ border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.3)' }}
          >
            {(['side-by-side', 'diff', 'after'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`toggle-btn flex items-center gap-1.5 ${view === v ? 'active' : ''}`}
              >
                {v === 'side-by-side' && <SplitSquareHorizontal className="w-3 h-3" />}
                {v === 'diff' && <GitCompare className="w-3 h-3" />}
                {v === 'side-by-side' ? 'Split' : v === 'diff' ? 'Diff Highlight' : 'Final Only'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {data.improvementSummary}
      </p>

      {/* Changes list */}
      <div className="flex flex-wrap gap-2">
        {data.changesHighlighted.map((change, i) => (
          <span
            key={i}
            className="text-xs px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(6,182,212,0.1)',
              border: '1px solid rgba(6,182,212,0.25)',
              color: '#67e8f9',
            }}
          >
            ✓ {change}
          </span>
        ))}
      </div>

      {/* Text panels */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          {view === 'side-by-side' && (
            <motion.div
              key="split"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <TextPanel label="Original" text={originalText} color="#f43f5e" />
              <TextPanel label="Improved" text={data.rewrittenText} color="#10b981" />
            </motion.div>
          )}

          {view === 'diff' && (
            <motion.div
              key="diff"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#06b6d4' }} />
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#06b6d4' }}>
                    Visual Diff
                  </span>
                </div>
                <div
                  className="p-4 rounded-xl text-sm leading-relaxed overflow-y-auto"
                  style={{
                    background: `rgba(6,182,212,0.05)`,
                    border: `1px solid rgba(6,182,212,0.2)`,
                    color: 'var(--text-secondary)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {diffElements}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'after' && (
            <motion.div
              key="after"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <TextPanel label="Improved" text={data.rewrittenText} color="#10b981" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function TextPanel({ label, text, color }: { label: string; text: string; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color }}>
          {label}
        </span>
      </div>
      <div
        className="p-4 rounded-xl text-sm leading-relaxed overflow-y-auto"
        style={{
          background: `${color}08`,
          border: `1px solid ${color}20`,
          color: 'var(--text-secondary)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {text}
      </div>
    </div>
  );
}
