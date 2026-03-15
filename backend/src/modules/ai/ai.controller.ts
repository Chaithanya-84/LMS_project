import type { Request, Response } from "express";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function getLocalFallbackReply(message: string, courseContext?: string): string {
  const lower = message.toLowerCase();
  const context = courseContext ? ` Since you're studying ${courseContext}, ` : " ";

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return `Hello! 👋 I'm here to help with your learning. ${context}What would you like to know?`;
  }
  if (lower.includes("help") || lower.includes("stuck")) {
    return `Here are some tips that might help:\n\n• Pause the video and try the code yourself\n• Use the AI chat to ask specific questions\n• Complete lessons in order to unlock new content\n• Take breaks - your brain learns better with rest\n• Join coding communities to get support`;
  }
  if (lower.includes("motivat") || lower.includes("give up") || lower.includes("difficult")) {
    return `Learning takes time - that's completely normal! 💪\n\n• Every expert was once a beginner\n• Focus on small wins - each lesson completed is progress\n• Consistency beats intensity - 30 min daily beats 5 hours once a week\n• You've got this!`;
  }
  if (lower.includes("oop") || lower.includes("object") || lower.includes("class")) {
    return `Object-Oriented Programming (OOP) basics:\n\n• **Classes** - Blueprints for creating objects\n• **Objects** - Instances of a class\n• **Encapsulation** - Bundling data and methods together\n• **Inheritance** - Child classes inherit from parent\n• **Polymorphism** - Same interface, different behavior\n\nTry building a simple class in your course - practice makes it click!`;
  }
  if (lower.includes("python") || lower.includes("java") || lower.includes("javascript") || lower.includes("sql")) {
    return `Great choice! ${context}Here's how to get the most from your course:\n\n• Type along with the instructor - muscle memory helps\n• Build a small project using what you learn\n• Use the course videos as reference - you can rewatch anytime\n• Practice with exercises or LeetCode for coding courses`;
  }
  if (lower.includes("thank") || lower.includes("thanks")) {
    return `You're welcome! Happy learning! 🎉`;
  }
  if (lower.includes("bye") || lower.includes("goodbye")) {
    return `Goodbye! Come back anytime you need help. Keep learning! 📚`;
  }

  return `Thanks for your question! ${context}Here are some general study tips:\n\n• Take notes while watching videos\n• Practice coding along with the instructor\n• Use the Next button to mark lessons complete and unlock more content\n• Revisit difficult concepts - learning takes time!\n\n💡 **Tip:** Add OPENAI_API_KEY to backend/.env for smarter AI responses. Get a key at platform.openai.com`;
}

export async function chat(req: Request, res: Response): Promise<void> {
  const { message, courseContext, history } = req.body;

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
    const reply = getLocalFallbackReply(trimmed, courseContext);
    res.json({ reply });
    return;
  }

  try {
    const systemPrompt = `You are a helpful AI tutor for students learning programming and technology. 
You are friendly, patient, and explain concepts clearly. 
${courseContext ? `The student is currently studying: ${courseContext}` : ""}
Keep responses concise but helpful. If they ask about code, provide clear examples.`;

    const chatHistory = Array.isArray(history)
      ? history
          .filter((m: { role?: string; content?: string }) => m?.role && m?.content)
          .map((m: { role: string; content: string }) => ({ role: m.role, content: m.content }))
      : [];

    const messages: { role: string; content: string }[] = [
      { role: "system", content: systemPrompt },
      ...chatHistory,
      { role: "user", content: trimmed },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
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
