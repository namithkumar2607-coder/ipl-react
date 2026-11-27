import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nvfvrhpmuosogotxfuki.supabase.co";
const supabaseKey = "sb_publishable_VcSmOUnnJRLqpdbgUS8gqQ_77D2hwHT";

export const supabase = createClient(supabaseUrl, supabaseKey);