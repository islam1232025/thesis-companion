import { useState, useRef } from "react";
import { ClipboardCheck, Loader2, Copy, Check, Upload } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { streamAI } from "@/lib/streamAI";
import { extractPdfText } from "@/lib/extractPdfText";
import { useLanguage } from "@/contexts/LanguageContext";

const ThesisReviewPage = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState("");
  const resultRef = useRef("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t, lang, dir } = useLanguage();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: t("error.title"), description: t("thesisreview.invalidFile"), variant: "destructive" });
      return;
    }
    setFileName(file.name);
    setExtracting(true);
    setResult("");
    resultRef.current = "";

    try {
      const text = await extractPdfText(file);
      if (!text.trim()) {
        toast({ title: t("error.title"), description: t("thesisreview.emptyPdf"), variant: "destructive" });
        setExtracting(false);
        return;
      }
      setExtracting(false);
      setLoading(true);

      await streamAI({
        module: "thesisreview",
        input: text.slice(0, 30000),
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
    } catch {
      setExtracting(false);
      setLoading(false);
      toast({ title: t("error.title"), description: t("thesisreview.extractError"), variant: "destructive" });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModuleLayout title={t("thesisreview.title")} subtitle={t("thesisreview.subtitle")} icon={ClipboardCheck}>
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-6 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <label className="text-sm font-semibold text-foreground">{t("thesisreview.inputLabel")}</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30 p-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
          >
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("thesisreview.uploadHint")}</p>
            {fileName && <p className="text-xs font-medium text-primary">{fileName}</p>}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          {(extracting || loading) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {extracting ? t("thesisreview.extracting") : t("thesisreview.generating")}
            </div>
          )}
        </Card>

        <Card className="p-6 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">{t("thesisreview.resultLabel")}</label>
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
              {t("thesisreview.resultEmpty")}
            </div>
          )}
        </Card>
      </div>
    </ModuleLayout>
  );
};

export default ThesisReviewPage;
