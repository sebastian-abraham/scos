// server.js
const express = require('express');
require('dotenv').config(); // Load .env variables

const app = express();
const userRoutes = require('./routes/users.js');

// Middleware
app.use(express.json()); // Parse JSON bodies

// Define a base route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use your routes
// All routes in 'userRoutes' will be prefixed with /api/users
app.use('/api/users', userRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});