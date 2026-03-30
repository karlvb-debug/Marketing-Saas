const { Client } = require('pg');
const fs = require('fs');

const connectionString = 'postgresql://postgres:Grafbae1978!@db.hjlritjsccktdxlalooo.supabase.co:5432/postgres';
const sql = fs.readFileSync('supabase/migrations/0001_initial_schema.sql', 'utf8');

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to Supabase Postgres...");
    await client.query(sql);
    console.log("Migration executed successfully! The tables and triggers are now live.");
  } catch (err) {
    console.error("Error executing migration:", err);
  } finally {
    await client.end();
  }
}

run();
