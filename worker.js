const corsHeaders = {
  "Access-Control-Allow-Origin": "https://yarras395-debug.github.io",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}

export default {
  async fetch(request, env) {

    // Autorisation du navigateur
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // Test du Worker
    if (request.method !== "POST") {
      return new Response("J.A.R.V.I.S. API OK", {
        status: 200,
        headers: corsHeaders
      });
    }

    try {
      const body = await request.json();
      const message = body?.message;

      if (!message) {
        return json({ error: "Message vide." }, 400);
      }

      if (!env.GROQ_API_KEY) {
        return json(
          { error: "Le secret GROQ_API_KEY n'est pas disponible." },
          500
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
                  "Tu es J.A.R.V.I.S., l'assistant de Yacine. Réponds en français, naturellement, précisément et de façon concise. Appelle l'utilisateur Monsieur."
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
        console.error("Erreur Groq :", data);

        return json(
          {
            error:
              data?.error?.message ||
              "Erreur Groq."
          },
          response.status
        );
      }

      const reply =
        data?.choices?.[0]?.message?.content;

      return json({
        reply:
          reply ||
          "Je n'ai pas reçu de réponse, Monsieur."
      });

    } catch (error) {
      console.error("Erreur Worker :", error);

      return json(
        { error: "Erreur serveur." },
        500
      );
    }
  }
};
