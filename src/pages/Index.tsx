import { GraduationCap, BookOpen, PenTool, Expand, FileSearch, FileText, BriefcaseBusiness } from "lucide-react";
import { ModuleCard } from "@/components/ModuleCard";
import { AppHeader } from "@/components/AppHeader";
import { useLanguage } from "@/contexts/LanguageContext";

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

      <section className="relative overflow-hidden bg-gradient-to-bl from-primary via-primary to-primary/80 px-4 py-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(220_70%_55%/0.4),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-2xl space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10 animate-float backdrop-blur">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold leading-tight text-primary-foreground opacity-0 animate-fade-up md:text-5xl">
            {t("hero.title1")}
            <br />
            <span className="text-secondary">{t("hero.title2")}</span>
          </h1>
          <p className="mx-auto max-w-lg text-base leading-relaxed text-primary-foreground/80 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-10 text-center text-2xl font-bold text-foreground">{t("home.modules")}</h2>
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {modules.map((m, i) => (
            <ModuleCard key={m.path} title={t(m.titleKey)} description={t(m.descKey)} icon={m.icon} path={m.path} color={m.color} delay={i * 120} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
