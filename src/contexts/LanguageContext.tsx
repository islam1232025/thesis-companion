import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "ar" | "fr";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const translations: Record<string, Record<Lang, string>> = {
  // App Header
  "app.name": { ar: "أكاديميا", fr: "Académia" },
  "nav.planner": { ar: "التخطيط", fr: "Planification" },
  "nav.humanizer": { ar: "الأنسنة", fr: "Humanisation" },
  "nav.expander": { ar: "التوسيع", fr: "Expansion" },
  "nav.summarizer": { ar: "التلخيص", fr: "Résumé" },

  // Hero
  "hero.title1": { ar: "مساعدك الذكي لإعداد", fr: "Votre assistant intelligent pour" },
  "hero.title2": { ar: "مذكرات التخرج", fr: "les mémoires de fin d'études" },
  "hero.subtitle": {
    ar: "من الفكرة الأولى إلى المخرج الأكاديمي النهائي — أدوات ذكية للتخطيط، الصياغة، التوسيع، والتوثيق.",
    fr: "De la première idée au résultat académique final — des outils intelligents pour la planification, la rédaction, l'expansion et la documentation.",
  },
  "home.modules": { ar: "الوحدات المتاحة", fr: "Modules disponibles" },

  // Module cards
  "planner.title": { ar: "التخطيط الأكاديمي", fr: "Planification académique" },
  "planner.desc": {
    ar: "حوّل فكرة مذكرتك إلى خطة عمل كاملة: إشكالية، فهرس تفصيلي، عناوين رئيسية وفرعية.",
    fr: "Transformez votre idée en un plan de travail complet : problématique, sommaire détaillé, titres principaux et secondaires.",
  },
  "humanizer.title": { ar: "أنسنة النصوص", fr: "Humanisation de textes" },
  "humanizer.desc": {
    ar: "أعد صياغة النصوص لتبدو ككتابة بشرية أصيلة مع تخطي كواشف الذكاء الاصطناعي.",
    fr: "Reformulez vos textes pour qu'ils paraissent écrits naturellement, en contournant les détecteurs d'IA.",
  },
  "expander.title": { ar: "توسيع المحتوى", fr: "Expansion du contenu" },
  "expander.desc": {
    ar: "أثرِ فقراتك القصيرة بمحتوى معمّق ومصطلحات أكاديمية متخصصة.",
    fr: "Enrichissez vos paragraphes courts avec un contenu approfondi et une terminologie académique spécialisée.",
  },
  "summarizer.title": { ar: "التلخيص والمراجع", fr: "Résumé & Références" },
  "summarizer.desc": {
    ar: "لخّص المحتوى الطويل واحصل على مصادر أكاديمية حقيقية تتوافق مع سياق فقراتك.",
    fr: "Résumez le contenu long et obtenez des sources académiques réelles correspondant au contexte de vos paragraphes.",
  },
  "card.cta": { ar: "ابدأ الآن ←", fr: "Commencer →" },

  // Planner page
  "planner.subtitle": { ar: "حوّل فكرتك إلى خطة عمل أكاديمية متكاملة", fr: "Transformez votre idée en un plan académique complet" },
  "planner.inputLabel": { ar: "عنوان أو فكرة المذكرة", fr: "Titre ou idée du mémoire" },
  "planner.placeholder": {
    ar: "مثال: أثر التسويق الرقمي على سلوك المستهلك الجزائري...",
    fr: "Exemple : L'impact du marketing digital sur le comportement du consommateur algérien...",
  },
  "planner.generate": { ar: "توليد الخطة", fr: "Générer le plan" },
  "planner.generating": { ar: "جارٍ التوليد...", fr: "Génération en cours..." },
  "planner.resultLabel": { ar: "الخطة المقترحة", fr: "Plan proposé" },
  "planner.resultEmpty": { ar: "ستظهر الخطة هنا بعد التوليد", fr: "Le plan apparaîtra ici après la génération" },

  // Humanizer page
  "humanizer.subtitle": { ar: "اجعل نصوصك تبدو ككتابة بشرية أصيلة", fr: "Rendez vos textes authentiquement humains" },
  "humanizer.inputLabel": { ar: "النص الأصلي", fr: "Texte original" },
  "humanizer.placeholder": { ar: "الصق النص الذي تريد أنسنته هنا...", fr: "Collez le texte à humaniser ici..." },
  "humanizer.run": { ar: "أنسنة النص", fr: "Humaniser le texte" },
  "humanizer.running": { ar: "جارٍ المعالجة...", fr: "Traitement en cours..." },
  "humanizer.resultLabel": { ar: "النص بعد الأنسنة", fr: "Texte humanisé" },
  "humanizer.resultEmpty": { ar: "سيظهر النص المعاد صياغته هنا", fr: "Le texte reformulé apparaîtra ici" },

  // Expander page
  "expander.subtitle": { ar: "أثرِ فقراتك بمحتوى أكاديمي معمّق", fr: "Enrichissez vos paragraphes avec un contenu académique approfondi" },
  "expander.inputLabel": { ar: "الفقرة المراد توسيعها", fr: "Paragraphe à développer" },
  "expander.placeholder": { ar: "اكتب أو الصق الفقرة القصيرة هنا...", fr: "Écrivez ou collez le paragraphe court ici..." },
  "expander.run": { ar: "توسيع الفقرة", fr: "Développer le paragraphe" },
  "expander.running": { ar: "جارٍ التوسيع...", fr: "Expansion en cours..." },
  "expander.resultLabel": { ar: "المحتوى الموسع", fr: "Contenu développé" },
  "expander.resultEmpty": { ar: "سيظهر المحتوى الموسع هنا", fr: "Le contenu développé apparaîtra ici" },

  // Summarizer page
  "summarizer.subtitle": { ar: "لخّص محتواك واحصل على مصادر أكاديمية متوافقة", fr: "Résumez votre contenu et obtenez des sources académiques" },
  "summarizer.inputLabel": { ar: "النص المراد تلخيصه", fr: "Texte à résumer" },
  "summarizer.placeholder": { ar: "الصق النص الطويل هنا للحصول على ملخص ومراجع...", fr: "Collez le texte long ici pour obtenir un résumé et des références..." },
  "summarizer.run": { ar: "تلخيص + مراجع", fr: "Résumer + Références" },
  "summarizer.running": { ar: "جارٍ المعالجة...", fr: "Traitement en cours..." },
  "summarizer.resultLabel": { ar: "الملخص والمراجع", fr: "Résumé et références" },
  "summarizer.resultEmpty": { ar: "سيظهر الملخص والمراجع هنا", fr: "Le résumé et les références apparaîtront ici" },

  // Common
  "error.title": { ar: "خطأ", fr: "Erreur" },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("app-lang");
    return (saved === "fr" ? "fr" : "ar") as Lang;
  });

  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem("app-lang", newLang);
  };

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
