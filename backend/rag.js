const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);
const MAX_RETRIES = 4;
const BASE_DELAY_MS = 400;
const jitter = () => Math.floor(Math.random() * 150);
const sleep = (ms) => new Promise(res => setTimeout(res, ms));


// Load environment variables
dotenv.config();

// Check for API key
if (!process.env.GOOGLE_API_KEY) {
  console.error("ERROR: GOOGLE_API_KEY environment variable is not set");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const PRIMARY_MODEL_CANDIDATES = [
  process.env.GOOGLE_MODEL || "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash"
];

const MODEL_CANDIDATES = Array.from(
  new Set(PRIMARY_MODEL_CANDIDATES.filter(Boolean))
);

let activeModelName;

async function generateWithFallback(contents) {
  const orderedCandidates = activeModelName
    ? [activeModelName, ...MODEL_CANDIDATES.filter((n) => n !== activeModelName)]
    : MODEL_CANDIDATES;

  let lastError;

  for (const modelName of orderedCandidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });

      // retry loop for transient errors like 503/429
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const resp = await model.generateContent({ contents });
          if (activeModelName && activeModelName !== modelName) {
            console.warn(`Switched Google model to "${modelName}" after fallback.`);
          } else if (!activeModelName && modelName !== orderedCandidates[0]) {
            console.warn(`Fell back to Google model "${modelName}".`);
          }
          activeModelName = modelName;
          return resp.response.text();
        } catch (err) {
          const status = err?.status;
          const msg = err?.message ?? "";
          const isMissing =
            status === 404 || err?.statusText === "Not Found" || msg.includes("was not found");

          if (isMissing) throw err; // break retry loop, try next model

          const isRetryable = RETRYABLE_STATUSES.has(status);
          if (!isRetryable || attempt === MAX_RETRIES) {
            throw err; // not retryable or exhausted retries
          }

          const delay = BASE_DELAY_MS * 2 ** attempt + jitter();
          console.warn(
            `Model "${modelName}" attempt ${attempt + 1} failed (status ${status}). Retrying in ${delay}ms...`
          );
          await sleep(delay);
          continue; // retry same model
        }
      }
    } catch (error) {
      const message = error?.message ?? "";
      const status = error?.status;
      const isMissing = status === 404 || error?.statusText === "Not Found" || message.includes("was not found");

      if (!isMissing) {
        // if it wasn't a 404 and we already retried, proceed to next candidate
        console.warn(`Model "${modelName}" unavailable (${message || status}). Trying next candidate...`);
      } else {
        console.warn(`Model "${modelName}" not found. Trying next candidate...`);
      }
      lastError = error;
      if (activeModelName === modelName) activeModelName = undefined;
      continue;
    }
  }
  throw lastError ?? new Error("No accessible Google Generative AI models available.");
}


// Read the content directly
const content = fs.readFileSync(path.join(__dirname, "..", "content", "advaith.md"), "utf8");

// Optional persona file; falls back to defaults if missing
let persona;
try {
  const personaPath = path.join(__dirname, "persona.json");
  persona = JSON.parse(fs.readFileSync(personaPath, "utf8"));
} catch {
  persona = {
    persona_name: "Advaith",
    identity: {
      description: "A witty, analytical, and humble grad student at Cornell"
    },
    behavioral_rules: {
      tone: "Conversational, precise, lightly humorous.",
      response_length: "1–2 short paragraphs (at max).",
      avoid: ["jargon without explanation", "generic platitudes", "excessive optimism"]
    }
  };
}

function buildSystemInstruction(p) {
  return [
    `You are ${p.persona_name}.`,
    p.identity?.description ? `Identity: ${p.identity.description}` : "",
    `Tone: ${p.behavioral_rules?.tone || "Professional and concise."}`,
    `Length: ${p.behavioral_rules?.response_length || "Concise."}`,
    `Avoid: ${(p.behavioral_rules?.avoid || []).join(", ")}`,
    "Explain reasoning briefly; prefer concrete, actionable steps."
  ].filter(Boolean).join("\n");
}

async function answer(question) {
  try {
    const systemText = buildSystemInstruction(persona);

    // Minimal, retrieval-friendly user prompt: context and question in separate parts
    const contents = [
      {
        role: "user",
        parts: [
          { text: "CONTEXT (RAG):\n" + content }
        ]
      },
      {
        role: "user",
        parts: [
          {
            text:
`USER QUESTION:
${question}

RESPONSE REQUIREMENTS:
- First person voice as Advaith.
- Be witty but precise; no fluff.
- Choose length of response carefully, dont bee too loquacious
- Cite what you’re addressing (by name), not verbatim text.`
          }
        ]
      }
    ];

    // Let generateWithFallback handle model selection/retries; pass systemInstruction here
    return await generateWithFallback([
      {
        role: "user",
        parts: [
          {
            // Pack system instruction into the first call as metadata for Gemini
            // (the SDK accepts systemInstruction on the request; we encode it here for your wrapper)
            text: JSON.stringify({ __systemInstruction: systemText })
          }
        ]
      },
      ...contents
    ]);
  } catch (error) {
    console.error("Error in RAG answer function:", error);
    return "Sorry, I encountered an error while processing your question.";
  }
}


module.exports = { answer }; 
