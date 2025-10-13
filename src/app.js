
// Import required packages
import express from "express";           // Framework for building web servers
import dotenv from "dotenv";             // To load environment variables from .env file
import languageRoutes from "./routes/languageRoutes.js"; // Language detection routes
import { errorHandler } from "./middleware/errorHandler.js"; // Custom error handler middleware

// Initialize environment variables
dotenv.config();

// Create an Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Base route for all language detection endpoints
app.use("/api/language", languageRoutes);

// Global error handler (to handle all errors in one place)
app.use(errorHandler);

// Get port from environment or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
