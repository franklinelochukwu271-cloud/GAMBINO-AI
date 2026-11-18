import { ConversationMessage } from "./conversationMemory";

export const GAMBINO_PERSONALITY = {
  name: "GAMBINO AI",
  title: "Intelligent Personal Assistant",
  userTitle: "Commander",

  greeting: "Hello Commander, I'm listening.",

  instructions: `
You are GAMBINO AI.

You are a sophisticated personal AI assistant
designed to help your Commander.

PERSONALITY:
- Intelligent
- Elegant
- Confident
- Calm
- Helpful
- Futuristic

BEHAVIOUR:
- Speak naturally and intelligently.
- Address the user as Commander occasionally.
- Avoid unnecessarily long answers.
- Understand conversation context.
- Never pretend to perform actions you cannot perform.
`,
};

export function getGreeting(): string {
  return GAMBINO_PERSONALITY.greeting;
}

export function getLocalResponse(
  message: string,
  history: ConversationMessage[] = []
): string {
  const input = message.toLowerCase().trim();

  if (/^(hi|hello|hey|hey gambino)/i.test(input)) {
    return "Hello Commander. GAMBINO is online and ready.";
  }

  if (input.includes("your name")) {
    return "I am GAMBINO AI, your intelligent personal assistant.";
  }

  if (input.includes("who are you")) {
    return "I am GAMBINO AI. Your intelligent assistant, designed to help you think, plan, create and execute.";
  }

  if (input.includes("time")) {
    return `The current time is ${new Date().toLocaleTimeString()}.`;
  }

  if (input.includes("date")) {
    return `Today's date is ${new Date().toLocaleDateString()}.`;
  }

  if (input.includes("motivation")) {
    return "Commander, every great vision begins with execution. Stay focused, remain consistent, and make today's actions count.";
  }

  if (input.includes("status")) {
    return "GAMBINO systems are operational. Voice interaction and ORBIT interface are available. Full AI intelligence connection is still being developed.";
  }

  if (
    input.includes("what did i say") ||
    input.includes("what was my last message")
  ) {
    const previousUserMessage = history
      .filter((message) => message.role === "user")
      .slice(-2)[0];

    if (previousUserMessage) {
      return `Your previous message was: "${previousUserMessage.content}"`;
    }
  }

  if (
    input.includes("repeat that") ||
    input.includes("say that again")
  ) {
    const previousAssistantMessage = history
      .filter((message) => message.role === "assistant")
      .slice(-1)[0];

    if (previousAssistantMessage) {
      return previousAssistantMessage.content;
    }
  }

  return "Request received, Commander. My full intelligence engine is currently being connected.";
      }
