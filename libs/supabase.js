import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.SUPABASE_PROJECT_URL;
const supabaseKEY = process.env.SUPABASE_PROJECT_ANON_KEY;

export const supabase = createClient(supabaseURL, supabaseKEY);
