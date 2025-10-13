
import languageDetectionService from "../services/languageDetectionService.js";

class LanguageController {
  // Detect single text
  async detectSingle(req, res, next) {
    try {
      const { text } = req.body;

      // Validation: text required
      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          error: "Text is required",
          message: "Please provide text to detect language",
        });
      }

      // Call service to detect language
      const result = languageDetectionService.detect(text);

      res.status(200).json({
        language: result.language,
        confidence: result.confidence,
        detectedText: text,
      });
    } catch (error) {
      next(error); // Forward error to middleware
    }
  }

  // Batch detection
  async detectBatch(req, res, next) {
    try {
      const { texts } = req.body;

      // Validation: ensure array exists and not empty
      if (!Array.isArray(texts) || texts.length === 0) {
        return res.status(400).json({
          error: "Invalid input",
          message: "Please provide an array of texts to detect languages",
        });
      }

      // Validate each text and run detection
      const results = texts.map((t) => {
        if (!t || t.trim().length === 0) {
          return {
            text: t,
            error: "Empty text provided",
          };
        }

        const detection = languageDetectionService.detect(t);
        return {
          text: t,
          language: detection.language,
          confidence: detection.confidence,
        };
      });

      res.status(200).json({ results });
    } catch (error) {
      next(error);
    }
  }

  // supported languages not implemented yet
  async getSupportedLanguages(req, res, next) {
    res.status(501).json({ message: "Supported languages not implemented yet" });
  }

  // Health check endpoint
  async healthCheck(req, res) {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
  }
}

export default new LanguageController();
