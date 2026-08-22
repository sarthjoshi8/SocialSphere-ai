'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';
import { exportMissionReportAsPNG } from '@/lib/exportReport';
import ImpactScoreCard from './cards/ImpactScoreCard';
import HookAnalysisCard from './cards/HookAnalysisCard';
import CTADetectionCard from './cards/CTADetectionCard';
import HashtagCard from './cards/HashtagCard';
import ToneCard from './cards/ToneCard';
import PlatformCard from './cards/PlatformCard';
import EngagementCard from './cards/EngagementCard';
import SuggestionsCard from './cards/SuggestionsCard';
import BeforeAfterCard from './cards/BeforeAfterCard';
import type { AnalysisResult } from '@/lib/types';

interface AnalysisDashboardProps {
  analysis: AnalysisResult;
  originalText: string;
}

export default function AnalysisDashboard({ analysis, originalText }: AnalysisDashboardProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    try {
      exportMissionReportAsPNG(analysis, 'SocialSphere-Mission');
    } catch (err) {
      console.error('Failed to export dashboard:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Section label and Export */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span
            className="text-xs font-medium uppercase tracking-widest px-4 font-mono"
            style={{ color: 'var(--text-muted)' }}
          >
            Mission Intelligence Telemetry
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>
        
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="ignore-export flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium font-mono transition-colors"
          style={{ 
            background: 'rgba(139,92,246,0.1)', 
            color: '#c4b5fd',
            border: '1px solid rgba(139,92,246,0.3)'
          }}
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {isExporting ? 'Exporting...' : 'Export Image'}
        </button>
      </div>

      <div className="space-y-6 p-2 -m-2 rounded-xl">
        {/* Row 1: Impact Score Card (Full Width) */}
        <ImpactScoreCard data={analysis.impactScore} />

        {/* Row 2: Hook + CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HookAnalysisCard data={analysis.hookAnalysis} />
          <CTADetectionCard data={analysis.ctaDetection} />
        </div>

        {/* Row 3: Hashtag + Tone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HashtagCard data={analysis.hashtagIntelligence} />
          <ToneCard data={analysis.toneDetection} />
        </div>

        {/* Row 4: Platform (full width) */}
        <PlatformCard data={analysis.platformAnalysis} />

        {/* Row 5: Engagement */}
        <EngagementCard data={analysis.engagementPotential} />

        {/* Row 6: Suggestions */}
        <SuggestionsCard data={analysis.improvementSuggestions} />

        {/* Row 7: Before/After (full width) */}
        <BeforeAfterCard originalText={originalText} data={analysis.improvedVersion} />
      </div>
    </motion.div>
  );
}
