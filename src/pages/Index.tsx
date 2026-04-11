import { useEffect, useState } from "react";
import { GraduationCap, BookOpen, PenTool, Expand, FileSearch, FileText, BriefcaseBusiness, Sparkles } from "lucide-react";
import { ModuleCard } from "@/components/ModuleCard";
import { AppHeader } from "@/components/AppHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { t, dir } = useLanguage();

  const modules = [
    { titleKey: "planner.title", descKey: "planner.desc", icon: BookOpen, path: "/planner", color: "primary" as const },
    { titleKey: "humanizer.title", descKey: "humanizer.desc", icon: PenTool, path: "/humanizer", color: "secondary" as const },
    { titleKey: "expander.title", descKey: "expander.desc", icon: Expand, path: "/expander", color: "accent" as const },
    { titleKey: "summarizer.title", descKey: "summarizer.desc", icon: FileSearch, path: "/summarizer", color: "destructive" as const },
    { titleKey: "pdfstudy.title", descKey: "pdfstudy.desc", icon: FileText, path: "/pdf-study", color: "primary" as const },
    { titleKey: "employability.title", descKey: "employability.desc", icon: BriefcaseBusiness, path: "/employability", color: "secondary" as const },
  ];

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <AppHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/80 px-4 py-16 sm:py-24 text-center">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,hsl(220_70%_60%/0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,hsl(38_80%_55%/0.15),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl space-y-8">
          <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-2xl bg-primary-foreground/10 animate-float backdrop-blur-sm border border-primary-foreground/10">
            <GraduationCap className="h-9 w-9 text-primary-foreground" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-primary-foreground opacity-0 animate-fade-up">
              {t("hero.title1")}
              <br />
              <span className="bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent">
                {t("hero.title2")}
              </span>
            </h1>
            <p className="mx-auto max-w-lg text-sm sm:text-base leading-relaxed text-primary-foreground/75 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="mb-10 text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary opacity-0 animate-fade-up">
            <Sparkles className="h-3.5 w-3.5" />
            {t("home.modules")}
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => (
            <ModuleCard key={m.path} title={t(m.titleKey)} description={t(m.descKey)} icon={m.icon} path={m.path} color={m.color} delay={i * 100} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground/60">
            <GraduationCap className="h-4 w-4" />
            <span>{t("app.name")} © 2026</span>
          </div>
          <AccessCounter />
        </div>
      </footer>
    </div>
  );
};

const AccessCounter = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("access_counter")
      .select("count")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) setCount(data.count);
      });
  }, []);

  if (count === null) return null;

  return (
    <span className="text-[10px] text-muted-foreground/25 select-none tabular-nums">{count}</span>
  );
};

export default Index;
