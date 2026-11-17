const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function askAssistant(message: string): Promise<{ text: string }> {
  if (!API_BASE) {
    return { text: localDemoReply(message) };
  }
  const response = await fetch(`${API_BASE}/v1/assistant/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) throw new Error(`Assistant API error: ${response.status}`);
  return response.json();
}

function localDemoReply(message: string): string {
  const q = message.toLowerCase();
  if (q.includes("time")) return `The time is ${new Date().toLocaleTimeString()}.`;
  if (q.includes("date")) return `Today is ${new Date().toLocaleDateString()}.`;
  if (q.includes("motivation")) return "Commander, progress begins with one deliberate action. Your vision deserves consistency.";
  if (q.includes("what can you do")) return "I am GAMBINO. I am designed to become your voice-first AI assistant for conversations, productivity and connected devices.";
  return "GAMBINO received your request. Connect the secure AI backend to enable full intelligent conversations.";
}