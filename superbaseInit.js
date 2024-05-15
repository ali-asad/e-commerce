require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const supabaseUrl =
  process.env.SUPABASE_URL || "https://gbghcelbvrkwsdouzopz.supabase.co";
const supabaseKey =
  process.env.SUPABASE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZ2hjZWxidnJrd3Nkb3V6b3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU3NjYxNTIsImV4cCI6MjAzMTM0MjE1Mn0.voqIA40hVT7BMHAjxRqh4J0__dnX3qKbf0uEOWPZvsE";

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
