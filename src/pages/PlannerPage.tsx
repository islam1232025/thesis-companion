import { useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const PlannerPage = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    // Simulated output for now — will connect to AI later
    setTimeout(() => {
      setResult(`📋 خطة مذكرة: "${input}"

🔹 الإشكالية المقترحة:
كيف يمكن دراسة وتحليل "${input}" في ظل التحديات المعاصرة؟

🔹 الفهرس التفصيلي:

الفصل الأول: الإطار النظري والمفاهيمي
  1.1 تعريف المفاهيم الأساسية
  1.2 الدراسات السابقة
  1.3 النظريات المرتبطة

الفصل الثاني: الإطار المنهجي
  2.1 منهجية البحث
  2.2 أدوات جمع البيانات
  2.3 عينة الدراسة

الفصل الثالث: الدراسة الميدانية
  3.1 عرض النتائج
  3.2 تحليل البيانات
  3.3 مناقشة النتائج

الخاتمة والتوصيات`);
      setLoading(false);
    }, 1500);
  };

  return (
    <ModuleLayout title="التخطيط الأكاديمي" subtitle="حوّل فكرتك إلى خطة عمل أكاديمية متكاملة" icon={BookOpen}>
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-6 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <label className="text-sm font-semibold text-foreground">عنوان أو فكرة المذكرة</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="مثال: أثر التسويق الرقمي على سلوك المستهلك الجزائري..."
            className="min-h-[140px] resize-none text-right"
            dir="rtl"
          />
          <Button onClick={handleGenerate} disabled={loading || !input.trim()} className="w-full">
            {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "جارٍ التوليد..." : "توليد الخطة"}
          </Button>
        </Card>

        <Card className="p-6 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <label className="text-sm font-semibold text-foreground">الخطة المقترحة</label>
          {result ? (
            <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm leading-7 text-foreground" dir="rtl">
              {result}
            </pre>
          ) : (
            <div className="mt-3 flex h-[200px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              ستظهر الخطة هنا بعد التوليد
            </div>
          )}
        </Card>
      </div>
    </ModuleLayout>
  );
};

export default PlannerPage;
