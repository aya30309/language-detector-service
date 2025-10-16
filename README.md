```markdown
#  Language Detector Service

A simple backend service built with **Node.js** and **Express** that detects the language of a given text.  
The project also includes a custom **Logger Middleware** for tracking requests, responses, and errors.

---

## 📁 Project Structure

```
src/
├── controllers/          # Contains route handlers that call the service and send responses
├── middleware/           # Custom middlewares (error handler, validator, etc.)
├── routes/               # Defines API endpoints and maps them to controllers
├── utils/logger.js       # Logging utility for requests, responses, and errors
├── logs/                 # Folder where log files are saved (auto-created)
├── services/             # Business logic for language detection (LanguageDetectionService)
└── app.js                # Main entry point: sets up Express server and middleware
````

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/aya30309/language-detector-service.git
   cd language-detector-service
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` file**

   ```bash
   PORT=3000
   NODE_ENV=development
   ```

4. **Run the server**

   ```bash
   npm run dev
   ```

   The server will start on:

   ```
   http://localhost:3000
   ```

---

## 🧩 API Endpoints

| Method | Endpoint        | Description           |
| ------ | --------------- | --------------------- |
| GET    | `/api/health`   | Health check endpoint |
| POST   | `/api/language` | Detect text language  |

Example request:

```json
{
  "text": "Bonjour tout le monde"
}
```

Example response:

```json
{
    "language": "fr",
    "confidence": 0.75,
    "detectedText": "Bonjour tout le monde"
}
```

---

## 🧾 Logger Middleware

The app includes a custom logger to record all requests, responses, and errors.

* Logs are saved in: `src/logs/app.log`
* The log file is automatically created if it doesn’t exist.

Example log:

```
[2025-10-16T21:20:01.321Z] REQUEST: GET /api/health
[2025-10-16T21:20:01.328Z] RESPONSE: GET /api/health | Status: 200 | Time: 7ms
```

---

## 🧪 Testing

You can test the endpoints using **Postman**.

A ready-to-use Postman collection is available in:

```
test-requests.postman_collection.json
```

Steps:

1. Open Postman → Import → Upload this JSON file.
2. Try sending requests to `/api/health` and `/api/language`.

---

## 🧠 Technologies Used

* **Node.js**
* **Express.js**
* **dotenv**
* **nodemon**
* **Custom Logger (fs module)**

---

## 👩‍💻 Author

**Aya Samir**
Backend Developer (.NET & Node.js)
📧 [ayasamir1810@gmail.com]
💼 [(https://www.linkedin.com/in/ayasamirselim/?locale=en_US)]

---
