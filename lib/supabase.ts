import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://huushmodtpqjnburjhfu.supabase.co";
const supabaseKey = "sb_publishable_B2EJlQHq4Ip5ZTOb6oxgPw__vKo5C-0";

export const supabase = createClient(supabaseUrl, supabaseKey);