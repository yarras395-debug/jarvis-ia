export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("J.A.R.V.I.S. API OK");
    }

    try {
      const body = await request.json();
      const message = body.message;

      if (!message) {
        return Response.json(
          { error: "Message vide." },
          { status: 400 }
        );
      }

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            messages: [
              {
                role: "system",
                content:
                  "Tu es J.A.R.V.I.S., l'assistant de Yacine. Réponds en français, de manière naturelle, précise et concise. Appelle l'utilisateur Monsieur."
              },
              {
                role: "user",
                content: message
              }
            ],
            max_tokens: 300,
            temperature: 0.7
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return Response.json(
          {
            error:
              data?.error?.message ||
              "Erreur Groq."
          },
          { status: response.status }
        );
      }

      const reply = data?.choices?.[0]?.message?.content;

      return Response.json({
        reply: reply || "Je n'ai pas reçu de réponse, Monsieur."
      });

    } catch (error) {
      return Response.json(
        { error: "Erreur serveur." },
        { status: 500 }
      );
    }
  }
};
