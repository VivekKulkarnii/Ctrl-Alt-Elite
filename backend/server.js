const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const analyzeRoute = require("./routes/analyze");
const chatRoute = require("./routes/chat");
const generateRoute = require("./routes/generate");

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, Postman) and any localhost port
    if (!origin || origin.match(/^http:\/\/localhost:\d+$/)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));
app.use(express.json({ limit: "10mb" }));

// File upload config
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".txt", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Only PDF, TXT, DOC, DOCX files allowed"));
  },
});

// Routes
app.use("/api/analyze", upload.single("document"), analyzeRoute);
app.use("/api/chat", chatRoute);
app.use("/api/generate", generateRoute);

// Health check
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", message: "Legal Agent API running" })
);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🏛️  Legal Agent Backend running on http://localhost:${PORT}`);
  console.log(`📄  Upload endpoint: POST /api/analyze`);
  console.log(`💬  Chat endpoint:   POST /api/chat`);
});