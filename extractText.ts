/**
 * Text extraction utilities for PDF and image files.
 * PDF: uses pdfjs-dist (client-side)
 * Image: uses Tesseract.js (client-side OCR)
 */

import type { ExtractedContent, FileType } from './types';

// ─── Constants ────────────────────────────────────────────────────────────────

export const SUPPORTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!SUPPORTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type "${file.type || 'unknown'}". Please upload a PDF or image (JPG, PNG, WebP).`,
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`,
    };
  }
  if (file.size === 0) {
    return { valid: false, error: 'The file appears to be empty. Please upload a valid file.' };
  }
  return { valid: true };
}

export function getFileType(file: File): FileType {
  return file.type === 'application/pdf' ? 'pdf' : 'image';
}

// ─── PDF Extraction ───────────────────────────────────────────────────────────

export async function extractTextFromPDF(
  file: File,
  onProgress?: (p: number) => void
): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();

    // Dynamically import pdfjs-dist to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist');

    // Set worker source — use a CDN worker to avoid bundling issues
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const totalPages = pdf.numPages;

    if (totalPages === 0) {
      throw new Error('The PDF appears to have no pages.');
    }

    const textParts: string[] = [];

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str ?? '')
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (pageText) textParts.push(pageText);
      onProgress?.(Math.round((i / totalPages) * 100));
    }

    const fullText = textParts.join('\n\n').trim();

    if (!fullText) {
      throw new Error(
        'No readable text found in this PDF. It may be a scanned image PDF — try uploading it as an image instead.'
      );
    }

    return fullText;
  } catch (err: unknown) {
    if (err instanceof Error) {
      // Re-throw our own errors
      if (err.message.startsWith('No readable') || err.message.startsWith('The PDF')) {
        throw err;
      }
      throw new Error(`Failed to read PDF: ${err.message}`);
    }
    throw new Error('An unknown error occurred while reading the PDF.');
  }
}

// ─── OCR Extraction ───────────────────────────────────────────────────────────

export async function extractTextFromImage(
  file: File,
  onProgress?: (p: number) => void
): Promise<string> {
  try {
    const { createWorker } = await import('tesseract.js');

    const worker = await createWorker('eng', 1, {
      logger: (m: { status: string; progress: number }) => {
        if (m.status === 'recognizing text') {
          onProgress?.(Math.round(m.progress * 100));
        }
      },
    });

    const imageUrl = URL.createObjectURL(file);
    const { data } = await worker.recognize(imageUrl);
    await worker.terminate();
    URL.revokeObjectURL(imageUrl);

    const text = data.text.trim();

    if (!text || text.length < 5) {
      throw new Error(
        'Could not extract any text from this image. Please ensure the image contains readable text and try again.'
      );
    }

    return text;
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message.startsWith('Could not extract')) throw err;
      throw new Error(`OCR failed: ${err.message}`);
    }
    throw new Error('An unknown error occurred during image text extraction.');
  }
}

// ─── Content Stats ────────────────────────────────────────────────────────────

export function buildExtractedContent(
  text: string,
  file: File,
  fileType: 'pdf' | 'image'
): ExtractedContent {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return {
    text,
    fileType,
    fileName: file.name,
    charCount: text.length,
    wordCount: words.length,
  };
}
