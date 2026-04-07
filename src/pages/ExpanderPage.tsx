import { useState, useRef } from "react";
import { Expand, Loader2, Copy, Check } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { streamAI } from "@/lib/streamAI";

const ExpanderPage = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef("");
  const { toast } = useToast();

  const handleExpand = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult("");
    resultRef.current = "";

    await streamAI({
      module: "expander",
      input: input.trim(),
      onDelta: (chunk) => {
        resultRef.current += chunk;
        setResult(resultRef.current);
      },
      onDone: () => setLoading(false),
      onError: (msg) => {
        setLoading(false);
        toast({ title: "خطأ", description: msg, variant: "destructive" });
      },
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">المحتوى الموسع</label>
            {result && (
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            )}
          </div>
          {result ? (
            <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm leading-7 text-foreground" dir="rtl">
              {result}
              {loading && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />}
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
