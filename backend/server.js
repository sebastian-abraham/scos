// server.js
const express = require('express');
require('dotenv').config(); // Load .env variables


const cors = require('cors');
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON bodies

// Define a base route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use your routes
// All routes in 'userRoutes' will be prefixed with /v1/users
app.use('/v1/users', require('./routes/users.js'));
app.use('/v1/auth', require('./routes/auth.js'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});