import { useState, useRef } from "react";
import { PenTool, Loader2, Copy, Check } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { streamAI } from "@/lib/streamAI";

const HumanizerPage = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef("");
  const { toast } = useToast();

  const handleHumanize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult("");
    resultRef.current = "";

    await streamAI({
      module: "humanizer",
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
          <Button onClick={handleHumanize} disabled={loading || !input.trim()} className="w-full">
            {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "جارٍ المعالجة..." : "أنسنة النص"}
          </Button>
        </Card>

        <Card className="p-6 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">النص بعد الأنسنة</label>
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
              سيظهر النص المعاد صياغته هنا
            </div>
          )}
        </Card>
      </div>
    </ModuleLayout>
  );
};

export default HumanizerPage;
