import { useState } from "react";

export function useChat() {
  const [history, setHistory] = useState<{ role:string; text:string }[]>([]);
  const send = async (msg: string) => {
    setHistory(h => [...h, { role:"user", text:msg }]);
    const r = await fetch("/api/chat", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ message: msg })
    });
    const { text } = await r.json();
    setHistory(h => [...h, { role:"assistant", text }]);
  };
  return { history, send };
} 