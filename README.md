<div align="center">

<!-- Animated Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:020817,30:0a2040,70:0a2040,100:020817&height=220&section=header&text=GeoSentinel%20AI&fontSize=65&fontColor=ffffff&fontAlignY=42&desc=Satellite%20Intelligence%20Platform%20%C2%B7%20Powered%20by%20Gemini%20AI&descAlignY=65&descSize=20&descColor=00d4ff&animation=twinkling&stroke=00d4ff&strokeWidth=2" width="100%"/>

<br/>

<!-- Badges Row 1 -->
<a href="https://github.com/rohitwadettiwar123/SIH_GeoSentinel-AI">
  <img src="https://img.shields.io/github/stars/rohitwadettiwar123/SIH_GeoSentinel-AI?style=for-the-badge&logo=github&color=00d4ff&labelColor=0d1117"/>
</a>
<a href="https://sih-geosentinel-ai.onrender.com/api">
  <img src="https://img.shields.io/badge/Backend-Live%20on%20Render-00d4ff?style=for-the-badge&logo=render&labelColor=0d1117"/>
</a>
<a href="#">
  <img src="https://img.shields.io/badge/Frontend-Vercel-00d4ff?style=for-the-badge&logo=vercel&labelColor=0d1117"/>
</a>
<img src="https://img.shields.io/badge/Python-3.14-00d4ff?style=for-the-badge&logo=python&labelColor=0d1117"/>
<img src="https://img.shields.io/badge/React-TypeScript-00d4ff?style=for-the-badge&logo=react&labelColor=0d1117"/>
<img src="https://img.shields.io/badge/Gemini%20AI-Powered-00d4ff?style=for-the-badge&logo=google&labelColor=0d1117"/>

<br/><br/>

<!-- Main Visual -->
```
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║   ██████╗ ███████╗ ██████╗ ███████╗███████╗███╗   ██╗████████╗      ║
║  ██╔════╝ ██╔════╝██╔═══██╗██╔════╝██╔════╝████╗  ██║╚══██╔══╝      ║
║  ██║  ███╗█████╗  ██║   ██║███████╗█████╗  ██╔██╗ ██║   ██║         ║
║  ██║   ██║██╔══╝  ██║   ██║╚════██║██╔══╝  ██║╚██╗██║   ██║         ║
║  ╚██████╔╝███████╗╚██████╔╝███████║███████╗██║ ╚████║   ██║         ║
║   ╚═════╝ ╚══════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝         ║
║                                                                      ║
║         🛰️  SATELLITE  INTELLIGENCE  PLATFORM  🌍                    ║
║              [ Powered by Gemini AI · FAISS · FastAPI ]              ║
╚══════════════════════════════════════════════════════════════════════╝
```

<br/>

> **🏆 Built for Smart India Hackathon (SIH)**
> A cutting-edge geospatial intelligence platform that uses Gemini AI to perform semantic satellite image search, real-time change detection, and AI-powered geospatial analysis — all running 100% free on the cloud.

</div>

---

## 🌌 What is GeoSentinel AI?

GeoSentinel AI is a **full-stack satellite intelligence platform** that brings AI-powered analysis to satellite imagery. Instead of relying on expensive models running locally, it uses **Google's Gemini AI API** to perform vision understanding, text embeddings, and conversational analysis — making it lightweight enough to run on Render's free tier.

It was developed as part of **Smart India Hackathon (SIH)** and focuses on **disaster monitoring, environmental surveillance, and geospatial intelligence** for India.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔍 Semantic Search
Search satellite imagery using **natural language queries** or upload an image to find visually similar scenes. Powered by Gemini text embeddings and FAISS vector search.

```
User: "flooded delta region"
  ↓
Gemini text-embedding-001
  ↓
FAISS Vector Search
  ↓
Top-K Similar Satellite Scenes
```

</td>
<td width="50%">

### 🤖 GeoSentinel Chatbot
An **AI geospatial analyst** powered by Gemini 1.5 Flash. Ask it about geographic regions, change patterns, or environmental phenomena.

```
User: "What changes are happening 
       in the Sundarbans?"
  ↓
Gemini 1.5 Flash + AOI Context
  ↓
Expert Geospatial Analysis
```

</td>
</tr>
<tr>
<td width="50%">

### 🗺️ Change Detection
**Before/After analysis** of satellite imagery. Detects:
- 🌊 Flood extent mapping
- 🌿 Vegetation loss (NDVI analysis)
- 🏗️ Urban construction
- 🛣️ Road development

</td>
<td width="50%">

### 📊 Evidence Review
A structured **evidence management system** for reviewing detected changes. Confirm, reject, or annotate geospatial evidence with confidence scores.

</td>
</tr>
<tr>
<td width="50%">

### 📥 Data Ingestion Pipeline
A 4-stage automated pipeline:
```
Upload → Preprocess → Index → Ready
```
Supports **GeoTIFF, COG, TIF, JP2** formats.
Auto-builds Gemini embeddings + FAISS index.

</td>
<td width="50%">

### 📄 Report Generation
Export geospatial intelligence as:
**PDF · CSV · GML · SHP (Shapefile)**
With full provenance tracking and metadata.

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
                        ┌─────────────────────────────────────────────────────────┐
                        │              GeoSentinel AI  — System Architecture       │
                        └─────────────────────────────────────────────────────────┘

  ┌────────────────────┐       HTTPS        ┌────────────────────────────────────────────┐
  │                    │ ─────────────────► │          Render.com (Free Tier)             │
  │   VERCEL FRONTEND  │                   │  ┌──────────────────────────────────────┐   │
  │   React + TS +     │ ◄───────────────── │  │  FastAPI Backend  (Python 3.14)      │   │
  │   TailwindCSS      │       JSON         │  │                                      │   │
  │                    │                   │  │  /api/v1/search/text   (Semantic)    │   │
  │  11 Pages:         │                   │  │  /api/v1/search/image  (Vision)      │   │
  │  ├─ Dashboard      │                   │  │  /api/chat             (Gemini AI)   │   │
  │  ├─ Semantic Search│                   │  │  /api/analyze          (Change Det.) │   │
  │  ├─ Change Analysis│                   │  │  /api/upload           (Ingestion)   │   │
  │  ├─ 2D Tactical    │                   │  │  /api/report           (Export)      │   │
  │  ├─ 3D Explorer    │                   │  └──────────────────────────────────────┘   │
  │  ├─ Ask AI         │                   │                    │                        │
  │  ├─ Evidence Review│                   │         ┌──────────▼──────────┐             │
  │  ├─ Data Ingestion │                   │         │  GeoSentinel Engine  │             │
  │  ├─ Settings       │                   │         │                      │             │
  │  ├─ Reports        │                   │         │  ┌────────────────┐  │             │
  │  └─ Similar Sites  │                   │         │  │  FAISS Vector  │  │             │
  └────────────────────┘                   │         │  │  Store (768-d) │  │             │
                                           │         │  └────────────────┘  │             │
                                           │         │  ┌────────────────┐  │             │
                                           │         │  │  Gemini API    │  │             │
                                           │         │  │  embedding-001 │  │             │
                                           │         │  │  1.5-flash     │  │             │
                                           │         │  └────────────────┘  │             │
                                           │         └──────────────────────┘             │
                                           └────────────────────────────────────────────┘
```

---

## 🧠 AI/ML Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SEMANTIC SEARCH PIPELINE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   TEXT QUERY                           IMAGE QUERY                           │
│       │                                     │                                │
│       ▼                                     ▼                                │
│  Gemini API                          Gemini 1.5 Flash                        │
│  embedding-001                    (Vision → Text Description)                │
│       │                                     │                                │
│       ▼                                     ▼                                │
│  768-dim Vector              →    768-dim Vector                             │
│       │                                     │                                │
│       └─────────────┬───────────────────────┘                                │
│                     ▼                                                         │
│              FAISS Index                                                      │
│           (cosine similarity)                                                 │
│                     │                                                         │
│                     ▼                                                         │
│           Top-K Ranked Results                                                │
│         (with metadata + preview URLs)                                        │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | UI Framework |
| **Styling** | Tailwind CSS | Dark space-theme UI |
| **Icons** | Lucide React | UI Icons |
| **Backend** | FastAPI (Python 3.14) | REST API |
| **AI Engine** | Google Gemini 1.5 Flash | Vision + Chat AI |
| **Embeddings** | Gemini embedding-001 | Semantic vectors (768-dim) |
| **Vector DB** | FAISS (CPU) | Similarity search |
| **Image Processing** | OpenCV + Pillow | Pre-processing |
| **Auth** | Python-Jose (JWT) | Secure login |
| **Reports** | ReportLab | PDF generation |
| **GIS Export** | GeoJSON / GML / SHP | Geospatial formats |
| **Backend Deploy** | Render.com (Free) | Cloud hosting |
| **Frontend Deploy** | Vercel (Free) | Static hosting |

</div>

---

## 📁 Project Structure

```
SIH_GeoSentinel-AI/
│
├── 📂 backend/                     # FastAPI backend app
│   ├── 📂 routes/                  # API route handlers
│   │   ├── chat.py                 # 🤖 Gemini AI chatbot
│   │   ├── analyze.py              # 🔬 Change detection
│   │   ├── upload.py               # 📤 Image ingestion
│   │   ├── report.py               # 📄 Report generation
│   │   └── gis_export.py           # 🗺️ GIS file export
│   ├── 📂 data/
│   │   ├── uploads/                # 🛰️ 55+ demo satellite images
│   │   └── indexes/                # 🧠 FAISS vector index (auto-built)
│   ├── config.py                   # ⚙️ App settings
│   └── main.py                     # 🚀 App entrypoint + auto-indexing
│
├── 📂 geosentinel/                 # Core AI/ML engine
│   ├── 📂 api_v1/                  # GeoSentinel API routes
│   │   ├── search.py               # Semantic search endpoints
│   │   ├── analyze.py              # Geospatial analysis
│   │   ├── ingest.py               # Indexing pipeline
│   │   └── discover.py             # Cluster discovery
│   ├── 📂 embeddings/
│   │   └── provider.py             # 🧠 Gemini embedding provider
│   ├── 📂 vector_store/
│   │   └── faiss_store.py          # 📦 FAISS index management
│   └── 📂 core/
│       ├── schemas.py              # Pydantic data models
│       └── registry.py             # Plugin registry
│
├── 📂 frontend/                    # React + TypeScript frontend
│   └── 📂 src/
│       ├── 📂 pages/               # 11 page components
│       │   ├── DashboardPage.tsx
│       │   ├── SemanticSearchPage.tsx
│       │   ├── ChangeAnalysisPage.tsx
│       │   ├── AskAIPage.tsx
│       │   ├── EvidenceReviewPage.tsx
│       │   ├── DataIngestionPage.tsx
│       │   ├── ReportsPage.tsx
│       │   └── SettingsPage.tsx
│       ├── 📂 components/          # Shared UI components
│       │   ├── Sidebar.tsx         # Navigation sidebar
│       │   ├── MapViewer.tsx       # 2D tactical map
│       │   └── Explorer3D.tsx      # 3D globe explorer
│       └── 📂 api/
│           └── client.ts           # API client
│
├── 📂 scripts/
│   └── build_geosentinel_index.py  # 🔧 FAISS index builder
│
├── config.yaml                     # Configuration
├── requirements.txt                # Python dependencies
└── README.md                       # 📖 This file
```

---

## ⚡ Quick Start (Local)

### Prerequisites
- Python 3.11+
- Node.js 18+
- A free [Google AI Studio](https://aistudio.google.com) API key

### 1. Clone & Setup
```bash
git clone https://github.com/rohitwadettiwar123/SIH_GeoSentinel-AI.git
cd SIH_GeoSentinel-AI
```

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Create .env file
echo GEMINI_API_KEY=your_key_here > .env

# Build the FAISS semantic index
python scripts/build_geosentinel_index.py

# Start the backend
uvicorn backend.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env.local
echo VITE_API_URL=http://localhost:8000/api > .env.local

npm run dev
```

Open `http://localhost:5173` 🎉

---

## ☁️ Deployment (Free Tier)

### Backend → Render.com
| Setting | Value |
|---------|-------|
| Runtime | Python |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn backend.main:app --host 0.0.0.0 --port $PORT` |
| Environment Variable | `GEMINI_API_KEY=your_key` |

> 🟢 On first boot, the FAISS index is automatically built in the background using Gemini API. Search will be ready in ~2 minutes.

### Frontend → Vercel
| Setting | Value |
|---------|-------|
| Framework | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Environment Variable | `VITE_API_URL=https://your-render-url.onrender.com/api` |

---

## 🛰️ Demo Dataset

The platform ships with **55+ real satellite images** covering:

| Region | Coverage | Types |
|--------|---------|-------|
| 🌊 Sundarbans Delta | Bengal, India | Before/After flood |
| 🏔️ Himalayan Region | North India | Glacial imagery |
| 🌾 Ganges Plains | Bihar, India | Vegetation + Flood |
| 🏙️ Urban Areas | Multiple cities | Construction change |
| 🌊 Chilika Lake | Odisha, India | Water body change |
| 🌿 Brahmaputra | Assam, India | River course change |

---

## 🔐 Authentication

The platform uses JWT-based authentication with a secure login gate:

```
Default Credentials (Demo)
Username: demo
Password: geosentinel2024
```

> ⚠️ Change credentials via the Settings page before deploying to production.

---

## 📡 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/upload` | POST | Upload satellite image |
| `/api/analyze` | POST | Change detection analysis |
| `/api/chat` | POST | AI chatbot (Gemini) |
| `/api/report` | POST | Generate PDF report |
| `/api/v1/search/text` | POST | Text semantic search |
| `/api/v1/search/image` | POST | Image semantic search |
| `/api/v1/ingest` | POST | Index new image |
| `/api/v1/discover/cluster` | POST | K-means clustering |

> Full Swagger docs available at: `https://your-render-url.onrender.com/api/docs`

---

## 🧑‍🤝‍🧑 Team

Built with ❤️ for **Smart India Hackathon (SIH)** by **Team SparkX**

---

<div align="center">

<!-- Footer wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:020817,30:0a2040,70:0a2040,100:020817&height=120&section=footer&animation=twinkling" width="100%"/>

**⭐ If this project helped you, please give it a star! ⭐**

[![GitHub](https://img.shields.io/badge/GitHub-rohitwadettiwar123-00d4ff?style=for-the-badge&logo=github&labelColor=0d1117)](https://github.com/rohitwadettiwar123)

`🛰️ GeoSentinel AI — Seeing Earth Through Intelligence`

</div>
