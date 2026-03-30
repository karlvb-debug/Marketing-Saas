const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://hjlritjsccktdxlalooo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqbHJpdGpzY2NrdGR4bGFsb29vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MjY4NDMsImV4cCI6MjA5MDMwMjg0M30.O1vP-UBhm6EhKfWL7BOGf2fM00gZtpRUBbTSt1SnG14'
);

async function run() {
  console.log("Attempting Signup...");
  const { data, error } = await supabase.auth.signUp({
    email: 'hello_world_test2@example.com',
    password: 'securepassword123!',
  });
  console.log("Data:", data);
  console.log("Error:", error);
}

run();
