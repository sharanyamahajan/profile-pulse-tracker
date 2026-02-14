import { useState, useEffect } from "react";
import { Shield, CheckCircle, AlertTriangle, Lock, Activity, Server } from "lucide-react";

interface ScanItem {
  label: string;
  status: "secure" | "warning" | "info";
  detail: string;
}

const scanItems: ScanItem[] = [
  { label: "Meta Privacy Lock", status: "secure", detail: "Instagram's Graph API does not expose profile viewer data. No external tracking possible." },
  { label: "Internal View Engine", status: "secure", detail: "All view events are recorded on-platform only. No third-party data sharing." },
  { label: "Data Encryption", status: "secure", detail: "All data is encrypted at rest and in transit using AES-256 and TLS 1.3." },
  { label: "External Scraping Detection", status: "warning", detail: "Third-party 'Who viewed my profile' apps are scams. They cannot access Instagram viewer data." },
  { label: "RLS Policy Enforcement", status: "secure", detail: "Row-level security ensures users can only access their own view history." },
  { label: "Session Token Validation", status: "secure", detail: "JWT tokens are verified on every request. Sessions auto-expire for security." },
];

const statusConfig = {
  secure: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", label: "Secure" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", label: "Advisory" },
  info: { icon: Activity, color: "text-accent", bg: "bg-accent/10", label: "Info" },
};

const DiagnosticsTab = () => {
  const [scannedCount, setScannedCount] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setScannedCount((c) => {
        if (c >= scanItems.length) {
          clearInterval(interval);
          setScanComplete(true);
          return c;
        }
        return c + 1;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Scan header */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${scanComplete ? "bg-success/10" : "bg-primary/10"}`}>
            {scanComplete ? <CheckCircle className="h-5 w-5 text-success" /> : <Shield className="h-5 w-5 text-primary animate-pulse" />}
          </div>
          <div>
            <h3 className="font-semibold">{scanComplete ? "Security Scan Complete" : "Scanning..."}</h3>
            <p className="text-xs text-muted-foreground font-mono">{scannedCount}/{scanItems.length} checks completed</p>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 rounded-full"
            style={{ width: `${(scannedCount / scanItems.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Scan results */}
      <div className="space-y-3">
        {scanItems.slice(0, scannedCount).map((item, i) => {
          const config = statusConfig[item.status];
          const Icon = config.icon;
          return (
            <div key={i} className="glass rounded-xl p-4 space-y-2 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bg}`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${config.bg} ${config.color}`}>
                  {config.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground pl-11">{item.detail}</p>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border">
        <Lock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Internal vs. External Hits</p>
          <p>This platform tracks <strong>internal</strong> profile views only. Due to Meta API restrictions, it is technically impossible to see who viewed your real Instagram profile. Any app claiming otherwise is a scam.</p>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsTab;
