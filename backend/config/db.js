// db.js
const { Pool } = require('pg');
require('dotenv').config(); // This loads your local .env file

// Create an empty config object to be populated
let dbConfig = {};

if (process.env.DATABASE_URL) {
  // --- Production (Render) ---
  // Render provides the connection string
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for Render's free tier
    }
  };
  console.log('Connecting to Render database...');

} else {
  // --- Local Development ---
  // Use the variables from your .env file
  dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  };
  console.log('Connecting to local database:', process.env.DB_NAME, 'at', process.env.DB_HOST + ':' + process.env.DB_PORT);
}

// Create the pool using the correct configuration
const pool = new Pool(dbConfig);

// Keep your existing export
module.exports = {
  query: (text, params, callback) => {
    console.log('EXECUTING QUERY:', text);
    return pool.query(text, params, callback);
  },
};