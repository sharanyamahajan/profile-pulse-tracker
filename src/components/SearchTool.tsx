import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Search, User, Eye, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProfileResult {
  user_id: string;
  instagram_handle: string;
  display_name: string | null;
}

const SearchTool = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProfileResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setSearched(true);

    const cleanQuery = query.replace(/^@/, "").trim().toLowerCase();
    const { data } = await supabase
      .from("profiles")
      .select("user_id, instagram_handle, display_name");

    const filtered = (data ?? []).filter(
      (p) =>
        p.instagram_handle?.toLowerCase().includes(cleanQuery) &&
        p.user_id !== user?.id
    );

    setResults(filtered);
    setSearching(false);
  };

  const handleView = async (profile: ProfileResult) => {
    if (!user) return;

    await supabase.from("view_events").insert({
      viewer_id: user.id,
      viewed_id: profile.user_id,
    });

    toast({
      title: "View recorded",
      description: `@${profile.instagram_handle} will see you visited their profile.`,
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Instagram handle..."
            className="pl-10 bg-muted border-border"
          />
        </div>
        <Button type="submit" disabled={searching || !query.trim()}>
          {searching ? "Searching..." : "Search"}
        </Button>
      </form>

      {searched && results.length === 0 && !searching && (
        <div className="glass rounded-2xl p-10 text-center space-y-2">
          <Search className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">No users found for "{query}"</p>
        </div>
      )}

      <div className="space-y-3">
        {results.map((p) => (
          <div key={p.user_id} className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <User className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-medium font-mono text-sm">@{p.instagram_handle}</p>
              {p.display_name && <p className="text-xs text-muted-foreground">{p.display_name}</p>}
            </div>
            <Button size="sm" variant="outline" className="gap-2" onClick={() => handleView(p)}>
              <Eye className="h-3.5 w-3.5" />
              View Profile
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <ExternalLink className="h-3 w-3" />
        <span>Viewing a profile will notify the user. This tracks internal views only.</span>
      </div>
    </div>
  );
};

export default SearchTool;
