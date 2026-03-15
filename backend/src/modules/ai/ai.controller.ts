import type { Request, Response } from "express";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function chat(req: Request, res: Response): Promise<void> {
  const { message, courseContext } = req.body;

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  const trimmed = message.trim();
  if (!trimmed) {
    res.status(400).json({ error: "Message cannot be empty" });
    return;
  }

  if (!OPENAI_API_KEY) {
    res.json({
      reply: "AI Assistant is not configured. Add OPENAI_API_KEY to your backend .env to enable AI help. For now, here are some study tips:\n\n• Take notes while watching videos\n• Practice coding along with the instructor\n• Use the Next button to mark lessons complete and unlock more content\n• Revisit difficult concepts - learning takes time!",
    });
    return;
  }

  try {
    const systemPrompt = `You are a helpful AI tutor for students learning programming and technology. 
You are friendly, patient, and explain concepts clearly. 
${courseContext ? `The student is currently studying: ${courseContext}` : ""}
Keep responses concise but helpful. If they ask about code, provide clear examples.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: trimmed },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI API error:", err);
      res.status(502).json({
        reply: "Sorry, the AI service is temporarily unavailable. Please try again later.",
      });
      return;
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply =
      data.choices?.[0]?.message?.content ||
      "I couldn't generate a response. Please try rephrasing your question.";

    res.json({ reply });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({
      reply: "Something went wrong. Please try again.",
    });
  }
}
