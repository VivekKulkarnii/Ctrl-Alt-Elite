<div align="center">

  <img src="https://img.icons8.com/color/144/balance-scale.png" alt="LexAI Logo"/>

  # ⚖️ LexAI

  ### *The Multi-Agent AI Legal Document Assistant*

  > 🧠 **Everyone signs legal documents. Almost nobody understands them.**
  > LexAI changes that — in seconds, in any language.

  <br/>

  [![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![Express](https://img.shields.io/badge/Express.js-000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
  [![Groq](https://img.shields.io/badge/Groq-f55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)
  [![LLaMA](https://img.shields.io/badge/LLaMA_3.3--70B-7C3AED?style=for-the-badge&logo=meta&logoColor=white)](https://llama.meta.com/)
  [![WhatsApp](https://img.shields.io/badge/WhatsApp_Bot-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://www.twilio.com/whatsapp)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

  <br/>

  [🌐 Live Demo](https://ctrl-alt-elite-nu.vercel.app) · [📄 Demo Script](docs/DEMO_SCRIPT.md)

</div>

<br/>

---

<br/>

## 🎯 What Is LexAI?

**LexAI** is an advanced **Agentic AI system** that democratizes legal protection. Upload a rental agreement, employment offer, NDA, or any legal document — and get a comprehensive, jargon-free breakdown in seconds.

Instead of one generic AI, LexAI utilizes a **Multi-Agent Swarm Architecture**. When you upload a document, the text is routed through **three specialized AI Agents** working in a sequential pipeline:

| # | Agent | Role |
|:-:|:------|:-----|
| 🕵️ | **The Extractor** | Identifies parties, dates, document type, and generates a plain-English summary |
| ⚖️ | **The Risk Analyst** | Hunts for deal-breaking red flags, predatory clauses, and scores overall risk (1–10) |
| 📋 | **The Legal Drafter** | Maps obligations, deadlines, important clauses, and flags suspiciously **missing** protections |

The results from all three agents are aggregated into a single, rich interactive dashboard.

<br/>

---

<br/>

## ✨ Features

<table>
  <tr>
    <td width="60" align="center">📱</td>
    <td><strong>WhatsApp Integration</strong><br/>Forward a PDF to our Twilio sandbox number and get an instant legal breakdown in your WhatsApp chat — no web app required.</td>
  </tr>
  <tr>
    <td align="center">🌐</td>
    <td><strong>Vernacular Polyglot</strong><br/>Law is local. LexAI seamlessly translates English legalese into <strong>Hindi, Kannada, Tamil, Bengali</strong>, and more — natively in the UI.</td>
  </tr>
  <tr>
    <td align="center">⚡</td>
    <td><strong>Groq-Powered Speeds</strong><br/>Powered by <code>llama-3.3-70b-versatile</code> running on Groq inference engines for near-instantaneous analysis.</td>
  </tr>
  <tr>
    <td align="center">📝</td>
    <td><strong>Document Generator</strong><br/>Proactively draft completely new, legally sound NDAs and Service Agreements via the dynamic form UI.</td>
  </tr>
  <tr>
    <td align="center">💬</td>
    <td><strong>Q&A Chat Mode</strong><br/>Enter a conversational interface to ask <em>anything</em> about the specific document you uploaded.</td>
  </tr>
  <tr>
    <td align="center">🔍</td>
    <td><strong>Clause Simplifier</strong><br/>Click on any complex clause to get a plain-English breakdown, fairness rating, and negotiation tips.</td>
  </tr>
  <tr>
    <td align="center">🎯</td>
    <td><strong>Risk Deep-Dive</strong><br/>Drill into any detected risk for real-world examples, suggested alternative language, and walk-away thresholds.</td>
  </tr>
</table>

<br/>

---

<br/>

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion | Responsive UI with rich animations |
| **Backend API** | Node.js, Express, Multer, `pdf-parse` | File upload, PDF extraction, API orchestration |
| **Agentic Core** | Groq SDK → `llama-3.3-70b-versatile` | Multi-agent prompt pipeline (3 specialized agents) |
| **WhatsApp Service** | Python 3, FastAPI, Uvicorn, Twilio, PyPDF2 | Standalone webhook microservice for WhatsApp |
| **Deployment** | Vercel (frontend), LocalTunnel / Ngrok (WhatsApp) | Production hosting & local tunnel for webhooks |

<br/>

---

<br/>

## 🧠 System Architecture

```
                        ┌─────────────────────┐
                        │   User uploads PDF   │
                        │  (Web UI / WhatsApp) │
                        └──────────┬──────────┘
                                   │
                                   ▼
                     ┌─────────────────────────┐
                     │   Raw Text Extraction    │
                     │   (pdf-parse / PyPDF2)   │
                     └─────────────┬───────────┘
                                   │
                  ╔════════════════╧════════════════╗
                  ║   MULTI-AGENT SWARM (Sequential) ║
                  ╚════════════════╤════════════════╝
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                     │
              ▼                    ▼                     ▼
   ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
   │  🕵️ EXTRACTOR    │ │  ⚖️ RISK ANALYST │ │  📋 LEGAL DRAFTER│
   │                  │ │                  │ │                  │
   │ • Doc Type       │ │ • Risk Items     │ │ • Obligations    │
   │ • Summary        │ │ • Risk Score /10 │ │ • Key Clauses    │
   │ • Parties        │ │ • Red Flags      │ │ • Missing Clauses│
   │ • Key Dates      │ │ • Recommendation │ │ • Deadlines      │
   └────────┬─────────┘ └────────┬─────────┘ └────────┬─────────┘
              │                    │                     │
              └────────────────────┼────────────────────┘
                                   │
                                   ▼
                     ┌─────────────────────────┐
                     │   Aggregation Engine     │
                     │   (Unified JSON Output)  │
                     └─────────────┬───────────┘
                                   │
                                   ▼
                     ┌─────────────────────────┐
                     │  Rich Interactive Dashboard  │
                     │     or WhatsApp Reply    │
                     └─────────────────────────┘
```

<br/>

---

<br/>

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** ≥ 18 & **npm**
- **Python** ≥ 3.9 *(only for WhatsApp bot)*
- A **[Groq API Key](https://console.groq.com/keys)** *(free tier works)*

<br/>

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/VivekKulkarnii/Ctrl-Alt-Elite.git
cd Ctrl-Alt-Elite
```

### 2️⃣ Start the Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
# ✅ Running on http://localhost:3000
```

### 3️⃣ Start the Backend API (Express)

```bash
cd backend
cp .env.example .env          # Then add your GROQ_API_KEY
npm install
npm run dev
# ✅ Running on http://localhost:3001
```

> [!IMPORTANT]
> You **must** set `GROQ_API_KEY` in `backend/.env` before the backend will work.

### 4️⃣ Start the WhatsApp Bot *(Optional)*

```bash
# From the project root
pip install -r requirements.txt
python -m uvicorn main:app --port 8000 --reload
# ✅ Webhook running on http://localhost:8000
```

To expose the local server to Twilio's webhook:

```bash
npx localtunnel --port 8000
# or
ngrok http 8000
```

Then set the generated public URL as your Twilio WhatsApp Sandbox webhook → `https://<your-url>/webhook`

<br/>

---

<br/>

## 📁 Project Structure

```
Ctrl-Alt-Elite/
├── frontend/                   # Next.js 14 + TypeScript
│   ├── app/
│   │   ├── page.tsx            # Main application page
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Global styles
│   │   ├── constants.ts        # App-wide constants
│   │   └── components/
│   │       ├── Header.tsx          # Navigation & branding
│   │       ├── UploadZone.tsx      # Drag-and-drop file upload
│   │       ├── AnalysisPanel.tsx   # Multi-agent results dashboard
│   │       ├── ChatInterface.tsx   # Document Q&A chat
│   │       └── DocumentGenerator.tsx  # Legal doc generation UI
│   └── package.json
│
├── backend/                    # Express.js API
│   ├── server.js               # Entry point & middleware
│   ├── routes/
│   │   ├── analyze.js          # POST /api/analyze — document analysis
│   │   ├── chat.js             # POST /api/chat — Q&A conversation
│   │   └── generate.js         # POST /api/generate — document drafting
│   ├── utils/
│   │   ├── aiProcessor.js      # Multi-agent orchestration & Groq calls
│   │   └── pdfParser.js        # PDF text extraction
│   ├── prompts/
│   │   └── legalPrompts.js     # All agent system prompts
│   └── package.json
│
├── main.py                     # FastAPI WhatsApp bot (standalone)
├── requirements.txt            # Python dependencies
├── start.sh                    # Quick-start script
├── docs/
│   ├── DEMO_SCRIPT.md          # Hackathon demo walkthrough
│   └── sample_lease_agreement.txt
└── README.md
```

<br/>

---

<br/>

## 🔌 API Reference

| Method | Endpoint | Description | Body |
|:-------|:---------|:------------|:-----|
| `POST` | `/api/analyze` | Upload & analyze a legal document | `multipart/form-data` — field: `document` |
| `POST` | `/api/chat` | Ask a question about an analyzed document | `{ documentText, question, chatHistory?, language? }` |
| `POST` | `/api/generate` | Generate a new legal document | `{ templateType, details }` |
| `GET`  | `/api/health` | Health check | — |

<br/>

---

<br/>

## ⚠️ Disclaimer

> [!CAUTION]
> LexAI provides **AI-generated legal information for educational purposes only**. It is **not a substitute for advice from a qualified legal professional**. Always consult a lawyer before signing important legal documents.

<br/>

---

<div align="center">

  <br/>

  Built with ❤️ for the **Hackathon — Agentic AI Track**

  <br/>

  **Team Ctrl+Alt+Elite**

  <br/>

</div>
