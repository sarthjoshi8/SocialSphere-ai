'use client';

import { motion } from 'framer-motion';
import { FileText, Image as ImageIcon, Hash, AlignLeft } from 'lucide-react';
import type { ExtractedContent } from '@/lib/types';

interface ExtractionDisplayProps {
  content: ExtractedContent;
}

export default function ExtractionDisplay({ content }: ExtractionDisplayProps) {
  const isImage = content.fileType === 'image';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: isImage ? 'rgba(6,182,212,0.15)' : 'rgba(139,92,246,0.15)',
              border: `1px solid ${isImage ? 'rgba(6,182,212,0.3)' : 'rgba(139,92,246,0.3)'}`,
            }}
          >
            {isImage ? (
              <ImageIcon className="w-5 h-5" style={{ color: '#06b6d4' }} />
            ) : (
              <FileText className="w-5 h-5" style={{ color: '#8b5cf6' }} />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{content.fileName}</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {isImage ? 'OCR Extracted' : 'PDF Extracted'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <StatBadge icon={AlignLeft} label="Words" value={content.wordCount.toLocaleString()} />
          <StatBadge icon={Hash} label="Chars" value={content.charCount.toLocaleString()} />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

      {/* Extracted text */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
          Extracted Text
        </p>
        <div
          className="rounded-xl p-4 max-h-48 overflow-y-auto text-sm leading-relaxed"
          style={{
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {content.text}
        </div>
      </div>
    </motion.div>
  );
}

function StatBadge({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)' }}
    >
      <Icon className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
      <span style={{ color: 'var(--text-muted)' }}>{label}:</span>
      <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
        {value}
      </span>
    </div>
  );
}
