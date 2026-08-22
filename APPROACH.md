# Technical Approach — SocialSphere AI

SocialSphere AI is built on a deliberate separation between client-side media processing and server-side AI intelligence.

**Text Extraction Pipeline.** Rather than uploading raw files to the server, all file parsing happens in the browser. PDF text is extracted with `pdfjs-dist`, which loads a PDF.js web worker pointed at a CDN-hosted bundle — avoiding the complex bundling issues that come from shipping the worker with Next.js. OCR for images uses `Tesseract.js`, which downloads a WASM-compiled Tesseract binary on first use and runs recognition entirely client-side. Both pipelines expose progress callbacks that feed a live multi-step UI stepper, so the interface never blocks or appears frozen during potentially long operations.

**AI Analysis.** Once text is extracted, the client POSTs to a Next.js API route that calls Anthropic's Claude (`claude-opus-4-5`). The prompt uses strict JSON schema instructions, asking Claude to return a deterministic object covering ten analysis dimensions. The API route strips markdown fences from the response before parsing, ensuring robustness even if the model adds code block markers. The API key lives exclusively server-side — never in the browser bundle.

**3D Visualization.** The `ScoreOrb` component uses `@react-three/fiber` (a React renderer for Three.js) combined with `@react-three/drei` helpers. The central sphere uses `MeshDistortMaterial` for an organic, living feel. Sub-score orbs orbit at different radii, speeds, and tilts, color-coded by their score band. `OrbitControls` provides drag-to-rotate with auto-rotation. The component is dynamically imported with `next/dynamic` and `ssr: false` to prevent server-side render errors.

**Design Philosophy.** The UI uses a glassmorphism design system built on CSS custom properties — no third-party component library. Framer Motion drives staggered card reveals and animated progress states. Every error state is handled with user-facing messages rather than console-only logging.
