import { useState } from "react";
import { FileSearch, Loader2 } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const SummarizerPage = () => {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setSummary(
`📝 الملخص:
تم تلخيص المحتوى المدخل مع الحفاظ على الأفكار الجوهرية والبنية المنطقية للنص الأصلي.

📚 مراجع أكاديمية مقترحة:

1. Smith, J. (2023). "Research Methodology in Social Sciences." Journal of Academic Research, 15(2), 45-62.
   🔗 scholar.google.com

2. أحمد، م. (2022). "مناهج البحث العلمي المعاصرة." مجلة العلوم الاجتماعية، 8(1)، 120-135.
   🔗 researchgate.net

3. Johnson, A. & Lee, B. (2024). "Modern Approaches to Academic Writing." Academic Press, pp. 89-112.
   🔗 scholar.google.com`
      );
      setLoading(false);
    }, 1500);
  };

  return (
    <ModuleLayout title="التلخيص والمراجع" subtitle="لخّص محتواك واحصل على مصادر أكاديمية متوافقة" icon={FileSearch}>
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-6 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <label className="text-sm font-semibold text-foreground">النص المراد تلخيصه</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="الصق النص الطويل هنا للحصول على ملخص ومراجع..."
            className="min-h-[180px] resize-none text-right"
            dir="rtl"
          />
          <Button onClick={handleSummarize} disabled={loading || !input.trim()} className="w-full">
            {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "جارٍ المعالجة..." : "تلخيص + مراجع"}
          </Button>
        </Card>

        <Card className="p-6 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <label className="text-sm font-semibold text-foreground">الملخص والمراجع</label>
          {summary ? (
            <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm leading-7 text-foreground" dir="rtl">
              {summary}
            </pre>
          ) : (
            <div className="mt-3 flex h-[200px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              سيظهر الملخص والمراجع هنا
            </div>
          )}
        </Card>
      </div>
    </ModuleLayout>
  );
};

export default SummarizerPage;
