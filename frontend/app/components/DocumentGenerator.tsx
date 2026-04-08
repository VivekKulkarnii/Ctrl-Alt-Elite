"use client";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// ─── Template Definitions ───────────────────────────────────────────
const TEMPLATES = [
  {
    id: "nda",
    name: "Non-Disclosure Agreement",
    icon: "📝",
    description: "Protect confidential information shared between parties",
    color: "#8B5CF6",
    fields: [
      { key: "disclosingParty", label: "Disclosing Party (Full Name)", type: "text", placeholder: "e.g., Acme Technologies Pvt. Ltd." },
      { key: "receivingParty", label: "Receiving Party (Full Name)", type: "text", placeholder: "e.g., John Doe" },
      { key: "purpose", label: "Purpose of Disclosure", type: "text", placeholder: "e.g., Evaluating a potential business partnership" },
      { key: "effectiveDate", label: "Effective Date", type: "date", placeholder: "" },
      { key: "duration", label: "Confidentiality Duration", type: "text", placeholder: "e.g., 2 years" },
      { key: "jurisdiction", label: "Governing Jurisdiction", type: "text", placeholder: "e.g., Bangalore, Karnataka, India" },
    ],
  },
  {
    id: "rental",
    name: "Rental / Lease Agreement",
    icon: "🏠",
    description: "Formalize terms between landlord and tenant",
    color: "#10B981",
    fields: [
      { key: "landlordName", label: "Landlord Name", type: "text", placeholder: "e.g., Rajesh Kumar" },
      { key: "tenantName", label: "Tenant Name", type: "text", placeholder: "e.g., Priya Sharma" },
      { key: "propertyAddress", label: "Property Address", type: "text", placeholder: "e.g., #42, 3rd Cross, Indiranagar, Bangalore" },
      { key: "monthlyRent", label: "Monthly Rent (₹)", type: "text", placeholder: "e.g., ₹25,000" },
      { key: "securityDeposit", label: "Security Deposit (₹)", type: "text", placeholder: "e.g., ₹1,00,000" },
      { key: "leaseStart", label: "Lease Start Date", type: "date", placeholder: "" },
      { key: "leaseDuration", label: "Lease Duration", type: "text", placeholder: "e.g., 11 months" },
      { key: "maintenanceCharges", label: "Maintenance Charges", type: "text", placeholder: "e.g., ₹3,000 per month" },
    ],
  },
  {
    id: "employment",
    name: "Employment Contract",
    icon: "💼",
    description: "Define terms of employment between employer and employee",
    color: "#3B82F6",
    fields: [
      { key: "employerName", label: "Employer / Company Name", type: "text", placeholder: "e.g., TechCorp India Pvt. Ltd." },
      { key: "employeeName", label: "Employee Name", type: "text", placeholder: "e.g., Amit Patel" },
      { key: "position", label: "Position / Job Title", type: "text", placeholder: "e.g., Senior Software Engineer" },
      { key: "salary", label: "Annual Salary", type: "text", placeholder: "e.g., ₹18,00,000 per annum" },
      { key: "startDate", label: "Start Date", type: "date", placeholder: "" },
      { key: "probationPeriod", label: "Probation Period", type: "text", placeholder: "e.g., 6 months" },
      { key: "noticePeriod", label: "Notice Period", type: "text", placeholder: "e.g., 30 days" },
      { key: "workLocation", label: "Work Location", type: "text", placeholder: "e.g., Bangalore, Karnataka" },
    ],
  },
  {
    id: "service",
    name: "Service Agreement",
    icon: "🤝",
    description: "Outline terms for freelance or consulting services",
    color: "#F59E0B",
    fields: [
      { key: "clientName", label: "Client Name", type: "text", placeholder: "e.g., StartupXYZ Inc." },
      { key: "providerName", label: "Service Provider Name", type: "text", placeholder: "e.g., Freelancer Jane" },
      { key: "servicesDescription", label: "Description of Services", type: "text", placeholder: "e.g., UI/UX design for mobile application" },
      { key: "paymentAmount", label: "Total Payment Amount", type: "text", placeholder: "e.g., ₹2,50,000" },
      { key: "paymentTerms", label: "Payment Terms", type: "text", placeholder: "e.g., 50% upfront, 50% on completion" },
      { key: "projectDuration", label: "Project Duration", type: "text", placeholder: "e.g., 3 months" },
      { key: "startDate", label: "Start Date", type: "date", placeholder: "" },
    ],
  },
  {
    id: "poa",
    name: "Power of Attorney",
    icon: "📜",
    description: "Authorize someone to act on your behalf legally",
    color: "#EF4444",
    fields: [
      { key: "principalName", label: "Principal Name (Grantor)", type: "text", placeholder: "e.g., Suresh Menon" },
      { key: "agentName", label: "Agent Name (Attorney-in-Fact)", type: "text", placeholder: "e.g., Meera Menon" },
      { key: "powersGranted", label: "Powers Granted", type: "text", placeholder: "e.g., Managing real estate, signing documents, banking transactions" },
      { key: "effectiveDate", label: "Effective Date", type: "date", placeholder: "" },
      { key: "expiration", label: "Expiration", type: "text", placeholder: "e.g., 1 year from effective date, or upon revocation" },
      { key: "jurisdiction", label: "Jurisdiction", type: "text", placeholder: "e.g., Mumbai, Maharashtra, India" },
    ],
  },
  {
    id: "partnership",
    name: "Partnership Agreement",
    icon: "🏢",
    description: "Establish terms between business partners",
    color: "#06B6D4",
    fields: [
      { key: "partner1Name", label: "Partner 1 Name", type: "text", placeholder: "e.g., Rahul Verma" },
      { key: "partner2Name", label: "Partner 2 Name", type: "text", placeholder: "e.g., Sneha Gupta" },
      { key: "businessName", label: "Business / Firm Name", type: "text", placeholder: "e.g., VG Enterprises" },
      { key: "businessType", label: "Nature of Business", type: "text", placeholder: "e.g., E-commerce retail" },
      { key: "capitalContributions", label: "Capital Contributions", type: "text", placeholder: "e.g., Partner 1: ₹5,00,000, Partner 2: ₹5,00,000" },
      { key: "profitSplit", label: "Profit/Loss Sharing Ratio", type: "text", placeholder: "e.g., 50:50" },
      { key: "startDate", label: "Partnership Start Date", type: "date", placeholder: "" },
      { key: "jurisdiction", label: "Jurisdiction", type: "text", placeholder: "e.g., Delhi, India" },
    ],
  },
];

type Step = "pick" | "form" | "preview";

interface Template {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  fields: { key: string; label: string; type: string; placeholder: string }[];
}

export default function DocumentGenerator() {
  const [step, setStep] = useState<Step>("pick");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedDoc, setGeneratedDoc] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    // Initialize form data with empty strings
    const initial: Record<string, string> = {};
    template.fields.forEach((f) => (initial[f.key] = ""));
    setFormData(initial);
    setStep("form");
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;

    // Check required fields
    const emptyFields = selectedTemplate.fields.filter((f) => !formData[f.key]?.trim());
    if (emptyFields.length > 0) {
      setError(`Please fill in: ${emptyFields.map((f) => f.label).join(", ")}`);
      return;
    }

    setIsGenerating(true);
    setError(null);

    setLoadingStep("Preparing your details...");
    setTimeout(() => setLoadingStep("Drafting document structure..."), 2000);
    setTimeout(() => setLoadingStep("Writing legal clauses..."), 4000);
    setTimeout(() => setLoadingStep("Adding standard provisions..."), 6000);
    setTimeout(() => setLoadingStep("Finalizing document..."), 8000);

    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateType: selectedTemplate.name,
          details: formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      setGeneratedDoc(data.generatedDocument);
      setStep("preview");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsGenerating(false);
      setLoadingStep("");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${selectedTemplate?.name || "Legal Document"}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500&display=swap');
          body {
            font-family: 'DM Sans', Georgia, serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 40px;
            line-height: 1.8;
            color: #1a1a2e;
            font-size: 14px;
          }
          h1, h2, h3 { font-family: 'DM Serif Display', Georgia, serif; }
          pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; font-size: inherit; line-height: inherit; }
        </style>
      </head>
      <body>
        <pre>${generatedDoc.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const handleReset = () => {
    setStep("pick");
    setSelectedTemplate(null);
    setFormData({});
    setGeneratedDoc("");
    setError(null);
  };

  // ─── LOADING STATE ──────────────────────────────────────────────────
  if (isGenerating) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl glow-gold"
            style={{ background: "rgba(200,150,62,0.15)", border: "2px solid rgba(200,150,62,0.4)" }}
          >
            📝
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
            LexAI is drafting your document
          </h2>
          <p className="text-white/50 text-sm">{loadingStep || "Generating..."}</p>
        </div>
        <div className="flex gap-2">
          {["Structuring", "Drafting", "Adding Clauses", "Finalizing"].map((s, i) => (
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

  // ─── STEP 1: TEMPLATE PICKER ────────────────────────────────────────
  if (step === "pick") {
    return (
      <div className="max-w-4xl mx-auto mt-12">
        <div className="text-center mb-10">
          <h1
            className="font-display text-5xl md:text-6xl mb-4 leading-tight"
            style={{ color: "#F5F0E8" }}
          >
            Generate a
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
            Choose a template, fill in your details, and get a professional document instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className="group text-left p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${template.color}55`;
                e.currentTarget.style.background = `${template.color}08`;
                e.currentTarget.style.boxShadow = `0 0 30px ${template.color}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="text-3xl mb-3">{template.icon}</div>
              <h3 className="font-medium text-base mb-1.5" style={{ color: "#F5F0E8" }}>
                {template.name}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                {template.description}
              </p>
              <div
                className="mt-4 text-xs font-mono"
                style={{ color: template.color }}
              >
                {template.fields.length} fields →
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── STEP 2: DYNAMIC FORM ──────────────────────────────────────────
  if (step === "form" && selectedTemplate) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        {/* Back button */}
        <button
          onClick={() => setStep("pick")}
          className="text-sm mb-6 flex items-center gap-2 transition-all hover:opacity-80"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          ← Back to templates
        </button>

        {/* Header */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{
            background: `${selectedTemplate.color}08`,
            border: `1px solid ${selectedTemplate.color}30`,
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="text-3xl w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: `${selectedTemplate.color}15` }}
            >
              {selectedTemplate.icon}
            </div>
            <div>
              <h2 className="text-xl font-display" style={{ color: "#F5F0E8" }}>
                {selectedTemplate.name}
              </h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                Fill in the details below to generate your document
              </p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {selectedTemplate.fields.map((field) => (
            <div key={field.key}>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {field.label}
              </label>
              <input
                type={field.type}
                value={formData[field.key] || ""}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#F5F0E8",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = `${selectedTemplate.color}60`;
                  e.target.style.boxShadow = `0 0 0 3px ${selectedTemplate.color}15`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.12)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          ))}
        </div>

        {/* Error */}
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

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="w-full mt-8 py-4 rounded-xl text-base font-semibold transition-all hover:opacity-90 hover:scale-[1.01]"
          style={{
            background: `linear-gradient(135deg, ${selectedTemplate.color}, ${selectedTemplate.color}CC)`,
            color: "#fff",
            boxShadow: `0 4px 20px ${selectedTemplate.color}30`,
          }}
        >
          ⚖️ Generate {selectedTemplate.name}
        </button>

        <p className="text-xs mt-3 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
          AI-generated document for reference only. Consult a lawyer before using for legal purposes.
        </p>
      </div>
    );
  }

  // ─── STEP 3: DOCUMENT PREVIEW ──────────────────────────────────────
  if (step === "preview") {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedTemplate?.icon}</span>
            <div>
              <h2 className="text-lg font-display" style={{ color: "#F5F0E8" }}>
                {selectedTemplate?.name}
              </h2>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                Generated by LexAI
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{
                background: "rgba(200,150,62,0.15)",
                border: "1px solid rgba(200,150,62,0.3)",
                color: "#C8963E",
              }}
            >
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
              style={{ background: "#C8963E", color: "#0f0f1a" }}
            >
              📥 Download PDF
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg text-sm border transition-all hover:bg-white/5"
              style={{
                borderColor: "rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              ↩ New Document
            </button>
          </div>
        </div>

        {/* Document */}
        <div
          className="rounded-2xl p-8 md:p-12"
          style={{
            background: "rgba(245,240,232,0.04)",
            border: "1px solid rgba(200,150,62,0.2)",
            boxShadow: "0 4px 40px rgba(0,0,0,0.3)",
          }}
        >
          <pre
            className="whitespace-pre-wrap text-sm leading-relaxed font-body"
            style={{
              color: "rgba(255,255,255,0.85)",
              fontFamily: "'DM Sans', Georgia, serif",
            }}
          >
            {generatedDoc}
          </pre>
        </div>

        <p className="text-xs mt-4 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
          ⚠️ This document is AI-generated for reference purposes. Always have a qualified lawyer review before signing.
        </p>
      </div>
    );
  }

  return null;
}
