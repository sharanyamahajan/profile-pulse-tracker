import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { ShieldAlert, Trash2, FileWarning, ExternalLink, AlertTriangle, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const SecurityHub = () => {
  const { user, signOut } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleWipeData = async () => {
    if (!user) return;
    if (!confirm("This will permanently delete all your data including your profile and view history. Continue?")) return;

    setDeleting(true);

    await supabase.from("view_events").delete().or(`viewer_id.eq.${user.id},viewed_id.eq.${user.id}`);
    await supabase.from("profiles").delete().eq("user_id", user.id);

    toast({ title: "Data wiped", description: "All your data has been permanently deleted." });
    setDeleting(false);
    await signOut();
  };

  const securityTopics = [
    {
      icon: FileWarning,
      title: "Why 'Who Viewed My Profile' Apps Are Dangerous",
      content: "These apps request your Instagram credentials and use them to access your account. They violate Instagram's Terms of Service and expose you to phishing, data theft, and account bans.",
    },
    {
      icon: ShieldAlert,
      title: "Meta's Privacy Architecture",
      content: "Instagram's Graph API explicitly does not expose profile viewer data. This is by design — Meta protects user privacy by making viewer information inaccessible to all third-party applications.",
    },
    {
      icon: Lock,
      title: "How PrivacyPulse Works Differently",
      content: "PrivacyPulse only tracks views within this platform. When a user searches for and views your linked profile here, we record that event. No Instagram API access or credentials are ever used.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Security topics */}
      <div className="space-y-4">
        {securityTopics.map((topic, i) => {
          const Icon = topic.icon;
          return (
            <div key={i} className="glass rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Icon className="h-4.5 w-4.5 text-destructive" />
                </div>
                <h3 className="font-semibold text-sm">{topic.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-12">{topic.content}</p>
            </div>
          );
        })}
      </div>

      {/* GDPR Compliance */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-success" />
          <h3 className="font-semibold">GDPR Compliance</h3>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground pl-8">
          <li className="flex items-start gap-2"><span className="text-success mt-1">✓</span> Right to access your data</li>
          <li className="flex items-start gap-2"><span className="text-success mt-1">✓</span> Right to data deletion (below)</li>
          <li className="flex items-start gap-2"><span className="text-success mt-1">✓</span> No data sold to third parties</li>
          <li className="flex items-start gap-2"><span className="text-success mt-1">✓</span> Transparent data processing</li>
        </ul>
      </div>

      {/* Data deletion */}
      <div className="glass rounded-2xl p-6 space-y-4 border-destructive/20">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h3 className="font-semibold">Danger Zone</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Permanently delete your profile, linked Instagram handle, and all view history. This action cannot be undone.
        </p>
        <Button variant="destructive" className="gap-2" onClick={handleWipeData} disabled={deleting}>
          <Trash2 className="h-4 w-4" />
          {deleting ? "Wiping Data..." : "Wipe All My Data"}
        </Button>
      </div>
    </div>
  );
};

export default SecurityHub;
