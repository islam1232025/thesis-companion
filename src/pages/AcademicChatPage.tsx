import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Paperclip, Trash2, FileText, Loader2, Bot, User, MessageSquare } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { extractPdfText } from "@/lib/extractPdfText";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  fileLabel?: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/academic-chat`;

const AcademicChatPage = () => {
  const { t, lang, dir } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; text: string } | null>(null);
  const [extracting, setExtracting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert(t("academicchat.invalidFile"));
      return;
    }
    setExtracting(true);
    try {
      const text = await extractPdfText(file);
      if (!text.trim()) {
        alert(t("academicchat.emptyPdf"));
        setExtracting(false);
        return;
      }
      const trimmed = text.slice(0, 30000);
      setAttachedFile({ name: file.name, text: trimmed });
    } catch {
      alert(t("academicchat.extractError"));
    } finally {
      setExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput && !attachedFile) return;
    if (isLoading) return;

    let userContent = trimmedInput;
    let fileLabel: string | undefined;

    if (attachedFile) {
      userContent = `[📎 ${attachedFile.name}]\n\n--- محتوى الملف المرفق ---\n${attachedFile.text}\n--- نهاية الملف ---\n\n${trimmedInput || (lang === "fr" ? "Analyse ce fichier s'il te plaît." : "حلّل هذا الملف من فضلك.")}`;
      fileLabel = attachedFile.name;
    }

    const userMsg: ChatMessage = {
      role: "user",
      content: userContent,
      fileLabel,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setAttachedFile(null);
    setIsLoading(true);

    let assistantContent = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          lang,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || `Error: ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // flush remaining
      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `❌ ${e.message || (lang === "fr" ? "Erreur de connexion" : "حدث خطأ في الاتصال")}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setAttachedFile(null);
    setInput("");
  };

  return (
    <ModuleLayout title={t("academicchat.title")} subtitle={t("academicchat.subtitle")} icon={MessageSquare}>
      <div className="flex flex-col h-[calc(100vh-220px)] max-h-[700px] bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" dir={dir}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground/60 gap-3 py-12">
              <Bot className="h-12 w-12 opacity-40" />
              <p className="text-sm max-w-xs">{t("academicchat.placeholder")}</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 max-w-[80%] text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted/60 text-foreground rounded-bl-md"
                }`}
              >
                {msg.fileLabel && (
                  <div className="flex items-center gap-1.5 text-xs opacity-80 mb-2 font-medium">
                    <FileText className="h-3.5 w-3.5" />
                    {msg.fileLabel}
                  </div>
                )}
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-headings:my-2">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">
                    {msg.fileLabel
                      ? msg.content.split("--- نهاية الملف ---")[1]?.trim() || msg.content.split("--- fin du fichier ---")[1]?.trim() || (lang === "fr" ? "Fichier joint pour analyse" : "ملف مرفق للتحليل")
                      : msg.content}
                  </p>
                )}
              </div>
              {msg.role === "user" && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center mt-1">
                  <User className="h-4 w-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-muted/60 rounded-bl-md">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Attached file indicator */}
        {attachedFile && (
          <div className="mx-4 mb-2 flex items-center gap-2 rounded-xl bg-primary/5 border border-primary/20 px-3 py-2 text-xs text-primary">
            <FileText className="h-4 w-4" />
            <span className="truncate flex-1">{attachedFile.name}</span>
            <button onClick={() => setAttachedFile(null)} className="hover:text-destructive transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {extracting && (
          <div className="mx-4 mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {t("academicchat.extracting")}
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-border/40 p-3 flex items-end gap-2">
          <input
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-10 w-10 rounded-xl text-muted-foreground hover:text-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || extracting}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("academicchat.inputPlaceholder")}
            className="flex-1 min-h-[44px] max-h-[120px] resize-none rounded-xl border-border/60 bg-muted/30 text-sm"
            rows={1}
            disabled={isLoading}
            dir={dir}
          />
          <Button
            size="icon"
            className="flex-shrink-0 h-10 w-10 rounded-xl"
            onClick={sendMessage}
            disabled={isLoading || (!input.trim() && !attachedFile)}
          >
            <Send className="h-4 w-4" />
          </Button>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive"
              onClick={clearChat}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </ModuleLayout>
  );
};

export default AcademicChatPage;
