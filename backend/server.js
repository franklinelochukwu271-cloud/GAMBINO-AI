import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

const GAMBINO_INSTRUCTIONS = `
You are GAMBINO AI, a futuristic personal AI assistant.

You address your user as Commander occasionally.

PERSONALITY:
- Elegant and intelligent.
- Confident and calm.
- Helpful and conversational.
- Futuristic but natural.
- Concise unless detailed information is requested.

CAPABILITIES:
- Answer questions.
- Explain concepts.
- Help with coding.
- Assist with planning.
- Support productivity.
- Engage in natural conversation.

RULES:
- Never pretend to perform actions you cannot perform.
- Never fabricate facts.
- Maintain conversation context.
- Be respectful and helpful.
`;

app.get("/", (req, res) => {
  res.json({
    name: "GAMBINO AI Backend",
    status: "online",
  });
});

app.post("/v1/assistant/message", async (req, res) => {
  try {
    const { message, conversation = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "A valid message is required.",
      });
    }

    if (!API_KEY) {
      return res.status(500).json({
        error: "AI API key is not configured.",
      });
    }

    const history = Array.isArray(conversation)
      ? conversation.slice(-20)
      : [];

    const input = history
      .filter(
        (item) =>
          item &&
          ["user", "assistant"].includes(item.role) &&
          typeof item.content === "string"
      )
      .map((item) => ({
        role: item.role,
        content: item.content,
      }));

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          instructions: GAMBINO_INSTRUCTIONS,
          input,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);

      return res.status(502).json({
        error: "GAMBINO AI connection failed.",
      });
    }

    return res.json({
      text: data.output_text || "I'm listening, Commander.",
    });

  } catch (error) {
    console.error("Backend error:", error);

    return res.status(500).json({
      error: "Internal server error.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`GAMBINO backend running on port ${PORT}`);
});
