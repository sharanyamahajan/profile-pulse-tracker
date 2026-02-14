import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Instagram, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ProfileSetupProps {
  onComplete: () => void;
}

const ProfileSetup = ({ onComplete }: ProfileSetupProps) => {
  const { user } = useAuth();
  const [handle, setHandle] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const cleanHandle = handle.replace(/^@/, "").trim();
    const { error } = await supabase.from("profiles").insert({
      user_id: user.id,
      instagram_handle: cleanHandle,
      display_name: cleanHandle,
    });

    setSaving(false);
    if (error) {
      if (error.code === "23505") {
        toast({ title: "Handle taken", description: "This Instagram handle is already linked.", variant: "destructive" });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in-up">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 glow-accent">
            <Instagram className="h-7 w-7 text-accent" />
          </div>
          <h2 className="text-2xl font-bold">Link Your Instagram</h2>
          <p className="text-sm text-muted-foreground">Enter your handle to initialize your PrivacyPulse profile</p>
        </div>

        <form onSubmit={handleSave} className="glass rounded-2xl p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Instagram Handle</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
              <Input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="yourhandle"
                className="pl-8 bg-muted border-border"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full gap-2" disabled={saving || !handle.trim()}>
            <Check className="h-4 w-4" />
            {saving ? "Linking..." : "Link Account"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            No Instagram password required. We only store your public handle.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
