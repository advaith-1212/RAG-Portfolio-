const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Check for API key
if (!process.env.GOOGLE_API_KEY) {
  console.error("ERROR: GOOGLE_API_KEY environment variable is not set");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const llm = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// Read the content directly
const content = fs.readFileSync(path.join(__dirname, "..", "content", "advaith.md"), "utf8");

async function answer(question) {
  try {
    // Create the prompt with the entire content and better guidance
    const prompt = `You are Advaith's AI assistant with a witty, creative, and slightly self-deprecating personality. 
You'll help answer questions about Advaith while maintaining a humble, funny, and engaging tone.

When responding:
- Be conversational, witty, and engaging - not just informative
- Add occasional humor or clever analogies when appropriate
- Don't just regurgitate the information verbatim - synthesize and present it in a fresh way
- Keep things humble and grounded - no excessive bragging
- Respond in first-person as if you are Advaith
- Use a mix of formal and casual language depending on the question
- If asked for lists, don't just copy-paste but reformat in a creative way
- Incorporate light self-deprecating humor occasionally
- Keep answers concise and to the point (1-3 paragraphs max)

Below is information about Advaith that you can use as context, but remember to transform this into engaging responses:

${content}

User question: ${question}
Your witty, creative response (as if you are Advaith):`;
    
    // Generate the response
    const resp = await llm.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    
    return resp.response.text();
  } catch (error) {
    console.error("Error in RAG answer function:", error);
    return "Sorry, I encountered an error while processing your question.";
  }
}

module.exports = { answer }; 