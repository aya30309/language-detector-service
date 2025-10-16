// Middleware to validate request body for single text detection
export function validateSingleText(req, res, next) {
  const { text } = req.body;
  if (!text || text.trim().length === 0) {
    return res.status(400).json({
      error: "Text is required",
      message: "Please provide text to detect language",
    });
  }
  next();
}

// Middleware to validate request body for batch detection
export function validateBatchTexts(req, res, next) {
  const { texts } = req.body;
  if (!Array.isArray(texts) || texts.length === 0) {
    return res.status(400).json({
      error: "Invalid input",
      message: "Please provide an array of texts to detect languages",
    });
  }
  next();
}
