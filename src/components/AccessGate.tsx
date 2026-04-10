import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";

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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className={`w-full max-w-sm space-y-6 text-center ${shake ? "animate-shake" : ""}`}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">أكاديميا | Académia</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            أدخل رمز الوصول للمتابعة / Entrez le code d'accès
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            placeholder="رمز الوصول / Code d'accès"
            className={`text-center text-lg ${error ? "border-destructive" : ""}`}
            autoFocus
            disabled={loading}
          />
          {error && (
            <p className="text-sm text-destructive">رمز غير صحيح / Code incorrect</p>
          )}
          <Button type="submit" className="w-full" disabled={loading || !code.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin ltr:mr-2 rtl:ml-2" /> : null}
            {loading ? "جاري التحقق..." : "دخول / Entrer"}
          </Button>
        </form>
      </div>
    </div>
  );
};
