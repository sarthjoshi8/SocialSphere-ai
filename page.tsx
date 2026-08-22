'use client';

import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Sparkles,
  Brain,
  Rocket,
  Compass,
  FileText,
  HelpCircle,
  Maximize2,
} from 'lucide-react';

import UploadZone from '@/components/UploadZone';
import LoadingOverlay from '@/components/LoadingOverlay';
import ExtractionDisplay from '@/components/ExtractionDisplay';
import AnalysisDashboard from '@/components/AnalysisDashboard';
import HistorySidebar from '@/components/HistorySidebar';

import {
  extractTextFromPDF,
  extractTextFromImage,
  buildExtractedContent,
  getFileType,
} from '@/lib/extractText';
import { analyzeContent } from '@/lib/analyzeContent';
import type { AppState, HistoryItem } from '@/lib/types';

import { exportMissionReportAsPNG } from '@/lib/exportReport';

// Dynamic lazy-loading for full-screen 3D Solar System Universe
const SolarSystemUniverse = dynamic(() => import('@/components/solar/SolarSystemUniverse'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 w-screen h-screen bg-[#030307] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs font-mono text-purple-300">INITIALIZING SOLAR SYSTEM UNIVERSE…</p>
      </div>
    </div>
  ),
});

const SolarHUD = dynamic(() => import('@/components/solar/SolarHUD'), { ssr: false });
const PlanetTelemetryCard = dynamic(() => import('@/components/solar/PlanetTelemetryCard'), { ssr: false });

const INITIAL_STATE: AppState = {
  status: 'idle',
  file: null,
  extracted: null,
  analysis: null,
  error: null,
  progress: 0,
  progressLabel: '',
};

const PLANET_IDS = ['sun', 'hook', 'tone', 'engagement', 'cta', 'platforms', 'hashtags', 'suggestions', 'rewrite'];

export default function Home() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'orrery' | 'bento'>('orrery');
  const [isExporting, setIsExporting] = useState(false);
  const bentoContainerRef = useRef<HTMLDivElement>(null);

  const updateState = useCallback((patch: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleFileAccepted = useCallback(
    async (file: File) => {
      setSelectedPlanetId(null);
      updateState({
        status: 'uploading',
        file,
        error: null,
        extracted: null,
        analysis: null,
        progress: 10,
        progressLabel: 'Initiating orbital telemetry & reading file…',
      });

      try {
        // ── Extract text ──────────────────────────────────────────────────────
        updateState({ status: 'extracting', progress: 25, progressLabel: 'Extracting content stream…' });

        const fileType = getFileType(file);
        let text: string;

        if (fileType === 'pdf') {
          text = await extractTextFromPDF(file, (p) => {
            updateState({
              progress: 25 + Math.round(p * 0.3),
              progressLabel: `Reading PDF telemetry data… ${p}%`,
            });
          });
        } else {
          text = await extractTextFromImage(file, (p) => {
            updateState({
              progress: 25 + Math.round(p * 0.3),
              progressLabel: `OCR quantum scanning image… ${p}%`,
            });
          });
        }

        const extracted = buildExtractedContent(text, file, fileType);
        updateState({ extracted, progress: 60, progressLabel: 'Content extracted! Launching Claude AI analysis…' });

        // ── Analyze ───────────────────────────────────────────────────────────
        updateState({ status: 'analyzing', progress: 70, progressLabel: 'Mapping scores to 3D Solar System coordinates…' });

        const progressInterval = setInterval(() => {
          setState((prev) => {
            if (prev.progress < 92) {
              return { ...prev, progress: prev.progress + 2 };
            }
            return prev;
          });
        }, 600);

        const analysis = await analyzeContent(text);
        clearInterval(progressInterval);

        // Save to localStorage history
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          fileName: file.name,
          originalText: text,
          analysis,
        };
        try {
          const existingStr = localStorage.getItem('socialsphere_history');
          const existing: HistoryItem[] = existingStr ? JSON.parse(existingStr) : [];
          localStorage.setItem('socialsphere_history', JSON.stringify([newHistoryItem, ...existing].slice(0, 20)));
        } catch (e) {
          console.error('Could not save history', e);
        }

        updateState({
          status: 'done',
          analysis,
          progress: 100,
          progressLabel: 'Solar System Analysis Complete!',
        });
        setSelectedPlanetId('sun'); // Auto focus on Sun initially
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected cosmic error occurred.';
        updateState({
          status: 'error',
          error: message,
          progress: 0,
          progressLabel: '',
        });
      }
    },
    [updateState]
  );

  const reset = () => {
    setState(INITIAL_STATE);
    setSelectedPlanetId(null);
    setViewMode('orrery');
  };

  const loadHistoryItem = useCallback((item: HistoryItem) => {
    const mockFile = new File([''], item.fileName);
    const extracted = buildExtractedContent(
      item.originalText,
      mockFile,
      item.fileName.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'
    );

    updateState({
      status: 'done',
      file: mockFile,
      extracted,
      analysis: item.analysis,
      error: null,
      progress: 100,
      progressLabel: 'Loaded from Mission Archive',
    });
    setSelectedPlanetId('sun');
  }, [updateState]);

  const handleNavigatePlanet = (direction: 'prev' | 'next') => {
    const currentIndex = selectedPlanetId ? PLANET_IDS.indexOf(selectedPlanetId) : 0;
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0) nextIndex = PLANET_IDS.length - 1;
    if (nextIndex >= PLANET_IDS.length) nextIndex = 0;
    setSelectedPlanetId(PLANET_IDS[nextIndex]);
  };

  const handleExportMission = () => {
    if (!state.analysis || !state.extracted) return;
    setIsExporting(true);
    try {
      exportMissionReportAsPNG(state.analysis, state.extracted.fileName);
    } catch (err) {
      console.error('Failed to export mission:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const isLoading = ['uploading', 'extracting', 'analyzing'].includes(state.status);

  return (
    <div id="solar-app-container" className="relative w-screen h-screen overflow-hidden select-none bg-[#030307]">
      {/* ── 1. Full-Screen 3D Solar System Canvas ─────────────────────────── */}
      <SolarSystemUniverse
        analysis={state.analysis}
        status={state.status}
        selectedPlanetId={selectedPlanetId}
        onSelectPlanet={setSelectedPlanetId}
      />

      {/* ── 2. Top Sci-Fi Cosmic HUD Header & Bottom Planetary Dock ───────── */}
      <SolarHUD
        status={state.status}
        analysis={state.analysis}
        selectedPlanetId={selectedPlanetId}
        viewMode={viewMode}
        onSelectPlanet={setSelectedPlanetId}
        onToggleViewMode={setViewMode}
        onReset={reset}
        onExport={handleExportMission}
        isExporting={isExporting}
      />

      {/* ── 3. Idle State: Translucent Floating Mission Terminal ───────────── */}
      <AnimatePresence>
        {(state.status === 'idle' || state.status === 'error') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94, y: -20 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-20 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-xl p-6 sm:p-8 rounded-3xl pointer-events-auto shadow-2xl space-y-6"
              style={{
                background: 'rgba(10, 10, 24, 0.72)',
                border: '1px solid rgba(139, 92, 246, 0.35)',
                backdropFilter: 'blur(28px)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(139, 92, 246, 0.2)',
              }}
            >
              {/* Header */}
              <div className="text-center space-y-3">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight font-mono">
                  Turn Content Into <span className="gradient-text">Conversations</span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Upload any PDF or image. Watch the 3D Solar System analyze your content’s impact, hooks, tone, platforms &amp; viral potential in real-time.
                </p>
              </div>

              {/* Upload Zone */}
              <UploadZone onFileAccepted={handleFileAccepted} disabled={isLoading} />

              {/* Error Display */}
              {state.error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl text-xs font-mono"
                  style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.4)' }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                  <div className="space-y-1">
                    <p className="font-bold text-rose-300">Cosmic Telemetry Error</p>
                    <p className="text-rose-200/80">{state.error}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 4. Loading / Warp Scanning State ──────────────────────────────── */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-30 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md p-6 rounded-3xl pointer-events-auto shadow-2xl"
              style={{
                background: 'rgba(8, 8, 20, 0.85)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                backdropFilter: 'blur(30px)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 50px rgba(6, 182, 212, 0.25)',
              }}
            >
              <LoadingOverlay
                status={state.status}
                progress={state.progress}
                progressLabel={state.progressLabel}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 5. Results Mode: Focused Planet Telemetry Card ─────────────────── */}
      {state.status === 'done' && state.analysis && state.extracted && viewMode === 'orrery' && (
        <>
          <PlanetTelemetryCard
            selectedPlanetId={selectedPlanetId}
            analysis={state.analysis}
            originalText={state.extracted.text}
            onClose={() => setSelectedPlanetId(null)}
            onNavigate={handleNavigatePlanet}
          />

          {/* Hint Overlay when no planet is currently open */}
          {!selectedPlanetId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
            >
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono text-cyan-200 shadow-xl"
                style={{
                  background: 'rgba(10, 10, 24, 0.85)',
                  borderColor: 'rgba(6, 182, 212, 0.4)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 0 25px rgba(6, 182, 212, 0.25)',
                }}
              >
                <Compass className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>Click any 3D Planet or the Sun to inspect detailed metrics</span>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* ── 6. Results Mode: Full Bento Command Grid Overlay ──────────────── */}
      <AnimatePresence>
        {state.status === 'done' && state.analysis && state.extracted && viewMode === 'bento' && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-30 pt-20 pb-24 px-4 sm:px-8 overflow-y-auto pointer-events-auto custom-scrollbar"
            style={{
              background: 'rgba(3, 3, 7, 0.85)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div ref={bentoContainerRef} className="max-w-7xl mx-auto space-y-8">
              {/* Mission Summary Banner */}
              <div
                className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(6,182,212,0.1) 100%)',
                  borderColor: 'rgba(139, 92, 246, 0.35)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white font-mono">Mission Telemetry Synchronized</h2>
                    <p className="text-xs text-slate-300 font-mono">
                      {state.extracted.fileName} · {state.extracted.wordCount} words · Impact Score:{' '}
                      <span className="text-emerald-400 font-bold">{state.analysis.impactScore.score}/100</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setViewMode('orrery')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-purple-200 bg-purple-600/30 border border-purple-400/40 hover:bg-purple-600/50 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Return to 3D Solar View</span>
                </button>
              </div>

              {/* Extracted content summary */}
              <ExtractionDisplay content={state.extracted} />

              {/* Full analysis dashboard */}
              <AnalysisDashboard analysis={state.analysis} originalText={state.extracted.text} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 7. Floating Mission Archive History Drawer ────────────────────── */}
      <HistorySidebar onLoadHistory={loadHistoryItem} />
    </div>
  );
}
