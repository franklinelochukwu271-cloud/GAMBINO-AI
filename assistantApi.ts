const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function askAssistant(
  message: string
): Promise<{ text: string }> {
  const cleanMessage = message.trim();

  if (!cleanMessage) {
    return { text: "I'm listening, Commander." };
  }

  if (!API_BASE) {
    return { text: demoResponse(cleanMessage) };
  }

  try {
    const response = await fetch(
      `${API_BASE}/v1/assistant/message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: cleanMessage,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("AI connection failed");
    }

    return await response.json();
  } catch (error) {
    console.error("GAMBINO API error:", error);

    return {
      text: "My intelligence connection is currently unavailable, Commander. Please try again.",
    };
  }
}

function demoResponse(message: string): string {
  const text = message.toLowerCase();

  if (text.includes("hello") || text.includes("hi")) {
    return "Hello Commander. GAMBINO is online and ready.";
  }

  if (text.includes("your name")) {
    return "I am GAMBINO AI, your intelligent personal assistant.";
  }

  if (text.includes("time")) {
    return `The current time is ${new Date().toLocaleTimeString()}.`;
  }

  if (text.includes("date")) {
    return `Today is ${new Date().toLocaleDateString()}.`;
  }

  if (text.includes("motivation")) {
    return "Commander, greatness is built through consistency. Execute your vision one step at a time.";
  }

  if (text.includes("what can you do")) {
    return "I can converse with you, answer questions, assist with planning, provide information and help you accomplish tasks. My full AI intelligence connection is coming soon.";
  }

  return `I received your message, Commander: "${message}". My full intelligence engine is currently under development.`;
        }
