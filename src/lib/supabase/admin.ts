import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service role client — bypasses RLS entirely. Only ever import this from
 * Route Handlers / Server Components, never from client code.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);
