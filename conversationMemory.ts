export type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

const MAX_MESSAGES = 20;

let conversation: ConversationMessage[] = [];

export function addMessage(
  role: "user" | "assistant",
  content: string
): void {
  conversation.push({
    role,
    content,
  });

  if (conversation.length > MAX_MESSAGES) {
    conversation = conversation.slice(-MAX_MESSAGES);
  }
}

export function getConversation(): ConversationMessage[] {
  return [...conversation];
}

export function clearConversation(): void {
  conversation = [];
}

export function getLastUserMessage(): string | undefined {
  return [...conversation]
    .reverse()
    .find((message) => message.role === "user")
    ?.content;
}
