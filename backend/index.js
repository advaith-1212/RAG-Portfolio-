const express = require('express');
const cors = require('cors');
const { answer } = require('./rag.js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Log environment status
console.log(`Gemini API Key is ${process.env.GOOGLE_API_KEY ? 'SET' : 'NOT SET'}`);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    
    console.log(`Received query: "${message}"`);
    const text = await answer(message);
    console.log(`Generated response: "${text.substring(0, 50)}..."`);
    res.json({ text });
  } catch (e) {
    console.error("Error handling chat request:", e);
    res.status(500).json({ error: "internal", message: e.message });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok",
    apiKeySet: !!process.env.GOOGLE_API_KEY
  });
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => console.log(`API server running on port ${PORT}...`)); 