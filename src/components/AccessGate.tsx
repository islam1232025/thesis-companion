import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, GraduationCap } from "lucide-react";

const STORAGE_KEY = "academia_access_granted";

const VERIFY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-access`;

export const useAccessGate = () => {
  const [granted, setGranted] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY) === "true";
  });

  const grant = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setGranted(true);
  };

  return { granted, grant };
};

interface AccessGateProps {
  onGranted: () => void;
}

export const AccessGate = ({ onGranted }: AccessGateProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || loading) return;

    setLoading(true);
    setError(false);

    try {
      const resp = await fetch(VERIFY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await resp.json();

      if (data.success) {
        onGranted();
      } else {
        setError(true);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center px-4">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className={`relative w-full max-w-sm space-y-8 text-center ${shake ? "animate-shake" : ""}`}>
        {/* Logo */}
        <div className="space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary/80 shadow-xl shadow-primary/25">
            <GraduationCap className="h-10 w-10 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">أكاديميا</h1>
            <p className="text-base text-muted-foreground">Académia</p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-lg space-y-5">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            أدخل رمز الوصول للمتابعة
            <br />
            <span className="text-xs">Entrez le code d'accès pour continuer</span>
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(false);
              }}
              placeholder="••••••••"
              className={`text-center text-lg h-12 rounded-xl ${error ? "border-destructive ring-1 ring-destructive/30" : ""}`}
              autoFocus
              disabled={loading}
            />
            {error && (
              <p className="text-sm text-destructive font-medium">رمز غير صحيح / Code incorrect</p>
            )}
            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-semibold text-sm"
              disabled={loading || !code.trim()}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin ltr:mr-2 rtl:ml-2" /> : null}
              {loading ? "جاري التحقق..." : "دخول / Entrer"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
