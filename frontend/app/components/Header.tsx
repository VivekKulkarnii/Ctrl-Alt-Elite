"use client";
import { useState, useRef, useEffect } from "react";
import { SUPPORTED_LANGUAGES } from "../constants";
import Flag from "react-world-flags";

interface HeaderProps {
  mode: "analyze" | "generate";
  onModeChange: (mode: "analyze" | "generate") => void;
  onReset: () => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

export default function Header({ mode, onModeChange, onReset, language, onLanguageChange }: HeaderProps) {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const handleModeSwitch = (newMode: "analyze" | "generate") => {
    if (newMode !== mode) {
      onReset();
      onModeChange(newMode);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header
      className="border-b sticky top-0 z-50"
      style={{
        background: "rgba(15,15,26,0.95)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(200,150,62,0.2)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold"
            style={{ background: "linear-gradient(135deg, #C8963E, #8B1A1A)" }}
          >
            ⚖
          </div>
          <div>
            <div
              className="font-display text-xl leading-none"
              style={{ color: "#C8963E" }}
            >
              LexAI
            </div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              Legal Document Intelligence
            </div>
          </div>
        </div>

        {/* Mode toggle */}
        <div
          className="flex rounded-xl p-1"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <button
            onClick={() => handleModeSwitch("analyze")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "analyze" ? "" : "hover:bg-white/5"
            }`}
            style={
              mode === "analyze"
                ? {
                    background: "linear-gradient(135deg, #C8963E, #A07030)",
                    color: "#0f0f1a",
                    boxShadow: "0 2px 10px rgba(200,150,62,0.3)",
                  }
                : { color: "rgba(255,255,255,0.45)" }
            }
          >
            🔍 Analyze
          </button>
          <button
            onClick={() => handleModeSwitch("generate")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "generate" ? "" : "hover:bg-white/5"
            }`}
            style={
              mode === "generate"
                ? {
                    background: "linear-gradient(135deg, #C8963E, #A07030)",
                    color: "#0f0f1a",
                    boxShadow: "0 2px 10px rgba(200,150,62,0.3)",
                  }
                : { color: "rgba(255,255,255,0.45)" }
            }
          >
            📝 Generate
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:bg-white/5"
              style={{
                background: isLangOpen ? "rgba(200,150,62,0.15)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${isLangOpen ? "rgba(200,150,62,0.4)" : "rgba(255,255,255,0.08)"}`,
                color: isLangOpen ? "#C8963E" : "rgba(255,255,255,0.6)",
              }}
            >
              <span className="w-5 h-3.5 flex-shrink-0 flex items-center overflow-hidden rounded-[2px]">
                <Flag code={currentLang.flag} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </span>
              <span>{currentLang.native}</span>
              <span className="text-xs opacity-50">{isLangOpen ? "▲" : "▼"}</span>
            </button>

            {isLangOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 rounded-xl py-2 z-50 max-h-80 overflow-y-auto"
                style={{
                  background: "rgba(20,20,35,0.98)",
                  border: "1px solid rgba(200,150,62,0.3)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div className="px-3 py-1.5 mb-1">
                  <span className="text-xs font-mono tracking-widest" style={{ color: "rgba(200,150,62,0.6)" }}>
                    🌐 RESPONSE LANGUAGE
                  </span>
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setIsLangOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm flex items-center gap-3 transition-all hover:bg-white/5"
                    style={{
                      color: language === lang.code ? "#C8963E" : "rgba(255,255,255,0.7)",
                      background: language === lang.code ? "rgba(200,150,62,0.1)" : "transparent",
                    }}
                  >
                    <span className="w-5 h-3.5 flex-shrink-0 flex items-center overflow-hidden rounded-[2px]">
                      <Flag code={lang.flag} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </span>
                    <span className="flex-1">{lang.label}</span>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{lang.native}</span>
                    {language === lang.code && (
                      <span style={{ color: "#C8963E" }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            <span>📄 PDF &amp; Text</span>
            <span>🔒 Private</span>
            <span>⚡ Instant</span>
          </div>
        </div>
      </div>
    </header>
  );
}
