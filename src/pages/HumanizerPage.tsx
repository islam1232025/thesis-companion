import { useState } from "react";
import { PenTool, Loader2 } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const HumanizerPage = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleHumanize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult(
        "تمت إعادة صياغة النص بأسلوب بشري طبيعي مع الحفاظ على المعنى الأكاديمي الأصلي. " +
        "يُلاحظ أن العبارات أصبحت أكثر تنوعاً في البنية اللغوية، مما يجعلها تتخطى أدوات كشف الذكاء الاصطناعي بنسبة عالية.\n\n" +
        "「النص المعاد صياغته سيظهر هنا عند ربط المنصة بمحرك الذكاء الاصطناعي」"
      );
      setLoading(false);
    }, 1500);
  };

  return (
    <ModuleLayout title="أنسنة النصوص" subtitle="اجعل نصوصك تبدو ككتابة بشرية أصيلة" icon={PenTool}>
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-6 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <label className="text-sm font-semibold text-foreground">النص الأصلي</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="الصق النص الذي تريد أنسنته هنا..."
            className="min-h-[180px] resize-none text-right"
            dir="rtl"
          />
          <div className="flex gap-2">
            <Button onClick={handleHumanize} disabled={loading || !input.trim()} className="flex-1">
              {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "جارٍ المعالجة..." : "أنسنة النص"}
            </Button>
          </div>
        </Card>

        <Card className="p-6 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <label className="text-sm font-semibold text-foreground">النص بعد الأنسنة</label>
          {result ? (
            <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm leading-7 text-foreground" dir="rtl">
              {result}
            </pre>
          ) : (
            <div className="mt-3 flex h-[200px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              سيظهر النص المعاد صياغته هنا
            </div>
          )}
        </Card>
      </div>
    </ModuleLayout>
  );
};

export default HumanizerPage;
