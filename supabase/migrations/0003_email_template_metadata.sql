-- Add schema columns for email templates
ALTER TABLE public.email_templates
  ADD COLUMN IF NOT EXISTS sender_name TEXT,
  ADD COLUMN IF NOT EXISTS reply_to TEXT,
  ADD COLUMN IF NOT EXISTS structural_json JSONB DEFAULT '[]'::jsonb;

-- Also let's update campaigns in case they want to use the builder there later too
ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS sender_name TEXT,
  ADD COLUMN IF NOT EXISTS reply_to TEXT,
  ADD COLUMN IF NOT EXISTS structural_json JSONB DEFAULT '[]'::jsonb;
