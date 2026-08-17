/*
# Core e-commerce schema for Lumière

1. Purpose
- Move products off static frontend data into a real table.
- Store orders placed at checkout, with line items.
- Store contact form submissions.
- Persist wishlist and cart per signed-in customer (replacing localStorage).
- Back "Create Account" / "Sign In" with real Supabase Auth users + profile data.

2. New Tables
- `profiles`        one row per auth.users, extra customer info (name, phone)
- `products`        catalog, public read
- `orders`          one row per placed order (guest or signed-in)
- `order_items`     line items belonging to an order
- `contact_messages` submissions from the Contact page
- `wishlists`        (user_id, product_id) pairs
- `cart_items`       (user_id, product_id, size) with quantity

3. Security
- `products`: public (anon + authenticated) can SELECT. No public write — only
  the service role (used by an admin tool, not the storefront) can INSERT/UPDATE/DELETE.
- `profiles`, `wishlists`, `cart_items`: a user can only read/write their own rows
  (auth.uid() = user_id). No anon access — these require sign-in.
- `orders`, `order_items`: a signed-in user can read/insert their own orders.
  Guest checkout (no account) is supported for INSERT only via the anon role,
  but guests cannot read orders back (no session to scope to) — the confirmation
  is shown client-side right after insert.
- `contact_messages`: anon + authenticated can INSERT (submit the form) but
  cannot SELECT — only the service role (staff) reads submissions.

4. Notes
- `profiles` is kept in sync with `auth.users` via a trigger that creates a row
  on signup.
- Prices are stored in the same unit currently used in the frontend (whole
  dollars, no cents column) to match `src/data/products.ts` exactly.
*/

-- =========================================================
-- profiles
-- =========================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- auto-create a profile row whenever a new auth user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =========================================================
-- products
-- =========================================================
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('Rings','Necklaces','Earrings','Bracelets','Watches')),
  price numeric(10,2) NOT NULL,
  old_price numeric(10,2),
  rating numeric(2,1) DEFAULT 0,
  review_count integer DEFAULT 0,
  images text[] DEFAULT '{}',
  material text NOT NULL,
  gemstone text NOT NULL,
  collection text NOT NULL,
  is_new boolean DEFAULT false,
  is_best_seller boolean DEFAULT false,
  in_stock boolean DEFAULT true,
  sizes text[],
  description text,
  details text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_public_select" ON products;
CREATE POLICY "products_public_select"
  ON products FOR SELECT
  TO anon, authenticated USING (true);

-- =========================================================
-- orders
-- =========================================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  zip text NOT NULL,
  country text NOT NULL,
  delivery_option text NOT NULL CHECK (delivery_option IN ('standard','express','overnight')),
  subtotal numeric(10,2) NOT NULL,
  tax numeric(10,2) NOT NULL,
  delivery_price numeric(10,2) NOT NULL,
  total numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'placed' CHECK (status IN ('placed','processing','shipped','delivered','cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_insert_any" ON orders;
CREATE POLICY "orders_insert_any"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- signed-in users must tag the order as theirs; guests must leave user_id null
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND user_id IS NULL)
  );

DROP POLICY IF EXISTS "orders_select_own" ON orders;
CREATE POLICY "orders_select_own"
  ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- =========================================================
-- order_items
-- =========================================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id text REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  size text,
  price_at_purchase numeric(10,2) NOT NULL
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "order_items_insert_with_order" ON order_items;
CREATE POLICY "order_items_insert_with_order"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_id
      AND ((auth.uid() IS NOT NULL AND o.user_id = auth.uid())
           OR (auth.uid() IS NULL AND o.user_id IS NULL))
    )
  );

DROP POLICY IF EXISTS "order_items_select_own" ON order_items;
CREATE POLICY "order_items_select_own"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );

-- =========================================================
-- contact_messages
-- =========================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contact_messages_insert_any" ON contact_messages;
CREATE POLICY "contact_messages_insert_any"
  ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- =========================================================
-- wishlists
-- =========================================================
CREATE TABLE IF NOT EXISTS wishlists (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wishlists_all_own" ON wishlists;
CREATE POLICY "wishlists_all_own"
  ON wishlists FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =========================================================
-- cart_items
-- =========================================================
CREATE TABLE IF NOT EXISTS cart_items (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, product_id, size)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cart_items_all_own" ON cart_items;
CREATE POLICY "cart_items_all_own"
  ON cart_items FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =========================================================
-- indexes
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_collection ON products (collection);
