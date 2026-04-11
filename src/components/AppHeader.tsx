import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";
import { Button } from "./ui/button";

const navItems = [
  { key: "nav.planner", path: "/planner" },
  { key: "nav.humanizer", path: "/humanizer" },
  { key: "nav.expander", path: "/expander" },
  { key: "nav.summarizer", path: "/summarizer" },
  { key: "nav.pdfstudy", path: "/pdf-study" },
  { key: "nav.employability", path: "/employability" },
];

export const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-card/70 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <button onClick={() => handleNav("/")} className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t("app.name")}
          </span>
        </button>

        <div className="flex items-center gap-3">
          {/* Desktop nav */}
          <nav className="hidden gap-1 text-sm font-medium lg:flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || location.hash === `#${item.path}`;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`rounded-lg px-3 py-1.5 transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {t(item.key)}
                </button>
              );
            })}
          </nav>

          <LanguageToggle />

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/40 bg-card/95 backdrop-blur-xl lg:hidden animate-fade-up" style={{ animationDuration: "200ms" }}>
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || location.hash === `#${item.path}`;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`rounded-xl px-4 py-3 text-start text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  {t(item.key)}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
