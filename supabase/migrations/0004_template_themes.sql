-- Add theme config to templates
ALTER TABLE public.email_templates
  ADD COLUMN IF NOT EXISTS theme_json JSONB DEFAULT '{"backgroundColor": "#f3f4f6", "contentWidth": 600, "primaryColor": "#4F46E5", "logoUrl": "", "footerText": ""}'::jsonb;

-- Link campaigns to specific templates
ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL;
