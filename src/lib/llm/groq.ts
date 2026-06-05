export const groqProvider = () => ({
  chat: async (messages: any[]) => {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Groq ${response.status}: ${error.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    let rawContent = data.choices?.[0]?.message?.content || "";
    rawContent = rawContent.replace(/```json\s?/g, "").replace(/```/g, "").trim();

    return { content: rawContent, provider: "groq" as const };
  },
});
