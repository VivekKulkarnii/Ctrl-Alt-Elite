const fs = require("fs");
const path = require("path");

/**
 * Extracts text from uploaded files (PDF or plain text)
 */
async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".txt") {
    return fs.readFileSync(filePath, "utf-8");
  }

  if (ext === ".pdf") {
    try {
      const pdfParse = require("pdf-parse");
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (err) {
      throw new Error(`Failed to parse PDF: ${err.message}`);
    }
  }

  // For .doc/.docx — basic fallback (read as buffer, extract readable text)
  // For production, use mammoth.js for docx
  if (ext === ".docx" || ext === ".doc") {
    try {
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch {
      // Fallback: read raw (imperfect but shows intent)
      const buffer = fs.readFileSync(filePath);
      return buffer
        .toString("utf-8")
        .replace(/[^\x20-\x7E\n]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }
  }

  throw new Error(`Unsupported file type: ${ext}`);
}

/**
 * Cleans extracted text for better AI processing
 */
function cleanText(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/**
 * Truncates text to fit within token limits
 */
function truncateForAI(text, maxChars = 12000) {
  if (text.length <= maxChars) return text;
  return (
    text.substring(0, maxChars) +
    "\n\n[Document truncated for analysis — first 12,000 characters shown]"
  );
}

module.exports = { extractText, cleanText, truncateForAI };
