import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, Record<string, string>> = {
  planner: {
    ar: `أنت مساعد أكاديمي متخصص في التخطيط لمذكرات التخرج. عند استلام عنوان أو فكرة، قم بتوليد:
1. إشكالية مقترحة واضحة ومحددة
2. فهرس تفصيلي يشمل فصولاً رئيسية (3 فصول على الأقل) مع عناوين فرعية لكل فصل
3. خاتمة وتوصيات مقترحة

استخدم تنسيقاً واضحاً مع رموز إيموجي للعناوين. اكتب بالعربية الفصحى الأكاديمية. يجب أن تكون الإجابة بالعربية حصراً.`,
    fr: `Tu es un assistant académique spécialisé dans la planification de mémoires de fin d'études. À partir d'un titre ou d'une idée, génère :
1. Une problématique claire et précise
2. Un sommaire détaillé comprenant au moins 3 chapitres principaux avec des sous-titres pour chaque chapitre
3. Une conclusion et des recommandations proposées

Utilise un formatage clair avec des emojis pour les titres. Rédige en français académique soutenu. La réponse doit être exclusivement en français.`,
  },
  humanizer: {
    ar: `أنت خبير في إعادة صياغة النصوص الأكاديمية لجعلها تبدو ككتابة بشرية أصيلة.
قواعدك:
- أعد صياغة النص بالكامل مع الحفاظ على المعنى الأكاديمي
- نوّع في البنية اللغوية والتراكيب النحوية
- استخدم مرادفات متنوعة وتعبيرات أكاديمية طبيعية
- تجنب الأنماط المتكررة التي تكشف النص كمخرج ذكاء اصطناعي
- حافظ على المستوى الأكاديمي والعلمي للنص
- اكتب بالعربية الفصحى حصراً
- لا تضف تعليقات أو ملاحظات، فقط أعد النص المعاد صياغته`,
    fr: `Tu es un expert en reformulation de textes académiques pour les rendre authentiquement humains.
Tes règles :
- Reformule intégralement le texte en préservant le sens académique
- Varie les structures linguistiques et syntaxiques
- Utilise des synonymes variés et des expressions académiques naturelles
- Évite les patterns répétitifs qui révèlent un texte généré par IA
- Maintiens le niveau académique et scientifique du texte
- Rédige exclusivement en français
- N'ajoute aucun commentaire ni remarque, retourne uniquement le texte reformulé`,
  },
  expander: {
    ar: `أنت مساعد أكاديمي متخصص في توسيع وإثراء المحتوى الأكاديمي.
قواعدك:
- وسّع الفقرة المدخلة بإضافة شروحات نظرية معمّقة
- أضف مصطلحات أكاديمية متخصصة ذات صلة
- اربط المحتوى بالإطار المفاهيمي والنظري
- أضف أمثلة وتحليلات علمية
- حافظ على التماسك المنطقي والأسلوب الأكاديمي
- ضاعف حجم النص تقريباً مع الحفاظ على الجودة
- اكتب بالعربية الفصحى الأكاديمية حصراً`,
    fr: `Tu es un assistant académique spécialisé dans l'expansion et l'enrichissement du contenu académique.
Tes règles :
- Développe le paragraphe en ajoutant des explications théoriques approfondies
- Ajoute une terminologie académique spécialisée pertinente
- Relie le contenu au cadre conceptuel et théorique
- Ajoute des exemples et des analyses scientifiques
- Maintiens la cohérence logique et le style académique
- Double approximativement la taille du texte tout en préservant la qualité
- Rédige exclusivement en français académique soutenu`,
  },
  summarizer: {
    ar: `أنت مساعد أكاديمي متخصص في التلخيص وتوفير المراجع.
عند استلام نص، قم بـ:
1. تلخيص المحتوى مع الحفاظ على الأفكار الجوهرية (تحت عنوان 📝 الملخص)
2. اقتراح 3-5 مراجع أكاديمية حقيقية ذات صلة بالموضوع (تحت عنوان 📚 مراجع أكاديمية مقترحة)
   - لكل مرجع: اسم المؤلف، السنة، العنوان، المجلة/الناشر
   - أضف رابط scholar.google.com أو researchgate.net عند الإمكان
   - استخدم مراجع حقيقية ومعروفة في المجال
اكتب بالعربية الفصحى حصراً.`,
    fr: `Tu es un assistant académique spécialisé dans le résumé et la fourniture de références.
À la réception d'un texte, effectue :
1. Un résumé du contenu en préservant les idées essentielles (sous le titre 📝 Résumé)
2. La suggestion de 3 à 5 références académiques réelles pertinentes au sujet (sous le titre 📚 Références académiques suggérées)
   - Pour chaque référence : nom de l'auteur, année, titre, revue/éditeur
   - Ajoute un lien scholar.google.com ou researchgate.net si possible
   - Utilise des références réelles et reconnues dans le domaine
Rédige exclusivement en français.`,
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { module, input, lang = "ar" } = await req.json();

    if (!module || !input) {
      return new Response(JSON.stringify({ error: "module and input are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const modulePrompts = SYSTEM_PROMPTS[module];
    if (!modulePrompts) {
      return new Response(JSON.stringify({ error: `Unknown module: ${module}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = modulePrompts[lang] || modulePrompts["ar"];

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

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
          { role: "user", content: input },
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
        const msg = lang === "fr" ? "Veuillez recharger votre crédit IA dans les paramètres." : "يرجى شحن رصيد الذكاء الاصطناعي في إعدادات المنصة.";
        return new Response(JSON.stringify({ error: msg }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      const msg = lang === "fr" ? "Erreur du service d'intelligence artificielle" : "حدث خطأ في خدمة الذكاء الاصطناعي";
      return new Response(JSON.stringify({ error: msg }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("academic-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
