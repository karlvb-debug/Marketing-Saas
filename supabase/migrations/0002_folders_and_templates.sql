-- Type for Folder feature mapping
CREATE TYPE folder_feature_type AS ENUM ('email_campaigns', 'email_templates', 'contacts', 'sms');

-- 1. Folders Table
CREATE TABLE public.folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  feature_type folder_feature_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Modify Existing Campaigns and Contacts Tables
ALTER TABLE public.campaigns ADD COLUMN folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL;
ALTER TABLE public.contacts ADD COLUMN folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL;

-- 3. Email Templates Table
CREATE TABLE public.email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  content TEXT, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Contact Segments Table
CREATE TABLE public.contact_segments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  rules JSONB, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Note: We now have contact_segments and contacts.
-- For the Contacts feature, "audience segments" would be placed into folders. 
-- For now, the 'folder_id' added to contacts could be used to group individual contacts, 
-- or we can primarily group segments into folders and assign contacts to segments. 
-- The user requested: "Contacts... require a list view organized by folder ... Add items (Contact Segments)...".

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_segments ENABLE ROW LEVEL SECURITY;

-- Workspace Policies
CREATE POLICY "Users can view folders in their workspaces" ON public.folders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = folders.workspace_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can insert folders" ON public.folders
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = folders.workspace_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can update folders" ON public.folders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = folders.workspace_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can delete folders" ON public.folders
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = folders.workspace_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can view email templates" ON public.email_templates
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = email_templates.workspace_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can insert email templates" ON public.email_templates
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = email_templates.workspace_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can update email templates" ON public.email_templates
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = email_templates.workspace_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can delete email templates" ON public.email_templates
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = email_templates.workspace_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can view contact segments" ON public.contact_segments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = contact_segments.workspace_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can insert contact segments" ON public.contact_segments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = contact_segments.workspace_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can update contact segments" ON public.contact_segments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = contact_segments.workspace_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can delete contact segments" ON public.contact_segments
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = contact_segments.workspace_id AND user_id = auth.uid())
  );

-- Update existing table policies for UPDATE (needed for drag and drop changing folder_id)
CREATE POLICY "Users can update campaigns in their workspaces" ON public.campaigns
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = campaigns.workspace_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update contacts in their workspaces" ON public.contacts
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = contacts.workspace_id AND user_id = auth.uid())
  );
