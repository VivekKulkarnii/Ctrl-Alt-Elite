# ⚖️ LexAI — AI Legal Document Action Agent

> *"Everyone signs legal documents. Almost nobody understands them."*
> LexAI changes that — instantly, intelligently, and for everyone.

---

## 🎯 What Is This?

**LexAI** is an agentic AI system that reads legal documents so you don't have to struggle through them.
Upload any PDF or text contract — rental agreement, employment offer, NDA, terms of service —
and LexAI will **analyze it end-to-end in under 10 seconds**, giving you:

- A plain-English summary of what the document actually means
- Every risk, flagged by severity (High / Medium / Low)
- Your obligations, with deadlines
- Key clauses decoded from legalese
- A smart Q&A chat — ask *anything* about the document

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **Document Upload** | PDF, TXT, DOC, DOCX — up to 10MB |
| 🔍 **Risk Detection** | AI detects unfavorable, hidden, or unusual clauses |
| 📝 **Plain English** | Every clause explained without jargon |
| 📋 **Obligation Tracker** | Who must do what, and by when |
| ⚠️ **Red Flags** | Instant alerts for deal-breakers |
| 💬 **Q&A Chat** | Conversational interface — ask anything |
| 📊 **Risk Score** | 1–10 overall document risk rating |
| 🔍 **Missing Clauses** | Detects what *should* be there but isn't |

---

## 🏗️ Tech Stack

```
Frontend:  Next.js 14 + TypeScript + Tailwind CSS
Backend:   Node.js + Express
AI:        Claude (Anthropic) — claude-sonnet-4
Parsing:   pdf-parse (PDF text extraction)
```

---

## 🚀 Setup — Run in 5 Minutes

### Prerequisites
- Node.js 18+
- An Anthropic API key → [console.anthropic.com](https://console.anthropic.com)

---

### Step 1 — Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### Step 2 — Environment Variables

```bash
# In /backend
cp .env.example .env
# Edit .env and add your key:
# ANTHROPIC_API_KEY=sk-ant-...

# In /frontend
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

### Step 3 — Run Both Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

Open **http://localhost:3000** in your browser. That's it. 🎉

---

## 🔌 API Reference

### `POST /api/analyze`
Accepts a multipart file upload OR raw JSON with `text` field.

**Response:**
```json
{
  "success": true,
  "fileName": "contract.pdf",
  "analysis": {
    "documentType": "Employment Agreement",
    "summary": "...",
    "risks": [...],
    "obligations": [...],
    "importantClauses": [...],
    "overallRiskScore": 8,
    "redFlags": [...],
    "recommendation": "..."
  },
  "extractedText": "..."
}
```

### `POST /api/chat`
```json
{
  "documentText": "...",
  "message": "Can I terminate early?",
  "history": [],
  "mode": "chat"
}
```

---

## 🧠 How It Works

```
User uploads document
        │
        ▼
   Text Extraction (pdf-parse)
        │
        ▼
   AI Analysis (Claude)
   ┌────────────────────┐
   │  Document Type     │
   │  Risk Detection    │
   │  Obligation Scan   │
   │  Clause Decoding   │
   │  Gap Analysis      │
   └────────────────────┘
        │
        ▼
   Structured JSON Response
        │
        ▼
   Rich UI Dashboard + Chat
```

The AI is guided by carefully engineered **prompt chains** that enforce structured JSON output,
ensuring reliable parsing and consistent analysis quality.

---

## 📁 Project Structure

```
legal-agent/
├── backend/
│   ├── server.js              # Express server + file upload config
│   ├── routes/
│   │   ├── analyze.js         # Document analysis endpoint
│   │   └── chat.js            # Chat Q&A endpoint
│   ├── utils/
│   │   ├── aiProcessor.js     # Claude API calls
│   │   └── pdfParser.js       # Text extraction
│   ├── prompts/
│   │   └── legalPrompts.js    # All AI prompt templates
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Main app page + state
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles + animations
│   │   └── components/
│   │       ├── Header.tsx         # Top nav
│   │       ├── UploadZone.tsx     # File upload + loading
│   │       ├── AnalysisPanel.tsx  # Results dashboard
│   │       └── ChatInterface.tsx  # Q&A chat
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── package.json
│
├── docs/
│   └── DEMO_SCRIPT.md
└── README.md
```

---

## 🚀 Future Improvements (for judges)

1. **Multi-document comparison** — compare two versions of the same contract
2. **Clause negotiation assistant** — auto-generate counter-proposals
3. **Jurisdiction-aware analysis** — adapt risk assessment to Indian/US/EU law
4. **WhatsApp / Telegram bot** — send a photo of the document, get instant analysis
5. **Lawyer referral integration** — connect users with real lawyers for flagged risks
6. **Document history & tracking** — track changes across contract versions
7. **Voice interface** — explain documents via audio for accessibility
8. **Multi-language support** — analyze documents in Hindi, Kannada, etc.

---

## ⚠️ Disclaimer

LexAI provides AI-generated legal information for educational purposes only.
It is **not a substitute for advice from a qualified legal professional**.
Always consult a lawyer before signing important legal documents.

---

*Built with ❤️ for RNSIT Hackathon — Agentic AI Track*
