import express from "express";
import languageController from "../controllers/languageController.js";
import { validateSingleText, validateBatchTexts } from "../middleware/validator.js"; // Validation middleware

const router = express.Router();

// Endpoint: Detect single text
router.post("/detect", validateSingleText, languageController.detectSingle);

// Endpoint: Detect batch texts
router.post("/detect/batch", validateBatchTexts, languageController.detectBatch);

// Endpoint: Supported languages
router.get("/supported", languageController.getSupportedLanguages);

// Endpoint: Health check
router.get("/health", languageController.healthCheck);

export default router;
