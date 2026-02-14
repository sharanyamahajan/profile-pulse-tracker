
-- Profiles table with Instagram handle
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  instagram_handle TEXT UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = user_id);

-- View events table
CREATE TABLE public.view_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_id UUID NOT NULL,
  viewed_id UUID NOT NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.view_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see views on their profile" ON public.view_events
  FOR SELECT USING (auth.uid() = viewed_id OR auth.uid() = viewer_id);

CREATE POLICY "Authenticated users can insert views" ON public.view_events
  FOR INSERT WITH CHECK (auth.uid() = viewer_id);

CREATE POLICY "Users can delete their own view history" ON public.view_events
  FOR DELETE USING (auth.uid() = viewer_id OR auth.uid() = viewed_id);

-- Enable realtime for view_events
ALTER PUBLICATION supabase_realtime ADD TABLE public.view_events;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
