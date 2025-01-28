require("dotenv").config();
const express = require("express");
const ConnectDB = require("./src/config/dbConfig");
const router = require("../backend/router");
const logger = require("./src/middleware/logger");

// Express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(logger);

// Connect to the database
ConnectDB();

// App routes
app.use(router);

app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
