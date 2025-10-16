import * as franc from "franc";
import langs from "langs";

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
    const langCode = franc.franc(text);

    // Convert 3-letter code to 2-letter if possible
    let language = "unknown";
    if (langCode !== "und") {
      const langInfo = langs.where("3", langCode);
      if (langInfo) {
        language = langInfo["1"] || langCode;
      }
    }

    return {
      language,
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

    // Map each text to its detection result
    const results = texts.map((t) => {
      try {
        const { language, confidence } = this.detect(t);
        return { text: t, language, confidence };
      } catch (err) {
        // On error, return unknown
        return { text: t, language: "unknown", confidence: 0 };
      }
    });

    return results;
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

  /*
   * Calculate confidence score 
  //  */
  // calculateConfidence(text, langCode) {
  //   // Simple heuristic: longer text → higher confidence
  //   if (langCode === "und") return 0;
  //   const len = text.trim().length;
  //   const confidence = Math.min(0.99, Math.max(0.5, len / 100));
  //   return parseFloat(confidence.toFixed(2));
  // }


  calculateConfidence(text, langCode) {
      if (!text || text.length < 5) return 0.3;
      if (langCode === "unknown") return 0.2;

      const lengthFactor = Math.min(text.length / 50, 1);
      const uniqueChars = new Set(text).size / text.length;
      const base = (lengthFactor + uniqueChars) / 2;
      return Number((0.5 + base / 2).toFixed(2));
  }

}

export default new LanguageDetectionService();
