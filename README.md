# RAG Portfolio Chatbot

A personalized AI chatbot that uses RAG (Retrieval-Augmented Generation) to answer questions about your professional profile. Built with React, Express, and Google's Gemini API.

## Features

- 🤖 Interactive AI chat interface
- 🎨 Beautiful, responsive UI with dark mode
- 📚 RAG-based answers using your profile data
- 🔄 Real-time response generation
- 🎯 Quick-start prompts for common questions

## Tech Stack

- Frontend: React + TypeScript + Vite + shadcn/ui
- Backend: Express.js
- AI: Google Gemini API
- Styling: Tailwind CSS

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## Setup Instructions

1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd convo-persona-profile
   ```

2. Install dependencies:
   ```sh
   pnpm install
   cd backend && pnpm install && cd ..
   ```

3. Set up your personal content:
   - Copy `content/profile.example.md` to `content/advaith.md`
   - Edit `content/advaith.md` with your personal information
   - This file is gitignored by default for privacy

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Google Gemini API key to `.env`

5. Start the backend server:
   ```sh
   pnpm run backend
   ```

6. In a new terminal, start the frontend:
   ```sh
   pnpm run dev
   ```

7. Visit `http://localhost:8080` to interact with your chatbot!

## Customization

- Edit `content/advaith.md` to update your profile information
- Modify the prompt in `backend/rag.js` to adjust the chatbot's personality
- Update the UI components in `src/components` to match your style

## Project Structure

```
├── backend/              # Express server with Gemini API integration
│   ├── index.js         # Server setup and API endpoints
│   └── rag.js           # RAG implementation with Gemini
├── content/
│   └── advaith.md       # Your professional profile content
├── src/                 # Frontend React application
│   ├── components/      # UI components
│   ├── hooks/          # Custom React hooks
│   └── pages/          # Page components
└── .env                # Environment variables (not in git)
```

## Environment Variables

Create a `.env` file with the following variables:
```env
GOOGLE_API_KEY=your_api_key_here
PORT=8787
VITE_API_URL=http://localhost:8787
```

## Security Notes

- Never commit your `.env` file
- Keep your API keys private
- The `.gitignore` file is configured to protect sensitive data

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
