
import express from "express";
import languageController from "../controllers/languageController.js";

const router = express.Router();

// Endpoint: Detect single text
router.post("/detect", languageController.detectSingle);

// Endpoint: Detect batch texts 
router.post("/detect/batch", languageController.detectBatch);

// Endpoint: Get supported languages
router.get("/languages", languageController.getSupportedLanguages);

// Endpoint: Health check
router.get("/health", languageController.healthCheck);

export default router;
