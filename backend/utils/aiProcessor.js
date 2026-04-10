const Groq = require("groq-sdk");
const prompts = require("../prompts/legalPrompts");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

// Truncate document text to stay within Groq free tier TPM limits
function truncateText(text, maxChars = 12000) {
  if (text.length <= maxChars) return text;
  return text.substring(0, maxChars) + "\n\n[Document truncated due to length — first " + maxChars + " characters analyzed]";
}

// Helper to wait before retrying on rate limits
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Robustly extract JSON from LLM output that may contain extra text, markdown, etc.
function extractJSON(text) {
  // Remove markdown code fences
  let cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  
  // Try direct parse first
  try { return JSON.parse(cleaned); } catch {}
  
  // Try to find JSON object by matching braces
  const firstBrace = cleaned.indexOf("{");
  if (firstBrace === -1) throw new Error("No JSON found in response");
  
  let depth = 0;
  let lastBrace = -1;
  for (let i = firstBrace; i < cleaned.length; i++) {
    if (cleaned[i] === "{") depth++;
    else if (cleaned[i] === "}") {
      depth--;
      if (depth === 0) { lastBrace = i; break; }
    }
  }
  
  if (lastBrace === -1) throw new Error("Incomplete JSON in response");
  
  const jsonStr = cleaned.substring(firstBrace, lastBrace + 1);
  try { return JSON.parse(jsonStr); } catch {}
  
  // Last resort: try fixing common issues (trailing commas, etc.)
  const fixed = jsonStr
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]")
    .replace(/[\x00-\x1F\x7F]/g, " "); // Remove control characters
  return JSON.parse(fixed);
}

async function ask(system, user, retries = 2) {
  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 8192,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
    });
    return response.choices[0].message.content.trim();
  } catch (err) {
    if (err.status === 429 && retries > 0) {
      console.log("Rate limited, waiting 60 seconds before retry...");
      await sleep(60000);
      return ask(system, user, retries - 1);
    }
    throw err;
  }
}

async function analyzeDocument(documentText, language = "English") {
  const truncated = truncateText(documentText);

  console.log("🚀 Agent 1/3: Extracting structural metadata...");
  const prompt1 = prompts.extractionAgent(truncated, language);
  const raw1 = await ask(prompt1.system, prompt1.user);
  let extractionResult = {};
  try { extractionResult = extractJSON(raw1); } catch (e) { console.error("Extract Agent Failed"); }

  console.log("⚖️ Agent 2/3: Searching for legal risks...");
  const prompt2 = prompts.riskAgent(truncated, language);
  const raw2 = await ask(prompt2.system, prompt2.user);
  let riskResult = {};
  try { riskResult = extractJSON(raw2); } catch (e) { console.error("Risk Agent Failed"); }

  console.log("📋 Agent 3/3: Parsing obligations & clauses...");
  const prompt3 = prompts.obligationsAgent(truncated, language);
  const raw3 = await ask(prompt3.system, prompt3.user);
  let obResult = {};
  try { obResult = extractJSON(raw3); } catch (e) { console.error("Obligations Agent Failed"); }

  // Combine swarm results into a single unified JSON object for the frontend
  return {
    documentType: extractionResult.documentType || "Unknown",
    summary: extractionResult.summary || "Summary generation failed.",
    partiesInvolved: extractionResult.partiesInvolved || [],
    keyDates: extractionResult.keyDates || [],
    
    risks: riskResult.risks || [],
    overallRiskScore: riskResult.overallRiskScore || 0,
    recommendation: riskResult.recommendation || "Unable to formulate recommendation.",
    redFlags: riskResult.redFlags || [],
    
    obligations: obResult.obligations || [],
    importantClauses: obResult.importantClauses || [],
    missingClauses: obResult.missingClauses || []
  };
}

async function chatWithDocument(documentText, userQuestion, chatHistory = [], language = "English") {
  const truncated = truncateText(documentText, 6000);
  const prompt = prompts.chat(truncated, userQuestion, chatHistory, language);
  const messages = [
    { role: "system", content: prompt.system },
    ...prompt.messages
  ];
  try {
    const response = await client.chat.completions.create({
      model: MODEL, max_tokens: 4096, messages,
    });
    return response.choices[0].message.content.trim();
  } catch (err) {
    if (err.status === 429) {
      console.log("Rate limited on chat, waiting 60 seconds...");
      await sleep(60000);
      const response = await client.chat.completions.create({
        model: MODEL, max_tokens: 4096, messages,
      });
      return response.choices[0].message.content.trim();
    }
    throw err;
  }
}

async function simplifyClause(clauseText, language = "English") {
  const prompt = prompts.simplifyClause(clauseText, language);
  const raw = await ask(prompt.system, prompt.user);
  return extractJSON(raw);
}

async function explainRisk(riskTitle, context, language = "English") {
  const prompt = prompts.riskDeepDive(riskTitle, context, language);
  const raw = await ask(prompt.system, prompt.user);
  return extractJSON(raw);
}

async function generateDocument(templateType, details) {
  const prompt = prompts.generateDocument(templateType, details);
  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 8192,
      messages: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user }
      ],
    });
    return response.choices[0].message.content.trim();
  } catch (err) {
    if (err.status === 429) {
      console.log("Rate limited on generate, waiting 60 seconds...");
      await sleep(60000);
      const response = await client.chat.completions.create({
        model: MODEL,
        max_tokens: 8192,
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user }
        ],
      });
      return response.choices[0].message.content.trim();
    }
    throw err;
  }
}

module.exports = { analyzeDocument, chatWithDocument, simplifyClause, explainRisk, generateDocument };
