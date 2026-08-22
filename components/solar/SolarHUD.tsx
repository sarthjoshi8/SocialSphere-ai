'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  RotateCcw,
  Download,
  Orbit,
  LayoutGrid,
  Loader2,
  Share2,
  Radio,
  FileText,
} from 'lucide-react';
import type { AnalysisResult, ExtractionStatus } from '@/lib/types';

interface SolarHUDProps {
  status: ExtractionStatus;
  analysis: AnalysisResult | null;
  selectedPlanetId: string | null;
  viewMode: 'orrery' | 'bento';
  onSelectPlanet: (id: string | null) => void;
  onToggleViewMode: (mode: 'orrery' | 'bento') => void;
  onReset: () => void;
  onExport: () => void;
  isExporting: boolean;
}

const BODIES = [
  { id: 'sun', icon: '☀️', label: 'Sun', keyMetric: (a: AnalysisResult) => `${a.impactScore.score} pts` },
  { id: 'hook', icon: '🪝', label: 'Hook', keyMetric: (a: AnalysisResult) => `${a.hookAnalysis.rating}/10` },
  { id: 'tone', icon: '🎭', label: 'Tone', keyMetric: (a: AnalysisResult) => a.toneDetection.primaryTone },
  { id: 'engagement', icon: '📈', label: 'Engage', keyMetric: (a: AnalysisResult) => a.engagementPotential.level.toUpperCase() },
  { id: 'cta', icon: '📣', label: 'CTA', keyMetric: (a: AnalysisResult) => a.ctaDetection.ctaStrength.toUpperCase() },
  { id: 'platforms', icon: '📱', label: 'Platforms', keyMetric: () => '3 Channels' },
  { id: 'hashtags', icon: '#️⃣', label: 'Tags', keyMetric: (a: AnalysisResult) => `${a.hashtagIntelligence.suggested.length} tags` },
  { id: 'suggestions', icon: '💡', label: 'Tips', keyMetric: (a: AnalysisResult) => `${a.improvementSuggestions.length} tips` },
  { id: 'rewrite', icon: '✨', label: 'Rewrite', keyMetric: () => 'Diff Ready' },
];

export default function SolarHUD({
  status,
  analysis,
  selectedPlanetId,
  viewMode,
  onSelectPlanet,
  onToggleViewMode,
  onReset,
  onExport,
  isExporting,
}: SolarHUDProps) {
  const isDone = status === 'done' && !!analysis;

  return (
    <>
      {/* ── Top Sci-Fi Cosmic HUD Header ───────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-40 h-16 px-4 sm:px-8 flex items-center justify-between pointer-events-auto"
        style={{
          background: 'linear-gradient(180deg, rgba(5,5,10,0.9) 0%, rgba(5,5,10,0.4) 70%, transparent 100%)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Brand & Telemetry Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectPlanet(null)}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight font-mono">SocialSphere</span>
                <span className="gradient-text font-extrabold text-base tracking-tight font-mono">AI</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-semibold">SOLAR SYSTEM v2.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {isDone && (
            <>
              {/* View Switcher: 3D Orrery vs Bento Grid */}
              <div
                className="flex items-center rounded-xl p-0.5 border"
                style={{
                  background: 'rgba(15, 15, 28, 0.7)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <button
                  onClick={() => onToggleViewMode('orrery')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                    viewMode === 'orrery'
                      ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Orbit className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">3D Orrery</span>
                </button>
                <button
                  onClick={() => onToggleViewMode('bento')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                    viewMode === 'bento'
                      ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Command Bento</span>
                </button>
              </div>

              {/* Export Button */}
              <button
                onClick={onExport}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono border transition-all hover:scale-105"
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  borderColor: 'rgba(16, 185, 129, 0.35)',
                  color: '#6ee7b7',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)',
                }}
              >
                {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export Mission'}</span>
              </button>

              {/* Reset / New Analysis */}
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-mono border transition-all text-slate-300 hover:text-white hover:bg-white/10"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Upload</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── Bottom Orbital Planetary Navigation Dock ──────────────────────── */}
      {isDone && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-[95vw] pointer-events-auto"
        >
          <div
            className="flex items-center gap-1.5 p-2 px-3 rounded-2xl border shadow-2xl overflow-x-auto max-w-full custom-scrollbar"
            style={{
              background: 'rgba(10, 10, 22, 0.82)',
              borderColor: 'rgba(139, 92, 246, 0.3)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(139, 92, 246, 0.15)',
            }}
          >
            {/* Overview reset button */}
            <button
              onClick={() => onSelectPlanet(null)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                selectedPlanetId === null
                  ? 'bg-purple-600/40 text-white border border-purple-400/50 shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Orbit className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-semibold">Overview</span>
            </button>

            <div className="w-[1px] h-5 bg-white/10 mx-1 flex-shrink-0" />

            {/* Planetary Selector Badges */}
            {BODIES.map((body) => {
              const isSelected = selectedPlanetId === body.id;
              const metric = analysis ? body.keyMetric(analysis) : '';

              return (
                <button
                  key={body.id}
                  onClick={() => onSelectPlanet(body.id)}
                  className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap flex-shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-900/60 to-cyan-900/60 text-white border border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.35)] scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="text-sm">{body.icon}</span>
                  <div className="text-left">
                    <div className="font-bold text-[11px] leading-none text-slate-200 group-hover:text-white">
                      {body.label}
                    </div>
                    {metric && (
                      <div className="text-[9px] text-cyan-400 font-mono leading-tight mt-0.5">
                        {metric}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </>
  );
}
