import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: "primary" | "secondary" | "accent" | "destructive";
  delay: number;
}

const colorMap = {
  primary: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
  secondary: "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground",
  accent: "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground",
  destructive: "bg-destructive/10 text-destructive group-hover:bg-destructive group-hover:text-destructive-foreground",
};

const glowMap = {
  primary: "group-hover:shadow-primary/20",
  secondary: "group-hover:shadow-secondary/20",
  accent: "group-hover:shadow-accent/20",
  destructive: "group-hover:shadow-destructive/20",
};

export const ModuleCard = ({ title, description, icon: Icon, path, color, delay }: ModuleCardProps) => {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();

  return (
    <button
      onClick={() => navigate(path)}
      className={`group relative flex flex-col items-start gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 ${glowMap[color]} opacity-0 animate-fade-up ${dir === "rtl" ? "text-right" : "text-left"}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className={`rounded-xl p-3 ${colorMap[color]} transition-all duration-300`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-card-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">{description}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
        {t("card.cta")}
      </span>
    </button>
  );
};
