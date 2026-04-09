import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GraduationCap, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SECRET_CODE = "islamsaker2026";
const STORAGE_KEY = "academia_access_granted";

export const useAccessGate = () => {
  const [granted, setGranted] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY) === "true";
  });

  const grant = async () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setGranted(true);
    // Increment counter
    try {
      const { data } = await supabase
        .from("access_counter")
        .select("count")
        .eq("id", 1)
        .single();
      if (data) {
        await supabase
          .from("access_counter")
          .update({ count: data.count + 1 })
          .eq("id", 1);
      }
    } catch (e) {
      console.error("Counter update failed", e);
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() === SECRET_CODE) {
      onGranted();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
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
          />
          {error && (
            <p className="text-sm text-destructive">رمز غير صحيح / Code incorrect</p>
          )}
          <Button type="submit" className="w-full">
            دخول / Entrer
          </Button>
        </form>
      </div>
    </div>
  );
};
