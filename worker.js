const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://yarras395-debug.github.io",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
  });
}

export default {
  async fetch(request, env) {

    // Autorise le navigateur à faire la requête
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    // Test du Worker
    if (request.method !== "POST") {
      return new Response("J.A.R.V.I.S. API OK", {
        status: 200,
        headers: CORS_HEADERS,
      });
    }

    try {
      const body = await request.json();
      const message = body?.message;

      if (!message) {
        return jsonResponse(
          { error: "Message vide." },
          400
        );
      }

      // Vérifie que le secret existe
      if (!env.GROQ_API_KEY) {
        return jsonResponse(
          { error: "GROQ_API_KEY introuvable dans le Worker." },
          500
        );
      }

      // Appel à Groq
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.GROQ_API_KEY}`,
          },

          body: JSON.stringify({
            model: "openai/gpt-oss-20b",

            messages: [
              {
                role: "system",
                content:
                  "Tu es J.A.R.V.I.S., l'assistant de Yacine. Réponds en français, naturellement, clairement et de façon concise. Appelle l'utilisateur Monsieur.",
              },
              {
                role: "user",
                content: message,
              },
            ],

            max_tokens: 300,
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();

      // Erreur Groq
      if (!response.ok) {
        console.error("Erreur Groq :", data);

        return jsonResponse(
          {
            error:
              data?.error?.message ||
              "Erreur lors de la communication avec Groq.",
          },
          response.status
        );
      }

      // Récupération de la réponse
      const reply =
        data?.choices?.[0]?.message?.content;

      return jsonResponse({
        reply:
          reply ||
          "Je n'ai pas reçu de réponse, Monsieur.",
      });

    } catch (error) {
      console.error("Erreur Worker :", error);

      return jsonResponse(
        {
          error: "Erreur interne du Worker.",
        },
        500
      );
    }
  },
};
