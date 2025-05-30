const fs = require('fs');
const { split } = require('sentence-splitter');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ChromaClient } = require('chroma-node');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Check for API key
if (!process.env.GOOGLE_API_KEY) {
  console.error("ERROR: GOOGLE_API_KEY environment variable is not set");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const embedder = genAI.getGenerativeModel({ model: "embedding-001" });

async function main() {
  try {
    // Initialize ChromaDB with in-memory configuration
    const db = new ChromaClient({
      path: path.join(__dirname, 'chroma.db')
    });
    
    // Create or get collection
    let collection;
    try {
      collection = await db.getCollection("portfolio");
      console.log("Using existing collection 'portfolio'");
    } catch (e) {
      collection = await db.createCollection("portfolio");
      console.log("Created new collection 'portfolio'");
    }
    
    // --- chunk ---
    const raw = fs.readFileSync(path.join(__dirname, "..", "content", "advaith.md"), "utf8");
    const chunks = [];
    let buf = "";
    for (const { raw: s } of split(raw)) {
      if ((buf + s).length > 1200) {
        chunks.push(buf.trim());
        buf = "";
      }
      buf += s;
    }
    if (buf) chunks.push(buf.trim());

    console.log(`Created ${chunks.length} chunks to be embedded...`);

    // --- embed & upsert ---
    for (const [i, text] of chunks.entries()) {
      console.log(`Embedding chunk ${i+1}/${chunks.length}...`);
      try {
        const embedResult = await embedder.embedContent({ 
          content: { parts: [{ text }] }
        });
        
        await collection.add({
          ids: [`doc-${i}`],
          embeddings: [embedResult.embedding.values],
          metadatas: [{ text }]
        });
      } catch (error) {
        console.error(`Error embedding chunk ${i+1}:`, error);
      }
    }
    console.log(`Successfully indexed ${chunks.length} chunks`);
  } catch (error) {
    console.error("Error in ingestion process:", error);
  }
}

main(); 