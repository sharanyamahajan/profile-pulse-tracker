import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import { Shield, Eye, Search, Activity, ShieldAlert, LogOut, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileSetup from "@/components/ProfileSetup";
import ViewersList from "@/components/ViewersList";
import SearchTool from "@/components/SearchTool";
import DiagnosticsTab from "@/components/DiagnosticsTab";
import SecurityHub from "@/components/SecurityHub";

type Tab = "viewers" | "search" | "diagnostics" | "security";

const tabs: { id: Tab; label: string; icon: typeof Eye }[] = [
  { id: "viewers", label: "Viewers", icon: Eye },
  { id: "search", label: "Search", icon: Search },
  { id: "diagnostics", label: "Diagnostics", icon: Activity },
  { id: "security", label: "Security Hub", icon: ShieldAlert },
];

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("viewers");
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [handle, setHandle] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("instagram_handle")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setHasProfile(!!data);
        setHandle(data?.instagram_handle ?? null);
      });
  }, [user]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background"><Shield className="h-8 w-8 animate-pulse text-primary" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (hasProfile === null) return <div className="flex min-h-screen items-center justify-center bg-background"><Shield className="h-8 w-8 animate-pulse text-primary" /></div>;
  if (!hasProfile) return <ProfileSetup onComplete={() => { setHasProfile(true); window.location.reload(); }} />;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center glow-primary">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">PrivacyPulse</h1>
              <p className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                <Instagram className="h-3 w-3" /> @{handle}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut} className="gap-2 text-muted-foreground">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Tab nav */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  active
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === "viewers" && <ViewersList />}
        {activeTab === "search" && <SearchTool />}
        {activeTab === "diagnostics" && <DiagnosticsTab />}
        {activeTab === "security" && <SecurityHub />}
      </main>
    </div>
  );
};

export default Dashboard;
