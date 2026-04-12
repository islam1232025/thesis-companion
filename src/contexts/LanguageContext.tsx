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
  "pdfstudy.title": { ar: "دراسة ملف PDF", fr: "Étude de fichier PDF" },
  "pdfstudy.desc": {
    ar: "ارفع ملف PDF لدراسته وتلخيصه وتحويله إلى شابتر أكاديمي قابل للتوظيف في مذكرة التخرج.",
    fr: "Téléchargez un fichier PDF pour l'étudier, le résumer et le convertir en chapitre académique utilisable dans un mémoire.",
  },
  "pdfstudy.subtitle": { ar: "حوّل ملف PDF إلى شابتر أكاديمي جاهز للتوظيف", fr: "Convertissez un fichier PDF en chapitre académique prêt à l'emploi" },
  "pdfstudy.inputLabel": { ar: "رفع ملف PDF", fr: "Télécharger un fichier PDF" },
  "pdfstudy.uploadHint": { ar: "اضغط هنا لرفع ملف PDF", fr: "Cliquez ici pour télécharger un fichier PDF" },
  "pdfstudy.extracting": { ar: "جارٍ استخراج النص من الملف...", fr: "Extraction du texte en cours..." },
  "pdfstudy.generating": { ar: "جارٍ التحليل والتوليد...", fr: "Analyse et génération en cours..." },
  "pdfstudy.resultLabel": { ar: "الشابتر المقترح", fr: "Chapitre proposé" },
  "pdfstudy.resultEmpty": { ar: "سيظهر الشابتر هنا بعد رفع الملف", fr: "Le chapitre apparaîtra ici après le téléchargement" },
  "pdfstudy.invalidFile": { ar: "يرجى رفع ملف PDF فقط", fr: "Veuillez télécharger un fichier PDF uniquement" },
  "pdfstudy.emptyPdf": { ar: "الملف فارغ أو لا يمكن قراءته", fr: "Le fichier est vide ou illisible" },
  "pdfstudy.extractError": { ar: "حدث خطأ أثناء قراءة الملف", fr: "Erreur lors de la lecture du fichier" },

  "employability.title": { ar: "دراسة قابلية التوظيف", fr: "Étude d'employabilité" },
  "employability.desc": {
    ar: "ارفع ملف PDF مع عنوان المذكرة لدراسة قابلية توظيف محتواه واقتراح ملخصات وعناوين جاهزة.",
    fr: "Téléchargez un PDF avec le titre du mémoire pour analyser l'employabilité du contenu et proposer des résumés et titres prêts.",
  },
  "employability.subtitle": { ar: "حلل مدى توافق محتوى الملف مع مذكرة التخرج", fr: "Analysez la compatibilité du contenu avec votre mémoire" },
  "employability.titleLabel": { ar: "عنوان المذكرة", fr: "Titre du mémoire" },
  "employability.titlePlaceholder": { ar: "أدخل عنوان مذكرة التخرج هنا...", fr: "Entrez le titre du mémoire ici..." },
  "employability.fileLabel": { ar: "ملف PDF المرجعي", fr: "Fichier PDF de référence" },
  "employability.uploadHint": { ar: "اضغط لرفع ملف PDF", fr: "Cliquez pour télécharger un PDF" },
  "employability.extracting": { ar: "جارٍ استخراج النص...", fr: "Extraction du texte..." },
  "employability.analyze": { ar: "تحليل القابلية", fr: "Analyser l'employabilité" },
  "employability.analyzing": { ar: "جارٍ التحليل...", fr: "Analyse en cours..." },
  "employability.resultLabel": { ar: "نتيجة التحليل", fr: "Résultat de l'analyse" },
  "employability.resultEmpty": { ar: "ستظهر نتيجة التحليل هنا", fr: "Le résultat de l'analyse apparaîtra ici" },
  "employability.invalidFile": { ar: "يرجى رفع ملف PDF فقط", fr: "Veuillez télécharger un fichier PDF uniquement" },
  "employability.emptyPdf": { ar: "الملف فارغ أو لا يمكن قراءته", fr: "Le fichier est vide ou illisible" },
  "employability.extractError": { ar: "حدث خطأ أثناء قراءة الملف", fr: "Erreur lors de la lecture du fichier" },

  "nav.pdfstudy": { ar: "دراسة PDF", fr: "Étude PDF" },
  "nav.employability": { ar: "قابلية التوظيف", fr: "Employabilité" },
  "nav.thesisreview": { ar: "نقد المذكرة", fr: "Critique du mémoire" },

  "thesisreview.title": { ar: "نقد وتحليل المذكرة", fr: "Critique et analyse du mémoire" },
  "thesisreview.desc": {
    ar: "ارفع ملف PDF لمذكرة تخرجك واحصل على تقرير نقدي شامل يتضمن تحليل العنوان، نقد الهيكلية، مؤشر التماسك، ونقاط القوة والضعف مع اقتراحات التحسين.",
    fr: "Téléchargez le PDF de votre mémoire et obtenez un rapport critique complet incluant l'analyse du titre, la critique structurelle, le score de cohésion, les forces et faiblesses avec des suggestions d'amélioration.",
  },
  "thesisreview.subtitle": { ar: "احصل على تقرير نقدي وهيكلي شامل لمذكرة تخرجك", fr: "Obtenez un rapport critique et structurel complet de votre mémoire" },
  "thesisreview.inputLabel": { ar: "رفع ملف المذكرة (PDF)", fr: "Télécharger le mémoire (PDF)" },
  "thesisreview.uploadHint": { ar: "اضغط هنا لرفع ملف PDF لمذكرة التخرج", fr: "Cliquez ici pour télécharger le PDF du mémoire" },
  "thesisreview.extracting": { ar: "جارٍ استخراج النص من المذكرة...", fr: "Extraction du texte du mémoire..." },
  "thesisreview.generating": { ar: "جارٍ التحليل النقدي والهيكلي...", fr: "Analyse critique et structurelle en cours..." },
  "thesisreview.resultLabel": { ar: "التقرير النقدي", fr: "Rapport critique" },
  "thesisreview.resultEmpty": { ar: "سيظهر التقرير النقدي هنا بعد رفع ملف المذكرة", fr: "Le rapport critique apparaîtra ici après le téléchargement du mémoire" },
  "thesisreview.invalidFile": { ar: "يرجى رفع ملف PDF فقط", fr: "Veuillez télécharger un fichier PDF uniquement" },
  "thesisreview.emptyPdf": { ar: "الملف فارغ أو لا يمكن قراءته", fr: "Le fichier est vide ou illisible" },
  "thesisreview.extractError": { ar: "حدث خطأ أثناء قراءة الملف", fr: "Erreur lors de la lecture du fichier" },

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
