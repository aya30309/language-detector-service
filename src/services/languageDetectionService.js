
import franc from "franc"; 

class LanguageDetectionService {
  /**
   * Detect language of given text
   * @param {string} text - Text to analyze
   * @returns {Object} - { language, confidence }
   */
  detect(text) {
    // Validation: empty or too short text
    if (!text || text.trim().length === 0) {
      throw new Error("Text is required");
    }
    if (text.trim().length < 3) {
      return { language: "unknown", confidence: 0 };
    }

    // Detect language code using franc
    const langCode = franc(text);

    return {
      language: langCode !== "und" ? langCode : "unknown", 
      confidence: this.calculateConfidence(text, langCode),
    };
  }

  /**
   * Detect languages for multiple texts
   * @param {Array<string>} texts - Array of texts
   * @returns {Array} - Array of detection results
   */
  detectBatch(texts) {
    if (!Array.isArray(texts)) throw new Error("texts must be an array");

    return texts.map((t) => {
      try {
        return { text: t, ...this.detect(t) };
      } catch (err) {
        return { text: t, language: "unknown", confidence: 0 };
      }
    });
  }

  /**
   * Get list of supported languages (subset example)
   */
  getSupportedLanguages() {
    return [
      { code: "en", name: "English" },
      { code: "ar", name: "Arabic" },
      { code: "fr", name: "French" },
      { code: "es", name: "Spanish" },
      { code: "de", name: "German" },
    ];
  }

  /**
   * Calculate confidence score 
   */
  calculateConfidence(text, langCode) {
    // Simple heuristic: longer text → higher confidence
    if (langCode === "und") return 0;
    const len = text.trim().length;
    const confidence = Math.min(0.99, Math.max(0.5, len / 100));
    return parseFloat(confidence.toFixed(2));
  }
}

export default new LanguageDetectionService();
