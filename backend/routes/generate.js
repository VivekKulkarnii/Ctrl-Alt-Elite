const express = require("express");
const router = express.Router();
const { generateDocument } = require("../utils/aiProcessor");

/**
 * POST /api/generate
 * Generates a complete legal document from a template type and user details
 * Body: { templateType, details }
 */
router.post("/", async (req, res) => {
  const { templateType, details } = req.body;

  if (!templateType || !details) {
    return res.status(400).json({ error: "Template type and details are required" });
  }

  try {
    console.log(`📝 Generating: ${templateType}`);
    const generatedDocument = await generateDocument(templateType, details);
    console.log(`✅ Generated ${generatedDocument.length} characters`);

    res.json({
      success: true,
      documentType: templateType,
      generatedDocument,
    });
  } catch (err) {
    console.error("Generation error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
