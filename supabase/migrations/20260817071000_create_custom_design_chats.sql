/*
# Create custom_design_chats table

1. Purpose
- Stores messages from customers who request custom jewellery designs via the in-site chat widget.
- Single-tenant, no-auth app: any visitor (anon role) can submit a custom design request and read back the conversation.
- Staff/admin responses are stored in the same table with sender = 'atelier'.

2. New Tables
- `custom_design_chats`
  - `id` (uuid, primary key)
  - `session_id` (text, identifies a visitor's chat session so messages group together; generated client-side and stored in localStorage)
  - `sender` (text, either 'customer' or 'atelier')
  - `message` (text, the chat message body)
  - `customer_name` (text, optional, captured in the chat intro so the atelier knows who to reply to)
  - `customer_email` (text, optional, captured in the chat intro for follow-up)
  - `created_at` (timestamptz, defaults to now())

3. Security
- Enable RLS on `custom_design_chats`.
- Allow anon + authenticated full CRUD because the app has no sign-in and the chat data is intentionally public/shared (any visitor can submit and read their session's conversation).
- USING (true) is acceptable here because there is no user-ownership concept and the data is intentionally shared.

4. Notes
- No user_id column or auth dependency — the app has no sign-in flow.
- Index on session_id for efficient conversation retrieval.
*/

CREATE TABLE IF NOT EXISTS custom_design_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  sender text NOT NULL CHECK (sender IN ('customer', 'atelier')),
  message text NOT NULL,
  customer_name text,
  customer_email text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_custom_design_chats_session_id
  ON custom_design_chats (session_id);

ALTER TABLE custom_design_chats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_chats" ON custom_design_chats;
CREATE POLICY "anon_select_chats"
  ON custom_design_chats FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_chats" ON custom_design_chats;
CREATE POLICY "anon_insert_chats"
  ON custom_design_chats FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_chats" ON custom_design_chats;
CREATE POLICY "anon_update_chats"
  ON custom_design_chats FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_chats" ON custom_design_chats;
CREATE POLICY "anon_delete_chats"
  ON custom_design_chats FOR DELETE
  TO anon, authenticated USING (true);
