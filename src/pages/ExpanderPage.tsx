import { useState } from "react";
import { Expand, Loader2 } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const ExpanderPage = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExpand = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult(
        "تم توسيع الفقرة بإضافة مصطلحات أكاديمية متخصصة وتعميق التحليل العلمي. " +
        "تمت إضافة شروحات نظرية وربط المحتوى بالإطار المفاهيمي للدراسة.\n\n" +
        "「المحتوى الموسع سيظهر هنا عند ربط المنصة بمحرك الذكاء الاصطناعي」"
      );
      setLoading(false);
    }, 1500);
  };

  return (
    <ModuleLayout title="توسيع المحتوى" subtitle="أثرِ فقراتك بمحتوى أكاديمي معمّق" icon={Expand}>
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-6 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <label className="text-sm font-semibold text-foreground">الفقرة المراد توسيعها</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب أو الصق الفقرة القصيرة هنا..."
            className="min-h-[180px] resize-none text-right"
            dir="rtl"
          />
          <Button onClick={handleExpand} disabled={loading || !input.trim()} className="w-full">
            {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "جارٍ التوسيع..." : "توسيع الفقرة"}
          </Button>
        </Card>

        <Card className="p-6 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <label className="text-sm font-semibold text-foreground">المحتوى الموسع</label>
          {result ? (
            <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm leading-7 text-foreground" dir="rtl">
              {result}
            </pre>
          ) : (
            <div className="mt-3 flex h-[200px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              سيظهر المحتوى الموسع هنا
            </div>
          )}
        </Card>
      </div>
    </ModuleLayout>
  );
};

export default ExpanderPage;
