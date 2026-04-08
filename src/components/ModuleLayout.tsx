import { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ModuleLayoutProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  children: ReactNode;
}

export const ModuleLayout = ({ title, subtitle, icon: Icon, children }: ModuleLayoutProps) => {
  const { dir } = useLanguage();

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-3 opacity-0 animate-fade-up">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
};
