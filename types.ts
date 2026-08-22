// TypeScript types for the SocialSphere AI analysis pipeline

export type FileType = 'pdf' | 'image';

export type ExtractionStatus = 'idle' | 'uploading' | 'extracting' | 'analyzing' | 'done' | 'error';

export interface ExtractedContent {
  text: string;
  fileType: FileType;
  fileName: string;
  charCount: number;
  wordCount: number;
}

export interface PlatformAnalysis {
  platform: 'LinkedIn' | 'X (Twitter)' | 'Instagram';
  score: number; // 0-100
  feedback: string;
  suggestions: string[];
  characterCount?: number;
  estimatedReach?: string;
}

export interface AnalysisResult {
  // Overall score
  impactScore: {
    score: number; // 0-100
    grade: string; // A+, A, B, C, D, F
    summary: string;
    subScores: {
      hook: number;
      clarity: number;
      engagement: number;
      cta: number;
      tone: number;
    };
  };

  // Hook analysis
  hookAnalysis: {
    openingLine: string;
    rating: number; // 0-10
    verdict: string; // e.g. "Strong Hook", "Needs Work"
    explanation: string;
    improvedHook: string;
  };

  // CTA detection
  ctaDetection: {
    hasCTA: boolean;
    detectedCTA: string | null;
    ctaStrength: 'strong' | 'moderate' | 'weak' | 'missing';
    explanation: string;
    suggestedCTA: string;
  };

  // Hashtag intelligence
  hashtagIntelligence: {
    suggested: string[];
    niche: string[];
    trending: string[];
    explanation: string;
  };

  // Tone detection
  toneDetection: {
    primaryTone: string;
    secondaryTone: string | null;
    toneBreakdown: Record<string, number>; // tone -> percentage
    audienceFit: string;
    explanation: string;
  };

  // Platform-specific analysis
  platformAnalysis: PlatformAnalysis[];

  // Engagement potential
  engagementPotential: {
    level: 'low' | 'medium' | 'high' | 'viral';
    score: number; // 0-100
    reasoning: string;
    keyStrengths: string[];
    keyWeaknesses: string[];
  };

  // Content improvement suggestions
  improvementSuggestions: {
    priority: 'high' | 'medium' | 'low';
    category: string;
    suggestion: string;
    example?: string;
  }[];

  // Before vs after
  improvedVersion: {
    rewrittenText: string;
    changesHighlighted: string[];
    improvementSummary: string;
  };
}

export interface AppState {
  status: ExtractionStatus;
  file: File | null;
  extracted: ExtractedContent | null;
  analysis: AnalysisResult | null;
  error: string | null;
  progress: number; // 0-100
  progressLabel: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  fileName: string;
  originalText: string;
  analysis: AnalysisResult;
}
