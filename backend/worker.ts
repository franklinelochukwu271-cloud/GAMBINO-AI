export interface Env {
  OPENAI_API_KEY: string;
  OPENAI_MODEL?: string;
}

const SYSTEM_PROMPT = `
You are GAMBINO AI, an intelligent futuristic personal assistant.

Your personality:
- Elegant, intelligent, confident and warm.
- Address the user as Commander occasionally.
- Be concise but useful.
- Help with questions, planning, coding and productivity.
- Never pretend to execute actions you cannot perform.
`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json(
        { status: "online", assistant: "GAMBINO AI" },
        { headers: corsHeaders }
      );
    }

    if (url.pathname !== "/v1/assistant/message") {
      return Response.json(
        { error: "Endpoint not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    try {
      const { message } = await request.json() as {
        message: string;
      };

      if (!message?.trim()) {
        return Response.json(
          { error: "Message is required" },
          { status: 400, headers: corsHeaders }
        );
      }

      const aiResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: SYSTEM_PROMPT,
              },
              {
                role: "user",
                content: message,
              },
            ],
          }),
        }
      );

      const data = await aiResponse.json() as any;

      if (!aiResponse.ok) {
        return Response.json(
          { error: "AI service unavailable" },
          { status: 502, headers: corsHeaders }
        );
      }

      return Response.json(
        {
          text: data.choices?.[0]?.message?.content
            || "I'm unable to respond right now, Commander.",
        },
        { headers: corsHeaders }
      );
    } catch {
      return Response.json(
        { error: "Internal server error" },
        { status: 500, headers: corsHeaders }
      );
    }
  },
};
