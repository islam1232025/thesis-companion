import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLang(lang === "ar" ? "fr" : "ar")}
      className="gap-1.5 text-xs font-medium"
    >
      <Languages className="h-4 w-4" />
      {lang === "ar" ? "FR" : "عربي"}
    </Button>
  );
};
