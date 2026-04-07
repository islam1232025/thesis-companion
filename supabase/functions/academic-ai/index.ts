import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  planner: `أنت مساعد أكاديمي متخصص في التخطيط لمذكرات التخرج. عند استلام عنوان أو فكرة، قم بتوليد:
1. إشكالية مقترحة واضحة ومحددة
2. فهرس تفصيلي يشمل فصولاً رئيسية (3 فصول على الأقل) مع عناوين فرعية لكل فصل
3. خاتمة وتوصيات مقترحة

استخدم تنسيقاً واضحاً مع رموز إيموجي للعناوين. اكتب بالعربية الفصحى الأكاديمية.`,

  humanizer: `أنت خبير في إعادة صياغة النصوص الأكاديمية لجعلها تبدو ككتابة بشرية أصيلة.
قواعدك:
- أعد صياغة النص بالكامل مع الحفاظ على المعنى الأكاديمي
- نوّع في البنية اللغوية والتراكيب النحوية
- استخدم مرادفات متنوعة وتعبيرات أكاديمية طبيعية
- تجنب الأنماط المتكررة التي تكشف النص كمخرج ذكاء اصطناعي
- حافظ على المستوى الأكاديمي والعلمي للنص
- إذا كان النص بالفرنسية، أعد صياغته بالفرنسية مع نفس القواعد
- لا تضف تعليقات أو ملاحظات، فقط أعد النص المعاد صياغته`,

  expander: `أنت مساعد أكاديمي متخصص في توسيع وإثراء المحتوى الأكاديمي.
قواعدك:
- وسّع الفقرة المدخلة بإضافة شروحات نظرية معمّقة
- أضف مصطلحات أكاديمية متخصصة ذات صلة
- اربط المحتوى بالإطار المفاهيمي والنظري
- أضف أمثلة وتحليلات علمية
- حافظ على التماسك المنطقي والأسلوب الأكاديمي
- ضاعف حجم النص تقريباً مع الحفاظ على الجودة
- اكتب بنفس لغة النص المدخل (عربية أو فرنسية)`,

  summarizer: `أنت مساعد أكاديمي متخصص في التلخيص وتوفير المراجع.
عند استلام نص، قم بـ:
1. تلخيص المحتوى مع الحفاظ على الأفكار الجوهرية (تحت عنوان 📝 الملخص)
2. اقتراح 3-5 مراجع أكاديمية حقيقية ذات صلة بالموضوع (تحت عنوان 📚 مراجع أكاديمية مقترحة)
   - لكل مرجع: اسم المؤلف، السنة، العنوان، المجلة/الناشر
   - أضف رابط scholar.google.com أو researchgate.net عند الإمكان
   - استخدم مراجع حقيقية ومعروفة في المجال
اكتب بنفس لغة النص المدخل.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { module, input } = await req.json();

    if (!module || !input) {
      return new Response(JSON.stringify({ error: "module and input are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = SYSTEM_PROMPTS[module];
    if (!systemPrompt) {
      return new Response(JSON.stringify({ error: `Unknown module: ${module}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
        return new Response(JSON.stringify({ error: "تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "يرجى شحن رصيد الذكاء الاصطناعي في إعدادات المنصة." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "حدث خطأ في خدمة الذكاء الاصطناعي" }), {
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
