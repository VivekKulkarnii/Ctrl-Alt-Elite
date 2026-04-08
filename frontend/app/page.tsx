"use client";
import { useState } from "react";
import UploadZone from "./components/UploadZone";
import AnalysisPanel from "./components/AnalysisPanel";
import ChatInterface from "./components/ChatInterface";
import Header from "./components/Header";
import DocumentGenerator from "./components/DocumentGenerator";

export type Analysis = {
  documentType: string;
  summary: string;
  partiesInvolved: string[];
  keyDates: { label: string; date: string; importance: string }[];
  risks: {
    id: string;
    title: string;
    description: string;
    severity: "high" | "medium" | "low";
    clause: string;
    suggestion: string;
  }[];
  obligations: {
    id: string;
    party: string;
    obligation: string;
    deadline: string | null;
    clause: string;
  }[];
  importantClauses: {
    id: string;
    title: string;
    original: string;
    simplified: string;
    type: "favorable" | "unfavorable" | "neutral";
    importance: string;
  }[];
  missingClauses: string[];
  overallRiskScore: number;
  recommendation: string;
  redFlags: string[];
};

export const SUPPORTED_LANGUAGES = [
  { code: "English", label: "English", native: "English", flag: "🇬🇧" },
  { code: "Hindi", label: "Hindi", native: "हिंदी", flag: "🇮🇳" },
  { code: "Kannada", label: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "Tamil", label: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "Telugu", label: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "Malayalam", label: "Malayalam", native: "മലയാളം", flag: "🇮🇳" },
  { code: "Marathi", label: "Marathi", native: "मराठी", flag: "🇮🇳" },
  { code: "Bengali", label: "Bengali", native: "বাংলা", flag: "🇮🇳" },
  { code: "Gujarati", label: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
  { code: "Punjabi", label: "Punjabi", native: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "Odia", label: "Odia", native: "ଓଡ଼ିଆ", flag: "🇮🇳" },
];

export default function Home() {
  const [mode, setMode] = useState<"analyze" | "generate">("analyze");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [documentText, setDocumentText] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"analysis" | "chat">("analysis");
  const [language, setLanguage] = useState<string>("English");

  const handleAnalysisComplete = (
    result: Analysis,
    text: string,
    name: string
  ) => {
    setAnalysis(result);
    setDocumentText(text);
    setFileName(name);
    setActiveTab("analysis");
  };

  const handleReset = () => {
    setAnalysis(null);
    setDocumentText("");
    setFileName("");
    setActiveTab("analysis");
  };

  return (
    <div className="min-h-screen" style={{ background: "#0f0f1a" }}>
      <Header mode={mode} onModeChange={setMode} onReset={handleReset} language={language} onLanguageChange={setLanguage} />

      <main className="max-w-7xl mx-auto px-4 pb-16">
        {mode === "generate" ? (
          <DocumentGenerator />
        ) : (
          <>
            {!analysis ? (
              <UploadZone
                onAnalysisComplete={handleAnalysisComplete}
                isAnalyzing={isAnalyzing}
                setIsAnalyzing={setIsAnalyzing}
                language={language}
              />
            ) : (
              <div className="mt-6">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white/40">Analyzing:</span>
                    <span
                      className="text-sm font-mono px-3 py-1 rounded-full"
                      style={{
                        background: "rgba(200,150,62,0.15)",
                        color: "#C8963E",
                        border: "1px solid rgba(200,150,62,0.3)",
                      }}
                    >
                      {fileName}
                    </span>
                    {language !== "English" && (
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          background: "rgba(147,197,253,0.1)",
                          color: "#93C5FD",
                          border: "1px solid rgba(147,197,253,0.2)",
                        }}
                      >
                        🌐 {SUPPORTED_LANGUAGES.find(l => l.code === language)?.native || language}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Tab switcher */}
                    <div
                      className="flex rounded-lg p-1"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <button
                        onClick={() => setActiveTab("analysis")}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                          activeTab === "analysis"
                            ? "text-ink"
                            : "text-white/50 hover:text-white/80"
                        }`}
                        style={
                          activeTab === "analysis"
                            ? { background: "#C8963E" }
                            : {}
                        }
                      >
                        📋 Analysis
                      </button>
                      <button
                        onClick={() => setActiveTab("chat")}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                          activeTab === "chat"
                            ? "text-ink"
                            : "text-white/50 hover:text-white/80"
                        }`}
                        style={
                          activeTab === "chat" ? { background: "#C8963E" } : {}
                        }
                      >
                        💬 Ask LexAI
                      </button>
                    </div>

                    <button
                      onClick={handleReset}
                      className="text-sm px-4 py-2 rounded-lg border transition-all hover:bg-white/5"
                      style={{
                        borderColor: "rgba(255,255,255,0.15)",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      ↩ New Document
                    </button>
                  </div>
                </div>

                {/* Content */}
                {activeTab === "analysis" ? (
                  <AnalysisPanel analysis={analysis} />
                ) : (
                  <ChatInterface
                    documentText={documentText}
                    analysis={analysis}
                    language={language}
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
