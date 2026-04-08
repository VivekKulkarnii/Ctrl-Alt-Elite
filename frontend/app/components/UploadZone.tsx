"use client";
import { useState, useCallback, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface UploadZoneProps {
  onAnalysisComplete: (analysis: any, text: string, name: string) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (v: boolean) => void;
  language: string;
}

const SAMPLE_CONTRACT = `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into as of January 1, 2025, between TechCorp Inc. ("Company") and John Doe ("Employee").

1. POSITION: Employee shall serve as Senior Software Engineer.

2. COMPENSATION: Employee shall receive a base salary of $120,000 per year, paid bi-weekly.

3. NON-COMPETE: Employee agrees that for a period of 2 years following termination, Employee shall not engage in any business that competes with the Company within a 100-mile radius of any Company office, globally.

4. INTELLECTUAL PROPERTY: Any invention, discovery, or work created by Employee during employment or within 1 year after termination shall be the exclusive property of the Company, regardless of whether created using Company resources.

5. TERMINATION: Company may terminate Employee at will, with or without cause, without notice. Employee must provide 90 days notice for voluntary resignation.

6. ARBITRATION: Any dispute arising from this agreement shall be resolved through mandatory binding arbitration. Employee waives the right to a jury trial and class action lawsuits.

7. LIQUIDATED DAMAGES: If Employee violates the non-compete clause, Employee agrees to pay Company $500,000 in liquidated damages.

8. GOVERNING LAW: This agreement is governed by the laws of Delaware, regardless of Employee's location.`;

export default function UploadZone({
  onAnalysisComplete,
  isAnalyzing,
  setIsAnalyzing,
  language,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyze = useCallback(
    async (file?: File, rawText?: string) => {
      setIsAnalyzing(true);
      setError(null);

      try {
        let name = "Pasted Text";

        if (file) {
          name = file.name;
          setLoadingStep("Extracting document text...");
        } else if (rawText) {
          setLoadingStep("Processing text...");
        }

        setTimeout(() => setLoadingStep("Running AI analysis..."), 1500);
        setTimeout(() => setLoadingStep("Detecting risks and obligations..."), 3000);
        setTimeout(() => setLoadingStep(language !== "English" 
          ? `Translating results to ${language}...` 
          : "Building report..."), 5000);

        let response: Response;
        if (file) {
          const formData = new FormData();
          formData.append("document", file);
          formData.append("language", language);
          response = await fetch(`${API_URL}/api/analyze`, {
            method: "POST",
            body: formData,
          });
        } else {
          response = await fetch(`${API_URL}/api/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: rawText, language }),
          });
        }

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Analysis failed");

        onAnalysisComplete(data.analysis, data.extractedText, name);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsAnalyzing(false);
        setLoadingStep("");
      }
    },
    [onAnalysisComplete, setIsAnalyzing, language]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) analyze(file);
    },
    [analyze]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) analyze(file);
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl glow-gold"
            style={{ background: "rgba(200,150,62,0.15)", border: "2px solid rgba(200,150,62,0.4)" }}
          >
            ⚖️
          </div>
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: "#C8963E",
              borderRightColor: "transparent",
              borderBottomColor: "transparent",
              borderLeftColor: "transparent",
            }}
          />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-display mb-2" style={{ color: "#C8963E" }}>
            LexAI is reading your document
          </h2>
          <p className="text-white/50 text-sm">{loadingStep || "Analyzing..."}</p>
        </div>
        <div className="flex gap-2">
          {["Parsing", "Analyzing", "Detecting Risks", "Building Report"].map((s, i) => (
            <div
              key={s}
              className="text-xs px-3 py-1 rounded-full loading-shimmer"
              style={{
                background: "rgba(200,150,62,0.1)",
                color: "rgba(200,150,62,0.6)",
                border: "1px solid rgba(200,150,62,0.2)",
                animationDelay: `${i * 0.3}s`,
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-16">
      {/* Hero text */}
      <div className="text-center mb-12">
        <h1
          className="font-display text-5xl md:text-6xl mb-4 leading-tight"
          style={{ color: "#F5F0E8" }}
        >
          Understand Any
          <span
            className="block"
            style={{
              background: "linear-gradient(135deg, #C8963E, #E8B86D)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Legal Document
          </span>
        </h1>
        <p className="text-lg" style={{ color: "rgba(255,255,255,0.5)" }}>
          Upload a contract, rental agreement, or terms of service.
          <br />
          Get instant risk analysis, plain-English summaries, and expert Q&amp;A.
        </p>
        {language !== "English" && (
          <p className="text-sm mt-2" style={{ color: "#93C5FD" }}>
            🌐 Results will be in <strong>{language}</strong>
          </p>
        )}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="relative rounded-2xl p-12 text-center cursor-pointer transition-all"
        style={{
          border: `2px dashed ${isDragging ? "#C8963E" : "rgba(255,255,255,0.15)"}`,
          background: isDragging
            ? "rgba(200,150,62,0.05)"
            : "rgba(255,255,255,0.02)",
          boxShadow: isDragging ? "0 0 40px rgba(200,150,62,0.15)" : "none",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.doc,.docx"
          onChange={handleFileInput}
          className="hidden"
        />
        <div className="text-5xl mb-4">📄</div>
        <h3 className="text-xl font-medium mb-2" style={{ color: "#F5F0E8" }}>
          Drop your legal document here
        </h3>
        <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
          PDF, TXT, DOC, DOCX — up to 10MB
        </p>
        <button
          className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
          style={{ background: "#C8963E", color: "#0f0f1a" }}
        >
          Choose File
        </button>
      </div>

      {/* OR divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
        <span className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>or</span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
      </div>

      {/* Try sample */}
      <button
        onClick={() => analyze(undefined, SAMPLE_CONTRACT)}
        className="w-full py-3 rounded-xl text-sm font-medium transition-all hover:opacity-80"
        style={{
          background: "rgba(200,150,62,0.1)",
          border: "1px solid rgba(200,150,62,0.25)",
          color: "#C8963E",
        }}
      >
        🧪 Try with a sample employment contract
      </button>

      {error && (
        <div
          className="mt-4 p-4 rounded-lg text-sm"
          style={{
            background: "rgba(220,38,38,0.1)",
            border: "1px solid rgba(220,38,38,0.3)",
            color: "#FCA5A5",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-3 gap-4 mt-12">
        {[
          { icon: "🔍", label: "Risk Detection", desc: "Flags dangerous clauses automatically" },
          { icon: "📝", label: "Plain English", desc: "No legal jargon, just clear explanations" },
          { icon: "💬", label: "Q&A Mode", desc: "Ask anything about your document" },
        ].map((f) => (
          <div
            key={f.label}
            className="text-center p-4 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="text-2xl mb-2">{f.icon}</div>
            <div className="text-sm font-medium mb-1" style={{ color: "#F5F0E8" }}>{f.label}</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
