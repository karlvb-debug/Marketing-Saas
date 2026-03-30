-- Type definitions
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member');
CREATE TYPE campaign_type AS ENUM ('email', 'sms');
CREATE TYPE campaign_status AS ENUM ('draft', 'scheduled', 'sending', 'completed', 'failed');

-- 1. Workspaces Table
CREATE TABLE public.workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Workspace Members Table (Links auth.users to Workspaces)
CREATE TABLE public.workspace_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role DEFAULT 'member'::user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(workspace_id, user_id)
);

-- 3. Contacts Table
CREATE TABLE public.contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  email TEXT,
  phone TEXT,
  first_name TEXT,
  last_name TEXT,
  unsubscribed BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(workspace_id, email),
  UNIQUE(workspace_id, phone)
);

-- 4. Campaigns Table
CREATE TABLE public.campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type campaign_type NOT NULL,
  status campaign_status DEFAULT 'draft'::campaign_status NOT NULL,
  subject TEXT, -- Specifically for emails
  content TEXT NOT NULL, -- SMS body or Email HTML
  scheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Workspace Policies
CREATE POLICY "Users can view assigned workspaces" ON public.workspaces
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members 
      WHERE workspace_id = workspaces.id AND user_id = auth.uid()
    )
  );

-- Workspace Members Policies
CREATE POLICY "Users can view their own memberships" ON public.workspace_members
  FOR SELECT USING (user_id = auth.uid());

-- Contacts Policies
CREATE POLICY "Users can view contacts in their workspaces" ON public.contacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members 
      WHERE workspace_id = contacts.workspace_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert contacts into their workspaces" ON public.contacts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workspace_members 
      WHERE workspace_id = contacts.workspace_id AND user_id = auth.uid()
    )
  );

-- Campaigns Policies
CREATE POLICY "Users can view campaigns in their workspaces" ON public.campaigns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members 
      WHERE workspace_id = campaigns.workspace_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert campaigns into their workspaces" ON public.campaigns
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workspace_members 
      WHERE workspace_id = campaigns.workspace_id AND user_id = auth.uid()
    )
  );


-- ==========================================
-- AUTOMATIC WORKSPACE CREATION TRIGGER
-- ==========================================
-- This automatically generates a "Default Workspace" 
-- when a new user signs up in the UI!

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_workspace_id UUID;
BEGIN
  -- Insert a default workspace
  INSERT INTO public.workspaces (name)
  VALUES ('My First Workspace')
  RETURNING id INTO new_workspace_id;

  -- Assign the new user as the owner
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, NEW.id, 'owner');

  RETURN NEW;
END;
$$;

-- Bind the trigger to Supabase auth table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
