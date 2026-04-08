import { useState, useRef } from "react";
import { PenTool, Loader2, Copy, Check } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { streamAI } from "@/lib/streamAI";
import { useLanguage } from "@/contexts/LanguageContext";

const HumanizerPage = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef("");
  const { toast } = useToast();
  const { t, lang, dir } = useLanguage();

  const handleHumanize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult("");
    resultRef.current = "";

    await streamAI({
      module: "humanizer",
      input: input.trim(),
      lang,
      onDelta: (chunk) => {
        resultRef.current += chunk;
        setResult(resultRef.current);
      },
      onDone: () => setLoading(false),
      onError: (msg) => {
        setLoading(false);
        toast({ title: t("error.title"), description: msg, variant: "destructive" });
      },
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModuleLayout title={t("humanizer.title")} subtitle={t("humanizer.subtitle")} icon={PenTool}>
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-6 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <label className="text-sm font-semibold text-foreground">{t("humanizer.inputLabel")}</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("humanizer.placeholder")}
            className="min-h-[180px] resize-none"
            dir={dir}
          />
          <Button onClick={handleHumanize} disabled={loading || !input.trim()} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin ltr:mr-2 rtl:ml-2" /> : null}
            {loading ? t("humanizer.running") : t("humanizer.run")}
          </Button>
        </Card>

        <Card className="p-6 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">{t("humanizer.resultLabel")}</label>
            {result && (
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            )}
          </div>
          {result ? (
            <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm leading-7 text-foreground" dir={dir}>
              {result}
              {loading && <span className="inline-block w-2 h-4 bg-primary animate-pulse mx-1" />}
            </pre>
          ) : (
            <div className="mt-3 flex h-[200px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              {t("humanizer.resultEmpty")}
            </div>
          )}
        </Card>
      </div>
    </ModuleLayout>
  );
};

export default HumanizerPage;
