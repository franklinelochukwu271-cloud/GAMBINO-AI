import { getLocalResponse } from "./gambinoCore";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function askAssistant(
  message: string
): Promise<{ text: string }> {
  const cleanMessage = message.trim();

  if (!cleanMessage) {
    return {
      text: "I'm listening, Commander.",
    };
  }

  // Local GAMBINO intelligence
  if (!API_BASE) {
    return {
      text: getLocalResponse(cleanMessage),
    };
  }

  // Connected AI backend
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
      text: "My intelligence connection is currently unavailable, Commander.",
    };
  }
}
