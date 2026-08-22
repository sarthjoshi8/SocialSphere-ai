'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Compass, Sparkles, Orbit } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';

import ImpactScoreCard from '../cards/ImpactScoreCard';
import HookAnalysisCard from '../cards/HookAnalysisCard';
import CTADetectionCard from '../cards/CTADetectionCard';
import HashtagCard from '../cards/HashtagCard';
import ToneCard from '../cards/ToneCard';
import PlatformCard from '../cards/PlatformCard';
import EngagementCard from '../cards/EngagementCard';
import SuggestionsCard from '../cards/SuggestionsCard';
import BeforeAfterCard from '../cards/BeforeAfterCard';

interface PlanetTelemetryCardProps {
  selectedPlanetId: string | null;
  analysis: AnalysisResult;
  originalText: string;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

const PLANET_ORDER = [
  { id: 'sun', name: 'Impact Sun', category: 'Core Score' },
  { id: 'hook', name: 'Hook Horizon', category: 'Hook Analysis' },
  { id: 'tone', name: 'Tone Atmosphere', category: 'Tone & Persona' },
  { id: 'engagement', name: 'Engagement World', category: 'Audience Dynamics' },
  { id: 'cta', name: 'CTA Flare', category: 'Conversion Trigger' },
  { id: 'platforms', name: 'Platform Giant', category: 'Multi-Channel Strategy' },
  { id: 'hashtags', name: 'Hashtag Saturn', category: 'Discovery Engine' },
  { id: 'suggestions', name: 'Improvement Outpost', category: 'Actionable Insights' },
  { id: 'rewrite', name: 'AI Rewrite Station', category: 'Copy Optimization' },
];

export default function PlanetTelemetryCard({
  selectedPlanetId,
  analysis,
  originalText,
  onClose,
  onNavigate,
}: PlanetTelemetryCardProps) {
  if (!selectedPlanetId) return null;

  const currentPlanet = PLANET_ORDER.find((p) => p.id === selectedPlanetId) || PLANET_ORDER[0];
  const currentIndex = PLANET_ORDER.findIndex((p) => p.id === selectedPlanetId);

  const renderModuleContent = () => {
    switch (selectedPlanetId) {
      case 'sun':
        return <ImpactScoreCard data={analysis.impactScore} />;
      case 'hook':
        return <HookAnalysisCard data={analysis.hookAnalysis} />;
      case 'tone':
        return <ToneCard data={analysis.toneDetection} />;
      case 'engagement':
        return <EngagementCard data={analysis.engagementPotential} />;
      case 'cta':
        return <CTADetectionCard data={analysis.ctaDetection} />;
      case 'platforms':
        return <PlatformCard data={analysis.platformAnalysis} />;
      case 'hashtags':
        return <HashtagCard data={analysis.hashtagIntelligence} />;
      case 'suggestions':
        return <SuggestionsCard data={analysis.improvementSuggestions} />;
      case 'rewrite':
        return <BeforeAfterCard originalText={originalText} data={analysis.improvedVersion} />;
      default:
        return <ImpactScoreCard data={analysis.impactScore} />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 260 }}
        className="fixed bottom-24 right-4 md:right-8 z-30 w-[calc(100vw-2rem)] sm:w-[540px] md:w-[620px] max-h-[75vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
        style={{
          background: 'rgba(8, 8, 18, 0.88)',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          backdropFilter: 'blur(28px)',
          boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(139, 92, 246, 0.2)',
        }}
      >
        {/* Holographic Cockpit Header */}
        <div
          className="p-4 px-5 flex items-center justify-between border-b"
          style={{ borderColor: 'rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)' }}
            >
              <Orbit className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-purple-300">
                  {currentPlanet.category}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/40">
                  ORBIT #{currentIndex + 1}/9
                </span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">{currentPlanet.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onNavigate('prev')}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Previous Planet"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('next')}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Next Planet"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-white/10 mx-1" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
              title="Close Telemetry"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Telemetry Module */}
        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar space-y-4">
          {renderModuleContent()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
