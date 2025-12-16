/* import { createClient } from "@supabase/supabase-js" */
/* import 'dotenv/config'; */
const { createClient } = require('@supabase/supabase-js');
require('dotenv/config');

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY


if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or KEY are not defined in environment variables");
}

const supabaseConnection = createClient(supabaseUrl, supabaseKey);

module.exports = { supabaseConnection };
