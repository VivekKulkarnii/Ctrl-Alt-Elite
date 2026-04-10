/**
 * Legal AI Prompts
 * These are the core prompt templates that power the agent's intelligence.
 */

const SYSTEM_PROMPT = `You are LexAI — an expert AI legal assistant with deep knowledge of contract law, 
tenant rights, employment law, and general legal practice. You communicate like a trusted lawyer friend: 
clear, direct, and genuinely protective of the user's interests.

Your core principles:
1. NEVER use jargon without explanation
2. ALWAYS flag risks proactively, even if not asked
3. Be specific — cite clause numbers/sections when referencing the document
4. Be honest if something is ambiguous or if the user needs a real lawyer
5. Your tone: calm, authoritative, and on the user's side`;

function getLanguageInstruction(language) {
  if (!language || language === "English") return "";
  return `\n\nIMPORTANT LANGUAGE INSTRUCTION: You MUST respond ENTIRELY in ${language}. 
All text in your response — including the summary, risk descriptions, obligation descriptions, 
clause explanations, suggestions, recommendations, and red flags — must be written in ${language}. 
Only keep proper nouns, legal terms in parentheses (with ${language} explanation), and JSON keys in English.
The JSON keys must remain in English, but ALL string values must be in ${language}.`;
}

const prompts = {
  /**
   * AGENT 1: The Extractor
   * Specializes in structural metadata and context summaries
   */
  extractionAgent: (documentText, language) => ({
    system: SYSTEM_PROMPT + getLanguageInstruction(language),
    user: `Analyze the administrative and context details of the following legal document. Return a valid JSON object with this EXACT structure:

{
  "documentType": "string (e.g., Rental Agreement, Employment Contract, NDA, Terms of Service)",
  "summary": "string - 3-4 sentence plain English summary of what this document is and what it does",
  "partiesInvolved": ["string array of all parties mentioned"],
  "keyDates": [
    { "label": "string", "date": "string", "importance": "high|medium|low" }
  ]
}

Return ONLY valid JSON. No markdown, no explanation outside JSON.${language && language !== "English" ? `\nREMEMBER: All string values in the JSON must be in ${language}. Only JSON keys stay in English.` : ""}

DOCUMENT:
${documentText}`,
  }),

  /**
   * AGENT 2: The Risk Analyst
   * Specializes in finding predatory clauses, hidden traps, and quantifying risk
   */
  riskAgent: (documentText, language) => ({
    system: SYSTEM_PROMPT + getLanguageInstruction(language),
    user: `Analyze the following legal document STRICTLY for risks, traps, and liabilities. Return a valid JSON object with this EXACT structure:

{
  "risks": [
    {
      "id": "R1",
      "title": "string - short risk title",
      "description": "string - what exactly is risky and why it severely hurts the user",
      "severity": "high|medium|low",
      "clause": "string - reference to clause/section if available",
      "suggestion": "string - actionable suggestion to fix or push back"
    }
  ],
  "overallRiskScore": "number between 1-10 (10 = extremely risky)",
  "recommendation": "string - final concluding recommendation based on detected risks",
  "redFlags": ["string array - dealbreakers or extremely unstandard clauses"]
}

Return ONLY valid JSON. No markdown, no explanation outside JSON.${language && language !== "English" ? `\nREMEMBER: All string values in the JSON must be in ${language}. Only JSON keys stay in English.` : ""}

DOCUMENT:
${documentText}`,
  }),

  /**
   * AGENT 3: The Legal Drafter
   * Specializes in extracting user duties and highlighting missing protections
   */
  obligationsAgent: (documentText, language) => ({
    system: SYSTEM_PROMPT + getLanguageInstruction(language),
    user: `Analyze the following legal document to map out duties and critical clauses. Return a valid JSON object with this EXACT structure:

{
  "obligations": [
    {
      "id": "O1",
      "party": "string - who has this obligation",
      "obligation": "string - plain English description of what they must do",
      "deadline": "string or null",
      "clause": "string - reference to clause/section"
    }
  ],
  "importantClauses": [
    {
      "id": "C1",
      "title": "string - clause name",
      "original": "string - brief excerpt from original text (max 100 chars)",
      "simplified": "string - plain English explanation",
      "type": "favorable|unfavorable|neutral",
      "importance": "high|medium|low"
    }
  ],
  "missingClauses": [
    "string - description of standard standard clauses that are absent but should normally be present in this type of document"
  ]
}

Return ONLY valid JSON. No markdown, no explanation outside JSON.${language && language !== "English" ? `\nREMEMBER: All string values in the JSON must be in ${language}. Only JSON keys stay in English.` : ""}

DOCUMENT:
${documentText}`,
  }),

  /**
   * PROMPT 2: Q&A Chat
   * Handles user questions in context of the document
   */
  chat: (documentText, userQuestion, chatHistory, language) => ({
    system: `${SYSTEM_PROMPT}${getLanguageInstruction(language)}

You have analyzed a legal document. The document text is provided below.
Answer the user's question based on this document. Be specific and cite relevant sections.
If the answer isn't in the document, say so clearly.
Keep answers concise but complete — typically 2-4 sentences unless more detail is warranted.
End with a proactive tip or warning if relevant.${language && language !== "English" ? `\nYou MUST respond in ${language}.` : ""}

DOCUMENT:
${documentText.substring(0, 8000)}`,
    messages: [
      ...chatHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: userQuestion },
    ],
  }),

  /**
   * PROMPT 3: Clause Simplifier
   * Simplifies a specific selected clause
   */
  simplifyClause: (clauseText, language) => ({
    system: SYSTEM_PROMPT + getLanguageInstruction(language),
    user: `Simplify this specific legal clause for a non-lawyer. Respond in JSON:
{
  "simplified": "string - plain English version",
  "whatItMeans": "string - practical impact on the person",
  "isItFair": "fair|unfair|standard|unclear",
  "negotiable": true|false,
  "tipForUser": "string - one actionable tip"
}${language && language !== "English" ? `\nRespond with all string values in ${language}.` : ""}

CLAUSE: ${clauseText}`,
  }),

  /**
   * PROMPT 4: Risk Deep-Dive
   * Provides detailed analysis of a specific risk
   */
  riskDeepDive: (riskTitle, context, language) => ({
    system: SYSTEM_PROMPT + getLanguageInstruction(language),
    user: `Provide a detailed explanation of this legal risk. Respond in JSON:
{
  "explanation": "string - detailed plain English explanation",
  "realWorldExamples": ["string - 2-3 real scenarios where this could hurt the user"],
  "howToNegotiate": "string - how to push back or request changes",
  "alternativeLanguage": "string - suggested replacement clause wording",
  "whenToWalkAway": "string - circumstances under which user should not sign"
}${language && language !== "English" ? `\nRespond with all string values in ${language}.` : ""}

RISK: ${riskTitle}
CONTEXT: ${context}`,
  }),

  /**
   * PROMPT 5: Document Generation
   * Generates a complete legal document from a template type and user details
   */
  generateDocument: (templateType, details) => ({
    system: `You are LexAI — an expert legal document drafting assistant. You generate professional, 
comprehensive legal documents that are clear, well-structured, and legally sound.

Your drafting principles:
1. Use proper legal formatting with numbered sections and subsections
2. Include all standard clauses expected for the document type
3. Use the specific details provided by the user throughout the document
4. Include standard boilerplate clauses (severability, entire agreement, amendments, etc.)
5. Use clear, professional language — formal but readable
6. Include signature blocks at the end
7. Add the current date context where appropriate
8. Make the document as complete and ready-to-use as possible`,
    user: `Generate a complete, professional ${templateType} using the following details provided by the user.

USER-PROVIDED DETAILS:
${Object.entries(details).map(([key, value]) => `- ${key}: ${value}`).join("\n")}

INSTRUCTIONS:
1. Create a COMPLETE, ready-to-sign ${templateType}
2. Use ALL the details provided above in the appropriate places
3. Include all standard sections expected in a ${templateType}
4. Add proper legal formatting with numbered clauses
5. Include signature blocks at the end for all parties
6. Where specific details are not provided, use reasonable standard terms
7. Do NOT include any commentary or explanation — output ONLY the document text
8. Start with the document title in ALL CAPS

Generate the full document now:`,
  }),
};

module.exports = prompts;
