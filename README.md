# SocialSphere AI 🚀

> **"Turn Content Into Conversations"**

An AI-powered web application that analyzes written content for social media performance. Upload a PDF or image — SocialSphere AI extracts the text and delivers a comprehensive breakdown across 10 analysis dimensions.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📁 **File Upload** | PDF and image (JPG, PNG, WebP) support |
| 🖱️ **Drag & Drop** | Intuitive drag-and-drop zone plus file picker |
| ✅ **File Validation** | Type, size, and corruption checks with user-friendly errors |
| 📄 **PDF Extraction** | Full text extraction using `pdfjs-dist` |
| 🔍 **OCR** | Image text extraction via `Tesseract.js` |
| ⏳ **Progress States** | Multi-step pipeline stepper (Upload → Extract → Analyze → Done) |
| 🎯 **Content Impact Score** | Overall 0–100 score with grade (A+–F) and sub-scores |
| 🪝 **Hook Analysis** | Opening line rating (0–10) with improved hook suggestion |
| 📣 **CTA Detection** | Detects presence, strength, and suggests alternatives |
| #️⃣ **Hashtag Intelligence** | General, niche, and trending-style hashtag sets |
| 🎭 **Tone Detection** | Primary/secondary tone with percentage breakdown |
| 📱 **Platform Analysis** | LinkedIn, X (Twitter), Instagram scores + tailored tips |
| 📈 **Engagement Potential** | Low/Medium/High/Viral prediction with reasoning |
| 💡 **Improvement Suggestions** | Priority-sorted, category-tagged actionable suggestions |
| 🔄 **Before vs After** | Side-by-side / toggle view of original vs AI-rewritten text |
| 🌐 **3D Visualization** | Interactive Three.js orb with orbiting sub-score spheres |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + custom CSS design system |
| PDF Extraction | `pdfjs-dist` (client-side) |
| OCR | `Tesseract.js` (client-side) |
| 3D Visualization | `three` + `@react-three/fiber` + `@react-three/drei` |
| Animations | `framer-motion` |
| AI Analysis | Anthropic Claude API (`claude-opus-4-5`) |
| Icons | `lucide-react` |
| Drag & Drop | `react-dropzone` |

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/your-username/socialsphere-ai.git
cd socialsphere-ai

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 Environment Variables

Create a `.env.local` file in the project root:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

> Never commit `.env.local` to git. It's already in `.gitignore`.

---

## 📁 Project Structure

```
socialsphere-ai/
├── app/
│   ├── layout.tsx              # Root layout + metadata
│   ├── page.tsx                # Main page with state machine
│   ├── globals.css             # Design system + animations
│   └── api/analyze/route.ts   # Claude AI analysis endpoint
├── components/
│   ├── UploadZone.tsx          # Drag-and-drop upload
│   ├── LoadingOverlay.tsx      # Pipeline progress indicator
│   ├── ExtractionDisplay.tsx   # Raw text preview
│   ├── AnalysisDashboard.tsx   # Cards container
│   ├── cards/                  # Individual analysis cards
│   └── visualization/
│       └── ScoreOrb.tsx        # Three.js 3D visualization
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── extractText.ts          # PDF + OCR utilities
│   └── analyzeContent.ts       # API client
└── .env.local.example
```

---

## 🎨 Design System

- **Theme:** Deep space dark (#050508) with neon purple/cyan accents
- **Font:** Inter (Google Fonts)
- **Components:** Glassmorphism cards with backdrop-filter blur
- **Animations:** Framer Motion for page transitions, Three.js for 3D

---

## 🧪 Supported File Types

| Format | Extension | Max Size |
|---|---|---|
| PDF | `.pdf` | 10 MB |
| JPEG | `.jpg`, `.jpeg` | 10 MB |
| PNG | `.png` | 10 MB |
| WebP | `.webp` | 10 MB |

---

## License

MIT
