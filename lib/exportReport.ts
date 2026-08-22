import type { AnalysisResult } from './types';

export function exportMissionReportAsPNG(analysis: AnalysisResult, fileName: string) {
  const width = 1200;
  const height = 1500;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // ── 1. Cosmic Background Gradient ───────────────────────────────────────────
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#05050d');
  bgGrad.addColorStop(0.5, '#0a0a1a');
  bgGrad.addColorStop(1, '#030307');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Nebula ambient glow accents
  const glow1 = ctx.createRadialGradient(200, 200, 20, 200, 200, 400);
  glow1.addColorStop(0, 'rgba(139, 92, 246, 0.15)');
  glow1.addColorStop(1, 'transparent');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  const glow2 = ctx.createRadialGradient(1000, 600, 20, 1000, 600, 500);
  glow2.addColorStop(0, 'rgba(6, 182, 212, 0.12)');
  glow2.addColorStop(1, 'transparent');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, width, height);

  // Outer border
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.35)';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // ── 2. Top Header & Mission Telemetry ────────────────────────────────────────
  ctx.fillStyle = '#8b5cf6';
  ctx.beginPath();
  ctx.arc(80, 80, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('SocialSphere AI', 120, 88);

  ctx.fillStyle = '#06b6d4';
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('MISSION INTELLIGENCE REPORT', 120, 114);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '14px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`DOCUMENT: ${fileName.toUpperCase()}`, width - 60, 80);
  ctx.fillText(`DATE: ${new Date().toLocaleDateString()} · SOLAR ENGINE v2.0`, width - 60, 105);
  ctx.textAlign = 'left';

  // Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 140);
  ctx.lineTo(width - 60, 140);
  ctx.stroke();

  // ── 3. Main Impact Score Box ────────────────────────────────────────────────
  const score = analysis.impactScore.score;
  const grade = analysis.impactScore.grade;
  const scoreColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e';

  // Card Background
  ctx.fillStyle = 'rgba(20, 20, 40, 0.6)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  roundRect(ctx, 60, 170, width - 120, 220, 16);
  ctx.fill();
  ctx.stroke();

  // Score Circle Gauge
  const circleX = 180;
  const circleY = 280;
  const circleRadius = 65;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = scoreColor;
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleRadius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * score) / 100);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${score}`, circleX, circleY + 12);

  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = scoreColor;
  ctx.fillText(grade, circleX, circleY + 40);
  ctx.textAlign = 'left';

  // Sub-scores
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Overall Content Impact Assessment', 290, 210);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  wrapText(ctx, analysis.impactScore.summary, 290, 240, width - 380, 22);

  // Sub-score pills
  const subKeys = [
    { label: 'Hook', val: analysis.impactScore.subScores.hook },
    { label: 'Clarity', val: analysis.impactScore.subScores.clarity },
    { label: 'Engagement', val: analysis.impactScore.subScores.engagement },
    { label: 'CTA', val: analysis.impactScore.subScores.cta },
    { label: 'Tone', val: analysis.impactScore.subScores.tone },
  ];

  subKeys.forEach((sub, i) => {
    const px = 290 + i * 160;
    const py = 325;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    roundRect(ctx, px, py, 145, 45, 8);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px monospace';
    ctx.fillText(sub.label.toUpperCase(), px + 12, py + 20);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${sub.val}%`, px + 12, py + 38);
  });

  // ── 4. Key Intelligence Grid (Hook, CTA, Tone, Platforms) ──────────────────
  const rowY = 420;
  const colW = (width - 150) / 2;

  // Box 1: Hook Analysis
  ctx.fillStyle = 'rgba(20, 20, 40, 0.5)';
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)';
  roundRect(ctx, 60, rowY, colW, 200, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f43f5e';
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('🪝 HOOK HORIZON', 80, rowY + 35);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`${analysis.hookAnalysis.verdict} (${analysis.hookAnalysis.rating}/10)`, 80, rowY + 65);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  wrapText(ctx, `Opening: "${analysis.hookAnalysis.openingLine.slice(0, 120)}..."`, 80, rowY + 95, colW - 40, 20);
  wrapText(ctx, analysis.hookAnalysis.explanation, 80, rowY + 145, colW - 40, 18);

  // Box 2: CTA & Conversion
  const col2X = 60 + colW + 30;
  ctx.fillStyle = 'rgba(20, 20, 40, 0.5)';
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
  roundRect(ctx, col2X, rowY, colW, 200, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('📣 CTA & CONVERSION TRIGGER', col2X + 20, rowY + 35);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`CTA Strength: ${analysis.ctaDetection.ctaStrength.toUpperCase()}`, col2X + 20, rowY + 65);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  wrapText(ctx, analysis.ctaDetection.explanation, col2X + 20, rowY + 95, colW - 40, 20);
  wrapText(ctx, `Suggested CTA: "${analysis.ctaDetection.suggestedCTA}"`, col2X + 20, rowY + 145, colW - 40, 18);

  // ── 5. Platforms & Hashtags Row ─────────────────────────────────────────────
  const row2Y = 645;

  // Box 3: Platforms
  ctx.fillStyle = 'rgba(20, 20, 40, 0.5)';
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
  roundRect(ctx, 60, row2Y, colW, 200, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#a78bfa';
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('📱 PLATFORM STRATEGY', 80, row2Y + 35);

  analysis.platformAnalysis.forEach((p, idx) => {
    const py = row2Y + 70 + idx * 42;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(p.platform, 80, py);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`${p.score}% Fit`, 200, py);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(p.estimatedReach || 'Ideal for content distribution', 270, py);
  });

  // Box 4: Hashtag Intelligence
  ctx.fillStyle = 'rgba(20, 20, 40, 0.5)';
  ctx.strokeStyle = 'rgba(236, 72, 153, 0.3)';
  roundRect(ctx, col2X, row2Y, colW, 200, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ec4899';
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('#️⃣ HASHTAG INTELLIGENCE', col2X + 20, row2Y + 35);

  const tags = analysis.hashtagIntelligence.suggested.concat(analysis.hashtagIntelligence.trending).slice(0, 6);
  let curTagX = col2X + 20;
  let curTagY = row2Y + 70;

  tags.forEach((tag) => {
    ctx.font = 'bold 13px monospace';
    const tagW = ctx.measureText(tag).width + 16;
    if (curTagX + tagW > col2X + colW - 20) {
      curTagX = col2X + 20;
      curTagY += 36;
    }
    ctx.fillStyle = 'rgba(236, 72, 153, 0.15)';
    roundRect(ctx, curTagX, curTagY - 16, tagW, 26, 13);
    ctx.fill();

    ctx.fillStyle = '#f472b6';
    ctx.fillText(tag, curTagX + 8, curTagY + 2);
    curTagX += tagW + 8;
  });

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  wrapText(ctx, analysis.hashtagIntelligence.explanation, col2X + 20, row2Y + 155, colW - 40, 18);

  // ── 6. AI Optimized Rewrite Section ─────────────────────────────────────────
  const row3Y = 870;
  ctx.fillStyle = 'rgba(20, 20, 45, 0.7)';
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
  roundRect(ctx, 60, row3Y, width - 120, 480, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('✨ AI-OPTIMIZED COPY & REWRITE', 80, row3Y + 40);

  ctx.fillStyle = '#ffffff';
  ctx.font = '15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  wrapText(ctx, analysis.improvedVersion.rewrittenText, 80, row3Y + 80, width - 160, 24);

  // Key changes bullet list
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Key Optimizations Applied:', 80, row3Y + 370);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  analysis.improvedVersion.changesHighlighted.slice(0, 4).forEach((change, i) => {
    ctx.fillText(`• ${change}`, 80, row3Y + 400 + i * 22);
  });

  // ── 7. Footer ───────────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GENERATED BY SOCIALSPHERE AI · SOLAR SYSTEM CONTENT ENGINE', width / 2, height - 50);

  // ── 8. Download PNG ─────────────────────────────────────────────────────────
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `SocialSphere-Mission-${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
}

// ── Helper Canvas Functions ──────────────────────────────────────────────────

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const paragraphs = text.split('\n');
  let currentY = y;

  for (const para of paragraphs) {
    const words = para.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
}
