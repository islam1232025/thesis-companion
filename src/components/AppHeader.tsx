import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AppHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">أكاديميا</span>
        </button>
        <nav className="hidden gap-6 text-sm font-medium text-muted-foreground md:flex">
          <button onClick={() => navigate("/planner")} className="transition-colors hover:text-foreground">التخطيط</button>
          <button onClick={() => navigate("/humanizer")} className="transition-colors hover:text-foreground">الأنسنة</button>
          <button onClick={() => navigate("/expander")} className="transition-colors hover:text-foreground">التوسيع</button>
          <button onClick={() => navigate("/summarizer")} className="transition-colors hover:text-foreground">التلخيص</button>
        </nav>
      </div>
    </header>
  );
};
