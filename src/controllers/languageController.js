import languageDetectionService from "../services/languageDetectionService.js";

class LanguageController {
  /**
   * Detect language for a single text.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async detectSingle(req, res, next) {
    try {
      const { text } = req.body;

      // Call the service to detect language
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

  /**
   * Detect languages for multiple texts in batch.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async detectBatch(req, res, next) {
    try {
      const { texts } = req.body;

      // Map each text to its detection result
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

  /**
   * Return list of supported languages.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getSupportedLanguages(req, res, next) {
    try {
      const languages = languageDetectionService.getSupportedLanguages();
      res.status(200).json({ languages });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Health check endpoint.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
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
