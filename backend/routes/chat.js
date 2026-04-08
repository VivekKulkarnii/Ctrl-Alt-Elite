const express = require("express");
const router = express.Router();
const { chatWithDocument, simplifyClause, explainRisk } = require("../utils/aiProcessor");

/**
 * POST /api/chat
 * Handles Q&A chat about the analyzed document
 * Body: { documentText, message, history, mode, language }
 * mode: "chat" | "simplify" | "risk"
 */
router.post("/", async (req, res) => {
  const { documentText, message, history = [], mode = "chat", context, language = "English" } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    let response;

    if (mode === "simplify") {
      // Simplify a specific clause
      response = await simplifyClause(message, language);
      return res.json({ success: true, mode, response });
    }

    if (mode === "risk") {
      // Deep-dive on a risk
      response = await explainRisk(message, context || "", language);
      return res.json({ success: true, mode, response });
    }

    // Default: conversational Q&A
    if (!documentText) {
      return res.status(400).json({ error: "Document text is required for chat" });
    }

    const answer = await chatWithDocument(documentText, message, history, language);
    return res.json({ success: true, mode: "chat", response: answer });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
