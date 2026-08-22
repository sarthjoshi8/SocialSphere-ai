'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, Clock, Trash2 } from 'lucide-react';
import type { HistoryItem, AnalysisResult, ExtractedContent } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface HistorySidebarProps {
  onLoadHistory: (item: HistoryItem) => void;
}

export default function HistorySidebar({ onLoadHistory }: HistorySidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('socialsphere_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, [isOpen]); // Reload when opened just in case

  const clearHistory = () => {
    localStorage.removeItem('socialsphere_history');
    setHistory([]);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl transition-transform hover:scale-110"
        style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', color: 'white' }}
        title="Recent Analyses"
      >
        <History className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm z-50 flex flex-col shadow-2xl"
              style={{ background: 'var(--bg-primary)', borderLeft: '1px solid var(--border-subtle)' }}
            >
              <div className="p-6 flex items-center justify-between border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" style={{ color: '#06b6d4' }} />
                  Recent Analyses
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {history.length === 0 ? (
                  <div className="text-center mt-12 space-y-3">
                    <History className="w-10 h-10 mx-auto opacity-20" style={{ color: 'var(--text-muted)' }} />
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No history found.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onLoadHistory(item);
                        setIsOpen(false);
                      }}
                      className="p-4 rounded-xl cursor-pointer transition-colors group"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                          Score: {item.analysis.impactScore.score}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-white truncate mb-1">
                        {item.fileName}
                      </p>
                      <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                        {item.originalText}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {history.length > 0 && (
                <div className="p-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <button
                    onClick={clearHistory}
                    className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e' }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear History
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
