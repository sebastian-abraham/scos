// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log('Database connected:', process.env.DB_NAME, 'at', process.env.DB_HOST + ':' + process.env.DB_PORT);

module.exports = {
  query: (text, params, callback) => {
    console.log('EXECUTING QUERY:', text);
    return pool.query(text, params, callback);
  },
};