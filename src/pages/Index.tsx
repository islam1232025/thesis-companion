import { GraduationCap, BookOpen, PenTool, Expand, FileSearch } from "lucide-react";
import { ModuleCard } from "@/components/ModuleCard";
import { AppHeader } from "@/components/AppHeader";

const modules = [
  {
    title: "التخطيط الأكاديمي",
    description: "حوّل فكرة مذكرتك إلى خطة عمل كاملة: إشكالية، فهرس تفصيلي، عناوين رئيسية وفرعية.",
    icon: BookOpen,
    path: "/planner",
    color: "primary" as const,
  },
  {
    title: "أنسنة النصوص",
    description: "أعد صياغة النصوص لتبدو ككتابة بشرية أصيلة مع تخطي كواشف الذكاء الاصطناعي.",
    icon: PenTool,
    path: "/humanizer",
    color: "secondary" as const,
  },
  {
    title: "توسيع المحتوى",
    description: "أثرِ فقراتك القصيرة بمحتوى معمّق ومصطلحات أكاديمية متخصصة.",
    icon: Expand,
    path: "/expander",
    color: "accent" as const,
  },
  {
    title: "التلخيص والمراجع",
    description: "لخّص المحتوى الطويل واحصل على مصادر أكاديمية حقيقية تتوافق مع سياق فقراتك.",
    icon: FileSearch,
    path: "/summarizer",
    color: "destructive" as const,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <AppHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-primary via-primary to-primary/80 px-4 py-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(220_70%_55%/0.4),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-2xl space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10 animate-float backdrop-blur">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold leading-tight text-primary-foreground opacity-0 animate-fade-up md:text-5xl">
            مساعدك الذكي لإعداد
            <br />
            <span className="text-secondary">مذكرات التخرج</span>
          </h1>
          <p className="mx-auto max-w-lg text-base leading-relaxed text-primary-foreground/80 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
            من الفكرة الأولى إلى المخرج الأكاديمي النهائي — أدوات ذكية للتخطيط، الصياغة، التوسيع، والتوثيق.
          </p>
        </div>
      </section>

      {/* Modules */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-10 text-center text-2xl font-bold text-foreground">الوحدات المتاحة</h2>
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {modules.map((m, i) => (
            <ModuleCard key={m.path} {...m} delay={i * 120} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
