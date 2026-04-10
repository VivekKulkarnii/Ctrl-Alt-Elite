<div align="center">
  <img src="https://img.icons8.com/color/144/balance-scale.png" alt="LexAI Logo"/>
  <h1>⚖️ LexAI</h1>
  <h3>The Specialized Multi-Agent Legal Document Assistant</h3>

  <p>Everyone signs legal documents. Almost nobody understands them.</p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs" alt="Node" />
    <img src="https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi" alt="FastAPI" />
    <img src="https://img.shields.io/badge/Groq-LLaMA_3.3-f55036?logo=groq" alt="Groq" />
    <img src="https://img.shields.io/badge/Twilio-WhatsApp-00E676?logo=whatsapp" alt="WhatsApp" />
  </div>
</div>

---

## 🎯 What Is LexAI?

**LexAI** is an advanced Agentic AI system that democratizes legal protection. It reads and decodes rental agreements, employment offers, NDAs, and more in seconds.

Instead of one generic AI, LexAI utilizes a **Multi-Agent Swarm Architecture**. When you upload a document, it routes the text to three specialized AI Agents working in tandem:
1. **The Extractor:** Identifies parties, dates, and contract summaries.
2. **The Risk Analyst:** Hunts for deal-breaking red flags and predatory clauses.
3. **The Legal Drafter:** Generates obligations, deadlines, and flags suspiciously missing clauses.

---

## ✨ Features

- **📱 WhatsApp Integration:** Forward a PDF to our sandbox number and get an instant legal breakdown in your WhatsApp chat. No web-app required!
- **🌐 Vernacular Polyglot:** Law is local. LexAI seamlessly translates English legalese into Hindi, Kannada, Tamil, Bengali, and more natively in the UI.
- **⚡ Groq-Powered Speeds:** Powered by `llama-3.3-70b-versatile` running on Groq inference engines for instantaneous edge speeds.
- **📝 Document Generator:** Proactively draft completely new, legally sound NDAs and Service Agreements via our dynamic form UI.
- **💬 Q&A Chat Mode:** Enter a conversational interface to ask *anything* about the specific document you uploaded.

---

## 🏗️ The Multi-Agent Tech Stack

| Layer | Technology |
|---|---|
| **Frontend UI** | Next.js 14, React.js, TypeScript, Tailwind CSS |
| **Backend API** | Node.js, Express, Multer, `pdf-parse` |
| **WhatsApp Microservice** | Python 3, FastAPI, Uvicorn, Ngrok, Twilio |
| **Agentic Core** | Groq SDK (`llama-3.3-70b`) |

---

## 🚀 Setup & Installation (Run in 5 Minutes)

### 1. The Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000
```

### 2. The Node.js Web Backend
Make sure you have a `GROQ_API_KEY` configured in `.env`.
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:3001
```

### 3. The WhatsApp Bot Engine (FastAPI)
Run the Python webhook service from the root directory to enable the Twilio WhatsApp Sandbox integrations.
```bash
pip install fastapi uvicorn twilio httpx pypdf2
python -m uvicorn main:app --port 8000 --reload
# Starts the webhook daemon on http://localhost:8000
```
*To expose the local python server to Twilio, you can run:*
`npx localtunnel --port 8000`

---

## 🧠 System Architecture

```text
User uploads Document
        │
        ▼
   Raw Text Extraction (pdf-parse / PyPDF2)
        │
   [ Initiating Multi-Agent Swarm ]
        ├──▶ 🕵🏻 Extractor Agent (Summaries & Parties)
        ├──▶ ⚖️ Risk Agent (Red Flags & Score / 10)
        └──▶ 📋 Drafter Agent (Missing Clauses & Obligations)
        │
        ▼
   [ Aggregation Engine ]
        │
        ▼
   Rich Interactive Dashboard / WhatsApp Reply
```

---

## ⚠️ Disclaimer
*LexAI provides AI-generated legal information for educational purposes only. It is **not a substitute for advice from a qualified legal professional**. Always consult a lawyer before signing important legal documents.*

<div align="center">
  <p><i>Built with ❤️ for the Hackathon — Agentic AI Track</i></p>
</div>
