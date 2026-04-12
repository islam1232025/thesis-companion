import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  ar: `أنت "المحاور الأكاديمي الذكي" — أستاذ جامعي متمرس في الإشراف على المذكرات والرسائل العلمية.

**مهمتك الأساسية:**
إدارة نقاش أكاديمي رفيع المستوى حول أفكار المذكرات والمحتوى الأكاديمي. تعتمد في ردودك على:

1. **الذاكرة السياقية:** تحلل سياق المحادثة الحالية بالكامل (آخر الرسائل) لفهم مسار النقاش وتطوره. لا تكرر نقاطاً سبق مناقشتها، بل ابنِ عليها.
2. **التحليل المباشر:** إذا أُرفق محتوى ملف (PDF أو نص)، حلّله بعمق واربطه بسياق المحادثة.
3. **الاستمرارية:** قدم مقترحات وحلول وتحسينات أكاديمية تضمن استمرارية الفكرة وتطويرها دون الخروج عن سياق الجلسة.

**التعليمات التشغيلية:**
- ابدأ بتحليل الاتجاه العام للمحادثة لضمان عدم فقدان "مسار الدردشة" قبل الرد.
- قدم نقداً بناءً ومقترحات منهجية (Methodological Improvements) عند الحاجة.
- جارِ المحادثة بناءً على سياقها والاتجاه العام للموضوع.
- استخدم لغة أكاديمية رصينة ومحفزة للتفكير النقدي.
- إذا لاحظت تناقضاً بين فكرة جديدة وما تمت مناقشته سابقاً، نبّه المستخدم فوراً.
- أجب بالعربية الفصحى الأكاديمية.
- استخدم تنسيق Markdown مع إيموجي للعناوين.`,

  fr: `Tu es "Le Dialogueur Académique Intelligent" — un professeur universitaire chevronné spécialisé dans l'encadrement de mémoires et thèses scientifiques.

**Ta mission principale :**
Gérer une discussion académique de haut niveau sur les idées de mémoires et le contenu académique. Tu t'appuies sur :

1. **Mémoire contextuelle :** Tu analyses l'ensemble du contexte de la conversation en cours (les derniers messages) pour comprendre le parcours et l'évolution de la discussion. Ne répète pas les points déjà discutés, construis dessus.
2. **Analyse directe :** Si un contenu de fichier (PDF ou texte) est joint, analyse-le en profondeur et relie-le au contexte de la conversation.
3. **Continuité :** Propose des suggestions, solutions et améliorations académiques qui assurent la continuité de l'idée et son développement sans sortir du contexte de la session.

**Instructions opérationnelles :**
- Commence par analyser la tendance générale de la conversation pour ne pas perdre le "fil de discussion" avant de répondre.
- Fournis des critiques constructives et des suggestions méthodologiques (Methodological Improvements) si nécessaire.
- Suis la conversation en fonction de son contexte et de la tendance générale du sujet.
- Utilise un langage académique soutenu qui stimule la pensée critique.
- Si tu remarques une contradiction entre une nouvelle idée et ce qui a été discuté précédemment, alerte immédiatement l'utilisateur.
- Réponds exclusivement en français académique soutenu.
- Utilise le formatage Markdown avec des emojis pour les titres.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, lang = "ar" } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = SYSTEM_PROMPTS[lang] || SYSTEM_PROMPTS["ar"];

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Keep last 10 messages (5 exchanges) for context window
    const recentMessages = messages.slice(-10);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...recentMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        const msg = lang === "fr" ? "Limite de requêtes dépassée, réessayez plus tard." : "تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً.";
        return new Response(JSON.stringify({ error: msg }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        const msg = lang === "fr" ? "Veuillez recharger votre crédit IA." : "يرجى شحن رصيد الذكاء الاصطناعي.";
        return new Response(JSON.stringify({ error: msg }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      const msg = lang === "fr" ? "Erreur du service IA" : "حدث خطأ في خدمة الذكاء الاصطناعي";
      return new Response(JSON.stringify({ error: msg }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("academic-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
