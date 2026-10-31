/*
# Add image/video attachments to the custom design chat

1. Purpose
- Lets customers attach reference photos or short videos directly inside
  the "Design With Us" chat widget when describing a custom piece.

2. Changes
- `custom_design_chats`
  - `attachment_url` (text, nullable) — comma-separated public URLs for
    any files attached to this message.
  - `attachment_type` (text, nullable) — comma-separated 'image' | 'video'
    tags, aligned by position with `attachment_url`.
- Storage
  - Creates a public bucket `design-attachments` for the uploaded files.
  - Anyone (anon + authenticated) may upload and read, matching the
    no-auth, single-tenant model already used by `custom_design_chats`.

3. Notes
- Kept as comma-separated text rather than a new join table to match the
  existing lightweight schema for this widget; a message rarely carries
  more than a handful of attachments (capped client-side at 4).
*/

ALTER TABLE custom_design_chats
  ADD COLUMN IF NOT EXISTS attachment_url text,
  ADD COLUMN IF NOT EXISTS attachment_type text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('design-attachments', 'design-attachments', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "design_attachments_public_read" ON storage.objects;
CREATE POLICY "design_attachments_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'design-attachments');

DROP POLICY IF EXISTS "design_attachments_public_upload" ON storage.objects;
CREATE POLICY "design_attachments_public_upload"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'design-attachments');
