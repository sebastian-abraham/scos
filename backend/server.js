// server.js
const express = require("express");
require("dotenv").config(); // Load .env variables

const cors = require("cors");
const app = express();

// Add: Execute schema.sql on server start
const fs = require("fs");
const path = require("path");
const db = require("./config/db");

function executeSchemaSQL() {
  const schemaPath = path.join(__dirname, "queries", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");
  db.query(schema, (err) => {
    if (err) {
      console.error("Error executing schema.sql:", err);
    } else {
      console.log("schema.sql executed successfully.");
    }
  });
}

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON bodies

// Define a base route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Use your routes
// All routes in 'userRoutes' will be prefixed with /v1/users
app.use("/v1/users", require("./routes/users.js"));
app.use("/v1/auth", require("./routes/auth.js"));
app.use("/v1/shops", require("./routes/shops.js"));
app.use("/v1/items", require("./routes/items.js"));
app.use("/v1/orders", require("./routes/orders.js"));
app.use("/v1/cart", require("./routes/cart.js"));

// Execute schema.sql on server start
if (process.env.RENDER) {
  executeSchemaSQL();
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
