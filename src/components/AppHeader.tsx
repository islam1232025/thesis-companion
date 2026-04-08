import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";

export const AppHeader = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">{t("app.name")}</span>
        </button>
        <div className="flex items-center gap-4">
          <nav className="hidden gap-6 text-sm font-medium text-muted-foreground md:flex">
            <button onClick={() => navigate("/planner")} className="transition-colors hover:text-foreground">{t("nav.planner")}</button>
            <button onClick={() => navigate("/humanizer")} className="transition-colors hover:text-foreground">{t("nav.humanizer")}</button>
            <button onClick={() => navigate("/expander")} className="transition-colors hover:text-foreground">{t("nav.expander")}</button>
            <button onClick={() => navigate("/summarizer")} className="transition-colors hover:text-foreground">{t("nav.summarizer")}</button>
          </nav>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
};
