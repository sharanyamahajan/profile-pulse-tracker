import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ViewEvent {
  id: string;
  viewer_id: string;
  viewed_at: string;
  viewer_handle?: string;
}

const ViewersList = () => {
  const { user } = useAuth();
  const [viewers, setViewers] = useState<ViewEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchViewers = async () => {
    if (!user) return;
    const { data: events } = await supabase
      .from("view_events")
      .select("*")
      .eq("viewed_id", user.id)
      .order("viewed_at", { ascending: false })
      .limit(50);

    if (events && events.length > 0) {
      const viewerIds = [...new Set(events.map((e) => e.viewer_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, instagram_handle")
        .in("user_id", viewerIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p.instagram_handle]) ?? []);
      setViewers(events.map((e) => ({ ...e, viewer_handle: profileMap.get(e.viewer_id) ?? "Unknown" })));
    } else {
      setViewers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchViewers();

    const channel = supabase
      .channel("view-events-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "view_events" }, () => {
        fetchViewers();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (viewers.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center space-y-3">
        <Eye className="h-10 w-10 text-muted-foreground mx-auto" />
        <h3 className="text-lg font-semibold">No views yet</h3>
        <p className="text-sm text-muted-foreground">When someone searches and views your profile, they'll appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Eye className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">{viewers.length} Recent View{viewers.length !== 1 ? "s" : ""}</h3>
      </div>
      {viewers.map((v, i) => (
        <div
          key={v.id}
          className="glass rounded-xl p-4 flex items-center gap-4 hover:border-primary/30 transition-colors"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium font-mono text-sm">@{v.viewer_handle}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(v.viewed_at), { addSuffix: true })}</span>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
        </div>
      ))}
    </div>
  );
};

export default ViewersList;
