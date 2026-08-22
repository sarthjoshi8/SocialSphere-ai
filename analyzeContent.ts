import type { AnalysisResult } from './types';

/**
 * Calls the /api/analyze route to get AI-powered content analysis.
 */
export async function analyzeContent(text: string): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    let errorMsg = `Analysis failed (HTTP ${response.status})`;
    try {
      const body = await response.json();
      if (body.error) errorMsg = body.error;
    } catch {
      // ignore JSON parse error
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  return data as AnalysisResult;
}
