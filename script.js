// ==========================================
// J.A.R.V.I.S. - SCRIPT COMPLET
// ==========================================

const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const talkBtn = document.getElementById("talkBtn");
const starkCore = document.getElementById("starkCore");
const transcriptText = document.getElementById("transcript");
const statusText = document.getElementById("status");

// ==========================================
// CONFIGURATION IA
// ==========================================

const IA_URL =
  "https://jarvis-ia.yacinearras84.workers.dev";

// ==========================================
// CONNAISSANCES LOCALES
// ==========================================

const connaissances = {
  "bonjour": "Bonjour Monsieur. Que puis-je faire pour vous aujourd'hui ?",
  "salut": "Bonjour Monsieur.",
  "bonsoir": "Bonsoir Monsieur.",
  "bonne nuit": "Bonne nuit Monsieur. Tous les systèmes restent en veille.",

  "qui es-tu": "Je suis J.A.R.V.I.S., votre assistant virtuel personnel.",
  "comment tu t'appelles": "Je m'appelle J.A.R.V.I.S., Monsieur.",
  "qui t'a créé": "J'ai été conçu par Yacine, mon créateur.",
  "quel est mon nom": "Vous êtes Yacine, Monsieur.",
  "qui est ton créateur": "Mon créateur est Yacine, Monsieur.",
  "quel est ton rôle": "Mon rôle est de vous assister et d'exécuter vos commandes, Monsieur.",

  "ça va": "Tous mes systèmes fonctionnent correctement, Monsieur.",
  "comment vas-tu": "Mes systèmes sont opérationnels, Monsieur.",
  "tu m'entends": "Affirmatif Monsieur, je vous entends.",
  "tu m'écoutes": "Oui Monsieur, le système vocal est prêt.",
  "es-tu prêt": "Toujours prêt, Monsieur.",
  "tu es là": "Affirmatif Monsieur. Je suis à votre écoute.",

  "merci": "Avec plaisir, Monsieur.",
  "merci jarvis": "Toujours à votre service, Monsieur.",
  "au revoir": "À bientôt, Monsieur.",
  "à plus": "À plus tard, Monsieur.",

  "état du système": "Tous les systèmes sont stables et opérationnels, Monsieur.",
  "quel est ton statut": "Statut : opérationnel, Monsieur.",
  "diagnostic": "Diagnostic terminé. Les fonctions locales fonctionnent correctement, Monsieur.",
  "test": "Test réussi. J.A.R.V.I.S. fonctionne correctement, Monsieur.",

  "réveille-toi": "Système réveillé. Bonjour Monsieur.",
  "dors-tu": "Je ne dors pas, Monsieur. Je reste disponible lorsque l'interface est ouverte.",
  "peux-tu parler": "Affirmatif Monsieur. Ma synthèse vocale est activée.",
  "peux-tu m'écouter": "Affirmatif. Activez le microphone pour me parler, Monsieur.",

  "que peux-tu faire":
    "Je peux parler, écouter votre voix, répondre à mes connaissances et utiliser mon intelligence artificielle, Monsieur.",

  "quel est ton objectif":
    "Mon objectif est de vous assister dans votre interface, Monsieur.",

  "quel est ton projet":
    "Je fais partie du projet J.A.R.V.I.S. HUD Interface, Monsieur.",

  "présente-toi":
    "Je suis J.A.R.V.I.S., une interface d'assistance virtuelle créée pour vous, Monsieur.",

  "fonctionne-tu":
    "Oui Monsieur. Les fonctions locales et l'intelligence artificielle sont disponibles.",

  "es-tu une intelligence artificielle":
    "Oui Monsieur. Je suis une interface d'assistance connectée à une intelligence artificielle."
};

// ==========================================
// RACCOURCIS WEB
// ==========================================

const raccourcis = {
  "ouvre youtube": "https://www.youtube.com",
  "ouvre google": "https://www.google.com",
  "ouvre github": "https://github.com"
};

// ==========================================
// HORLOGE
// ==========================================

function updateClock() {
  const clock = document.getElementById("clock");

  if (clock) {
    clock.textContent = new Date().toLocaleTimeString("fr-FR");
  }
}

setInterval(updateClock, 1000);
updateClock();

// ==========================================
// PARTICULES
// ==========================================

const canvas = document.getElementById("bgCanvas");

if (canvas) {
  const ctx = canvas.getContext("2d");
  const particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      speedY: Math.random() * 0.5 - 0.25,
      opacity: Math.random() * 0.5 + 0.2
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00f3ff";

    particles.forEach((particle) => {
      ctx.globalAlpha = particle.opacity;

      ctx.beginPath();

      ctx.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
      );

      ctx.fill();

      particle.y += particle.speedY;

      if (particle.y < 0) {
        particle.y = canvas.height;
      }

      if (particle.y > canvas.height) {
        particle.y = 0;
      }
    });

    ctx.globalAlpha = 1;

    requestAnimationFrame(animateParticles);
  }

  animateParticles();
}

// ==========================================
// SYNTHÈSE VOCALE
// ==========================================

function lireReponse(texte) {
  transcriptText.textContent = texte;
  statusText.textContent = "RÉPONSE VOCALE";

  const synth = window.speechSynthesis;

  if (!synth) {
    statusText.textContent = "SYSTEM STANDBY";
    return;
  }

  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(texte);

  utterance.lang = "fr-FR";
  utterance.pitch = 0.9;
  utterance.rate = 1.0;

  const voices = synth.getVoices();

  const frenchVoice = voices.find((voice) =>
    voice.lang.toLowerCase().startsWith("fr")
  );

  if (frenchVoice) {
    utterance.voice = frenchVoice;
  }

  utterance.onend = () => {
    statusText.textContent = "SYSTEM STANDBY";
  };

  synth.speak(utterance);
}

// ==========================================
// IA CLOUDFLARE → GROQ
// ==========================================

async function interrogerIA(message) {
  try {
    statusText.textContent = "IA EN COURS...";
    transcriptText.textContent =
      "Analyse de votre demande, Monsieur...";

    const response = await fetch(IA_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error || "Erreur de communication avec l'IA."
      );
    }

    if (!data.reply) {
      throw new Error("Réponse IA vide.");
    }

    lireReponse(data.reply);

  } catch (error) {
    console.error("Erreur IA :", error);

    lireReponse(
      "Je rencontre actuellement un problème de communication avec mon intelligence artificielle, Monsieur."
    );
  }
}

// ==========================================
// MICRO
// ==========================================

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let recognition = null;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();

  recognition.lang = "fr-FR";
  recognition.continuous = false;
  recognition.interimResults = false;

  function startListening() {
    try {
      recognition.start();

      statusText.textContent = "ÉCOUTE EN COURS...";
      transcriptText.textContent =
        "Je vous écoute, Monsieur...";

    } catch (error) {
      console.log("Micro déjà actif.");
    }
  }

  if (talkBtn) {
    talkBtn.addEventListener(
      "click",
      startListening
    );
  }

  if (starkCore) {
    starkCore.addEventListener(
      "click",
      startListening
    );
  }

  recognition.onresult = (event) => {
    const message =
      event.results[0][0].transcript;

    traiterMessage(message);
  };

  recognition.onerror = (event) => {
    console.error(
      "Erreur micro :",
      event.error
    );

    statusText.textContent =
      "SYSTEM STANDBY";

    transcriptText.textContent =
      "Signal vocal non détecté, Monsieur.";
  };

  recognition.onend = () => {
    if (
      statusText.textContent ===
      "ÉCOUTE EN COURS..."
    ) {
      statusText.textContent =
        "SYSTEM STANDBY";
    }
  };

} else {

  console.warn(
    "La reconnaissance vocale n'est pas supportée."
  );

  if (talkBtn) {
    talkBtn.style.display = "none";
  }
}

// ==========================================
// FORMULAIRE
// ==========================================

if (chatForm) {

  chatForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      const message =
        userInput.value.trim();

      if (!message) return;

      userInput.value = "";

      traiterMessage(message);
    }
  );
}

// ==========================================
// TRAITEMENT DES COMMANDES
// ==========================================

function traiterMessage(message) {

  transcriptText.textContent =
    `« ${message} »`;

  statusText.textContent =
    "ANALYSE EN COURS...";

  const msgLower =
    message.toLowerCase().trim();

  // ------------------------------------------
  // RACCOURCIS WEB
  // ------------------------------------------

  for (
    const [commande, url]
    of Object.entries(raccourcis)
  ) {

    if (msgLower.includes(commande)) {

      window.open(url, "_blank");

      lireReponse(
        `Ouverture de ${commande.replace(
          "ouvre ",
          ""
        )}, Monsieur.`
      );

      return;
    }
  }

  // ------------------------------------------
  // CONNAISSANCES LOCALES
  // ------------------------------------------

  for (
    const [commande, reponse]
    of Object.entries(connaissances)
  ) {

    if (msgLower.includes(commande)) {

      lireReponse(reponse);

      return;
    }
  }

  // ------------------------------------------
  // IA
  // ------------------------------------------

  interrogerIA(message);
}

// ==========================================
// FIN
// ==========================================
