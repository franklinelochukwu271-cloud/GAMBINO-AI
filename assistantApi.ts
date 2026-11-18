import { getLocalResponse } from "./gambinoCore";
import { processCommand } from "./gambinoCommands";

import {
  addMessage,
  getConversation,
} from "./conversationMemory";

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

  addMessage("user", cleanMessage);

  // Process system commands first
  const commandResponse = processCommand(cleanMessage);

  if (commandResponse !== null) {
    addMessage("assistant", commandResponse);

    return {
      text: commandResponse,
    };
  }

  const history = getConversation();

  // Local intelligence mode
  if (!API_BASE) {
    const answer = getLocalResponse(
      cleanMessage,
      history
    );

    addMessage("assistant", answer);

    return {
      text: answer,
    };
  }

  // AI backend mode
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
          conversation: history,
          assistant: "GAMBINO AI",
          personality: "futuristic",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("AI connection failed");
    }

    const data = await response.json();

    const answer =
      data.text || "I'm listening, Commander.";

    addMessage("assistant", answer);

    return { text: answer };

  } catch (error) {
    console.error("GAMBINO API error:", error);

    const answer =
      "My intelligence connection is currently unavailable, Commander.";

    addMessage("assistant", answer);

    return { text: answer };
  }
}
