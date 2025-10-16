import * as franc from "franc";
import langs from "langs";

class LanguageDetectionService {
  /**
   * Detects the language of a given text
   * @param {string} text - The text to analyze
   * @returns {{ language: string, confidence: number }}
   */
  detect(text) {
    if (!text || text.trim().length === 0) {
      throw new Error("Text is required");
    }

    if (text.trim().length < 3) {
      return { language: "unknown", confidence: 0 };
    }

    const cleaned = this.preprocessText(text);
    if (cleaned.length < 2) {
      return { language: "unknown", confidence: 0 };
    }

    // Try quick detection based on script or common keywords
    const quick = this.quickDetectByScriptAndKeywords(cleaned);
    if (quick) {
      const confidence = this.calculateConfidenceForHeuristic(cleaned);
      return { language: quick.lang, confidence };
    }

    // Detect language using franc
    const langCode3 = franc.franc(cleaned);
    let language = "unknown";

    if (langCode3 && langCode3 !== "und") {
      const langInfo = langs.where("3", langCode3);
      language = langInfo ? langInfo["1"] || langCode3 : langCode3;
    }

    // Apply fallback detection if franc result is uncertain
    if (language === "unknown" || language === "ur") {
      const smart = this.smartDetect(cleaned);
      if (smart !== "unknown") {
        const confidence = this.calculateConfidenceForHeuristic(cleaned);
        return { language: smart, confidence };
      }
    }

    // Default return with computed confidence
    return {
      language,
      confidence: this.calculateConfidence(cleaned, langCode3),
    };
  }

  /**
   * Detects languages quickly based on script and common keywords.
   * Returns { lang } or null.
   */
  quickDetectByScriptAndKeywords(text) {
    // Arabic letters
    if (/[\u0600-\u06FF]/.test(text)) return { lang: "ar" };

    // French special characters
    if (/[éèêëàâäîïôöùûüç]/i.test(text)) return { lang: "fr" };

    // Common English words
    const englishKeywords = [
      "the", "and", "is", "are", "i", "you", "love", "how", "what",
      "do", "does", "doesn't", "don't", "learn", "learning",
      "programming", "hello", "hi", "thanks"
    ];

    const tokens = text.split(/\s+/).map(t => t.replace(/[^a-zA-Z']/g, ''));
    for (const token of tokens) {
      if (englishKeywords.includes(token.toLowerCase())) {
        return { lang: "en" };
      }
    }

    return null;
  }

  /**
   * Boosts confidence for heuristic-based results.
   */
  calculateConfidenceForHeuristic(text) {
    const base = Math.min(0.98, Math.max(0.45, text.length / 100));
    const boost = 0.12;
    return parseFloat(Math.min(0.99, base + boost).toFixed(2));
  }

  /**
   * Cleans text by removing emojis, numbers, and extra punctuation.
   */
  preprocessText(text) {
    return text
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
      .replace(/[0-9!@#$%^&*(),.?":{}|<>_\-=\+\[\]\\;’‘“”—]/g, "")
      .replace(/\s+/g, " ")
      .toLowerCase()
      .trim();
  }

  /**
   * Returns supported languages list.
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
   * Calculates confidence based on text length and character diversity.
   */
  calculateConfidence(text, langCode) {
    if (!text || text.length < 5) return 0.3;
    if (langCode === "unknown") return 0.2;

    const lengthFactor = Math.min(text.length / 50, 1);
    const uniqueChars = new Set(text).size / text.length;
    const base = (lengthFactor + uniqueChars) / 2;

    return Number((0.5 + base / 2).toFixed(2));
  }

  /**
   * Placeholder for smart detection (script-based fallback)
   */
  smartDetect(text) {
    if (/[\u0600-\u06FF]/.test(text)) return "ar";
    if (/[éèêëàâäîïôöùûüç]/i.test(text)) return "fr";
    if (/^[a-zA-Z\s]+$/.test(text)) return "en";
    return "unknown";
  }
}

export default new LanguageDetectionService();
