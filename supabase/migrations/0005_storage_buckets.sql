-- Supabase Storage migration to provision the 'assets' bucket

INSERT INTO storage.buckets (id, name, public) 
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the 'assets' bucket
CREATE POLICY "Public Asset Read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'assets');

-- We only allow authenticated users to insert files.
-- For production, this policy should ideally also enforce that users can only upload to their workspace folder.
CREATE POLICY "Authenticated Asset Upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'assets' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated Asset Update"
  ON storage.objects FOR UPDATE
  WITH CHECK (
    bucket_id = 'assets' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated Asset Delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'assets' AND auth.role() = 'authenticated'
  );
