import { useState, useRef } from "react";
import { BriefcaseBusiness, Loader2, Copy, Check, Upload } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { streamAI } from "@/lib/streamAI";
import { extractPdfText } from "@/lib/extractPdfText";
import { useLanguage } from "@/contexts/LanguageContext";

const EmployabilityPage = () => {
  const [thesisTitle, setThesisTitle] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState("");
  const [pdfText, setPdfText] = useState("");
  const resultRef = useRef("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t, lang, dir } = useLanguage();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: t("error.title"), description: t("employability.invalidFile"), variant: "destructive" });
      return;
    }
    setFileName(file.name);
    setExtracting(true);

    try {
      const text = await extractPdfText(file);
      if (!text.trim()) {
        toast({ title: t("error.title"), description: t("employability.emptyPdf"), variant: "destructive" });
        setExtracting(false);
        return;
      }
      setPdfText(text);
      setExtracting(false);
    } catch {
      setExtracting(false);
      toast({ title: t("error.title"), description: t("employability.extractError"), variant: "destructive" });
    }
  };

  const handleAnalyze = async () => {
    if (!pdfText.trim() || !thesisTitle.trim()) return;
    setLoading(true);
    setResult("");
    resultRef.current = "";

    const combinedInput = `[THESIS_TITLE]: ${thesisTitle.trim()}\n\n[PDF_CONTENT]: ${pdfText.slice(0, 15000)}`;

    await streamAI({
      module: "employability",
      input: combinedInput,
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
    <ModuleLayout title={t("employability.title")} subtitle={t("employability.subtitle")} icon={BriefcaseBusiness}>
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-6 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <label className="text-sm font-semibold text-foreground">{t("employability.titleLabel")}</label>
          <Input
            value={thesisTitle}
            onChange={(e) => setThesisTitle(e.target.value)}
            placeholder={t("employability.titlePlaceholder")}
            dir={dir}
          />

          <label className="text-sm font-semibold text-foreground">{t("employability.fileLabel")}</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30 p-4 transition-colors hover:border-primary/50 hover:bg-muted/50"
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("employability.uploadHint")}</p>
            {fileName && <p className="text-xs font-medium text-primary">{fileName}</p>}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />

          {extracting && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("employability.extracting")}
            </div>
          )}

          <Button onClick={handleAnalyze} disabled={loading || extracting || !pdfText.trim() || !thesisTitle.trim()} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin ltr:mr-2 rtl:ml-2" /> : null}
            {loading ? t("employability.analyzing") : t("employability.analyze")}
          </Button>
        </Card>

        <Card className="p-6 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">{t("employability.resultLabel")}</label>
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
              {t("employability.resultEmpty")}
            </div>
          )}
        </Card>
      </div>
    </ModuleLayout>
  );
};

export default EmployabilityPage;
