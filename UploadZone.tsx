'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { validateFile, SUPPORTED_TYPES, MAX_FILE_SIZE_MB } from '@/lib/extractText';

interface UploadZoneProps {
  onFileAccepted: (file: File) => void;
  disabled?: boolean;
}

export default function UploadZone({ onFileAccepted, disabled }: UploadZoneProps) {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setValidationError(null);
      const result = validateFile(file);
      if (!result.valid) {
        setValidationError(result.error ?? 'Invalid file.');
        return;
      }
      setSelectedFile(file);
      onFileAccepted(file);
    },
    [onFileAccepted]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        setValidationError(rejectedFiles[0]?.errors[0]?.message ?? 'Invalid file.');
        return;
      }
      if (acceptedFiles[0]) handleFile(acceptedFiles[0]);
    },
    [handleFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
  });

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setValidationError(null);
  };

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={`upload-zone relative flex flex-col items-center justify-center gap-6 px-8 py-16 transition-all ${
          isDragActive ? 'drag-active' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} id="file-upload-input" />

        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden rounded-[18px] pointer-events-none">
          <div
            className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)' }}
          />
        </div>

        <AnimatePresence mode="wait">
          {isDragActive ? (
            <motion.div
              key="dragging"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}
              >
                <UploadCloud className="w-10 h-10 text-white" />
              </div>
              <p className="text-xl font-semibold gradient-text">Drop it here!</p>
            </motion.div>
          ) : selectedFile ? (
            <motion.div
              key="selected"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center glow-purple"
                  style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)' }}
                >
                  {selectedFile.type === 'application/pdf' ? (
                    <FileText className="w-10 h-10" style={{ color: '#8b5cf6' }} />
                  ) : (
                    <ImageIcon className="w-10 h-10" style={{ color: '#06b6d4' }} />
                  )}
                </div>
                <button
                  onClick={clearFile}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-400 transition-colors"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
              <div>
                <p className="font-semibold text-white">{selectedFile.name}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  {(selectedFile.size / 1024).toFixed(0)} KB ·{' '}
                  {selectedFile.type === 'application/pdf' ? 'PDF' : 'Image'}
                </p>
              </div>
              <p style={{ color: 'var(--accent-emerald)', fontSize: '14px' }} className="font-medium">
                ✓ Ready to analyze
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-5 text-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.1))',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                <UploadCloud className="w-10 h-10" style={{ color: '#8b5cf6' }} />
              </motion.div>

              <div className="space-y-2">
                <p className="text-xl font-semibold text-white">
                  Drop your file here
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                  or{' '}
                  <span className="gradient-text font-semibold cursor-pointer">browse to upload</span>
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap justify-center">
                {[
                  { icon: FileText, label: 'PDF', color: '#8b5cf6' },
                  { icon: ImageIcon, label: 'JPG / PNG', color: '#06b6d4' },
                  { icon: ImageIcon, label: 'WebP', color: '#ec4899' },
                ].map(({ icon: Icon, label, color }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: `${color}14`,
                      border: `1px solid ${color}30`,
                      color,
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </div>
                ))}
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Max {MAX_FILE_SIZE_MB} MB · Blog posts, articles, screenshots
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Validation Error */}
      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
            }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f43f5e' }} />
            <p style={{ color: '#fda4af', fontSize: '14px' }}>{validationError}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
