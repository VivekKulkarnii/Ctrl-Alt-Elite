"use client";
import { useState } from "react";
import type { Analysis } from "../page";

interface Props {
  analysis: Analysis;
}

const SEVERITY_STYLES = {
  high: { bg: "rgba(220,38,38,0.12)", border: "rgba(220,38,38,0.35)", text: "#FCA5A5", dot: "#DC2626", label: "HIGH RISK" },
  medium: { bg: "rgba(217,119,6,0.12)", border: "rgba(217,119,6,0.35)", text: "#FCD34D", dot: "#D97706", label: "MEDIUM" },
  low: { bg: "rgba(22,163,74,0.12)", border: "rgba(22,163,74,0.35)", text: "#86EFAC", dot: "#16A34A", label: "LOW" },
};

const CLAUSE_TYPE_STYLES = {
  favorable: { color: "#86EFAC", icon: "✅" },
  unfavorable: { color: "#FCA5A5", icon: "⚠️" },
  neutral: { color: "#93C5FD", icon: "ℹ️" },
};

function RiskMeter({ score }: { score: number }) {
  const color = score >= 7 ? "#DC2626" : score >= 4 ? "#D97706" : "#16A34A";
  const label = score >= 7 ? "HIGH RISK" : score >= 4 ? "MODERATE" : "LOW RISK";
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="15.9" fill="none"
            stroke={color} strokeWidth="3" strokeLinecap="round"
            strokeDasharray={`${score * 10} 100`}
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold font-display" style={{ color }}>{score}</span>
        </div>
      </div>
      <div>
        <div className="text-xs font-mono tracking-widest mb-1" style={{ color }}>
          {label}
        </div>
        <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Risk Score /10</div>
      </div>
    </div>
  );
}

export default function AnalysisPanel({ analysis }: Props) {
  const [activeSection, setActiveSection] = useState<"overview" | "risks" | "obligations" | "clauses">("overview");
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);

  const tabs = [
    { id: "overview", label: "📊 Overview", count: null },
    { id: "risks", label: "⚠️ Risks", count: analysis?.risks?.length || 0 },
    { id: "obligations", label: "📋 Obligations", count: analysis?.obligations?.length || 0},
    { id: "clauses", label: "📌 Key Clauses", count: analysis?.importantClauses?.length || 0},
  ] as const;

  return (
    <div className="animate-fade-up">
      {/* Summary card */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,150,62,0.2)" }}
      >
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex-1">
            <div
              className="text-xs font-mono tracking-widest mb-2 uppercase"
              style={{ color: "#C8963E" }}
            >
              {analysis.documentType}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
              {analysis.summary}
            </p>
            {analysis?.redFlags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {analysis?.redFlags?.map((flag, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(220,38,38,0.12)",
                      border: "1px solid rgba(220,38,38,0.3)",
                      color: "#FCA5A5",
                    }}
                  >
                    🚩 {flag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <RiskMeter score={analysis.overallRiskScore} />
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl mb-6"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
            style={
              activeSection === tab.id
                ? { background: "rgba(200,150,62,0.2)", color: "#C8963E", border: "1px solid rgba(200,150,62,0.3)" }
                : { color: "rgba(255,255,255,0.4)" }
            }
          >
            {tab.label}
            {tab.count !== null && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  background: activeSection === tab.id ? "rgba(200,150,62,0.3)" : "rgba(255,255,255,0.1)",
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeSection === "overview" && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Parties */}
          <div
            className="p-5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <h3 className="font-medium mb-3 text-sm" style={{ color: "#C8963E" }}>👥 Parties Involved</h3>
            <ul className="space-y-2">
              {analysis?.partiesInvolved?.map((p, i) => (
                <li key={i} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(200,150,62,0.2)", color: "#C8963E" }}>
                    {i + 1}
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Key Dates */}
          <div
            className="p-5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <h3 className="font-medium mb-3 text-sm" style={{ color: "#C8963E" }}>📅 Key Dates</h3>
            {analysis?.keyDates?.length === 0 ? (
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>No specific dates found</p>
            ) : (
              <ul className="space-y-2">
                {analysis?.keyDates?.map((d, i) => (
                  <li key={i} className="flex items-start justify-between text-sm gap-2">
                    <span style={{ color: "rgba(255,255,255,0.6)" }}>{d.label}</span>
                    <span className="font-mono text-xs" style={{ color: "#C8963E" }}>{d.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Missing clauses */}
          {analysis?.missingClauses?.length > 0 && (
            <div
              className="md:col-span-2 p-5 rounded-xl"
              style={{
                background: "rgba(217,119,6,0.06)",
                border: "1px solid rgba(217,119,6,0.2)",
              }}
            >
              <h3 className="font-medium mb-3 text-sm" style={{ color: "#FCD34D" }}>
                🔍 Missing Clauses (Usually Present)
              </h3>
              <ul className="space-y-1">
                {analysis?.missingClauses?.map((c, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                    <span style={{ color: "#D97706" }}>—</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendation */}
          <div
            className="md:col-span-2 p-5 rounded-xl"
            style={{
              background: "rgba(200,150,62,0.06)",
              border: "1px solid rgba(200,150,62,0.2)",
            }}
          >
            <h3 className="font-medium mb-2 text-sm" style={{ color: "#C8963E" }}>⚖️ LexAI Recommendation</h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
              {analysis.recommendation}
            </p>
          </div>
        </div>
      )}

      {/* RISKS */}
      {activeSection === "risks" && (
        <div className="space-y-3">
          {analysis?.risks?.length === 0 ? (
            <div className="text-center py-12" style={{ color: "rgba(255,255,255,0.4)" }}>
              ✅ No major risks detected
            </div>
          ) : (
            analysis?.risks?.map((risk) => {
              const style = SEVERITY_STYLES[risk.severity];
              const isOpen = expandedRisk === risk.id;
              return (
                <div
                  key={risk.id}
                  className="rounded-xl overflow-hidden cursor-pointer transition-all"
                  style={{ background: style.bg, border: `1px solid ${style.border}` }}
                  onClick={() => setExpandedRisk(isOpen ? null : risk.id)}
                >
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: style.dot }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm" style={{ color: style.text }}>
                            {risk.title}
                          </span>
                          <span
                            className="text-xs font-mono px-2 py-0.5 rounded"
                            style={{ background: `${style.dot}22`, color: style.dot }}
                          >
                            {style.label}
                          </span>
                        </div>
                        {risk.clause && (
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {risk.clause}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-white/30">{isOpen ? "▲" : "▼"}</span>
                  </div>

                  {isOpen && (
                    <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                      <p className="text-sm pt-3" style={{ color: "rgba(255,255,255,0.7)" }}>
                        {risk.description}
                      </p>
                      <div
                        className="text-sm p-3 rounded-lg"
                        style={{ background: "rgba(200,150,62,0.1)", border: "1px solid rgba(200,150,62,0.2)" }}
                      >
                        <span style={{ color: "#C8963E" }}>💡 Suggestion: </span>
                        <span style={{ color: "rgba(255,255,255,0.7)" }}>{risk.suggestion}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* OBLIGATIONS */}
      {activeSection === "obligations" && (
        <div className="space-y-3">
          {analysis?.obligations?.map((ob) => (
            <div
              key={ob.id}
              className="p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="text-xs px-2 py-1 rounded-full font-mono flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(147,197,253,0.1)", color: "#93C5FD", border: "1px solid rgba(147,197,253,0.2)" }}
                >
                  {ob.party}
                </div>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>{ob.obligation}</p>
                  <div className="flex gap-4 mt-2 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {ob.deadline && <span>⏰ {ob.deadline}</span>}
                    {ob.clause && <span>📄 {ob.clause}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KEY CLAUSES */}
      {activeSection === "clauses" && (
        <div className="space-y-3">
          {analysis?.importantClauses?.map((clause) => {
const typeStyle = CLAUSE_TYPE_STYLES[clause?.type] || {
  color: "#ccc",
  icon: "📄"
};            return (
              <div
                key={clause.id}
                className="p-5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
<span>{typeStyle?.icon || "📄"}</span>                    
<span className="font-medium text-sm" style={{ color: "#F5F0E8" }}>
                      {clause.title}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full capitalize"
                      style={{ color: typeStyle.color, background: `${typeStyle.color}18` }}
                    >
                      {clause.type}
                    </span>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded font-mono capitalize flex-shrink-0"
                    style={{ color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.06)" }}
                  >
                    {clause.importance}
                  </span>
                </div>
                <p
                  className="text-xs font-mono p-2 rounded mb-2"
                  style={{ background: "rgba(0,0,0,0.3)", color: "rgba(255,255,255,0.4)" }}
                >
                  "{clause.original}..."
                </p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {clause.simplified}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
