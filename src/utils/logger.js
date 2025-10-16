import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// In ESM modules, we get __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the log directory and file path
const logDir = path.join(__dirname, '../logs');
const logFilePath = path.join(logDir, 'app.log');

// Create the "logs" folder if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Helper function to write a message to the log file
function writeLog(message) {
  const log = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logFilePath, log);

  // Optional: also print the log to console
  console.log(log.trim());
}

// Middleware to log every request and response
export function logger(req, res, next) {
  const start = Date.now();

  // Log the incoming request
  writeLog(`REQUEST: ${req.method} ${req.originalUrl}`);

  // Log the response when it's finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    writeLog(
      `RESPONSE: ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Time: ${duration}ms`
    );
  });

  next();
}

// Middleware to log errors
export function errorLogger(err, req, res, next) {
  writeLog(`ERROR: ${err.message} | Stack: ${err.stack}`);
  next(err);
}
