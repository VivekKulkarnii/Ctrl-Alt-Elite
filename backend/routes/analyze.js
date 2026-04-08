const express = require("express");
const router = express.Router();
const fs = require("fs");
const { extractText, cleanText, truncateForAI } = require("../utils/pdfParser");
const { analyzeDocument } = require("../utils/aiProcessor");

/**
 * POST /api/analyze
 * Accepts a file upload, extracts text, runs full AI analysis
 * Supports optional 'language' field for multi-language output
 */
router.post("/", async (req, res) => {
  const file = req.file;
  let filePath = null;

  try {
    // Language can come from form data (file upload) or JSON body (text input)
    const language = req.body.language || "English";
    console.log(`🌐 Response language: ${language}`);

    if (!file) {
      // Also accept raw text in body
      const rawText = req.body.text;
      if (!rawText) {
        return res.status(400).json({ error: "No document or text provided" });
      }

      const text = truncateForAI(cleanText(rawText));
      const analysis = await analyzeDocument(text, language);
      return res.json({
        success: true,
        fileName: "Pasted Text",
        characterCount: rawText.length,
        analysis,
        extractedText: text,
      });
    }

    filePath = file.path;
    console.log(`📄 Processing: ${file.originalname} (${file.size} bytes)`);

    // Extract text from file
    let rawText = await extractText(filePath);
    if (!rawText || rawText.trim().length < 50) {
      throw new Error(
        "Could not extract meaningful text from document. Please ensure the file is not scanned/image-only."
      );
    }

    const text = truncateForAI(cleanText(rawText));
    console.log(`✅ Extracted ${text.length} characters. Sending to AI...`);

    // Run AI analysis
    const analysis = await analyzeDocument(text, language);

    res.json({
      success: true,
      fileName: file.originalname,
      characterCount: rawText.length,
      analysis,
      extractedText: text,
    });
  } catch (err) {
    console.error("Analysis error:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    // Clean up uploaded file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

module.exports = router;