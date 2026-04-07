import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: "primary" | "secondary" | "accent" | "destructive";
  delay: number;
}

const colorMap = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
  destructive: "bg-destructive/10 text-destructive",
};

const borderMap = {
  primary: "hover:border-primary/40",
  secondary: "hover:border-secondary/40",
  accent: "hover:border-accent/40",
  destructive: "hover:border-destructive/40",
};

export const ModuleCard = ({ title, description, icon: Icon, path, color, delay }: ModuleCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className={`group relative flex flex-col items-start gap-4 rounded-xl border bg-card p-6 text-right shadow-[var(--card-shadow)] transition-all duration-300 hover:shadow-[var(--card-hover-shadow)] hover:-translate-y-1 ${borderMap[color]} opacity-0 animate-fade-up`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className={`rounded-lg p-3 ${colorMap[color]} transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <span className="mt-auto text-xs font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        ابدأ الآن ←
      </span>
    </button>
  );
};
