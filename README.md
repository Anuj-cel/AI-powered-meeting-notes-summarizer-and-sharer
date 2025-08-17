Meeting Summarizer Backend ✨

This is the backend for an AI-powered meeting summarizer. It's built with Node.js and Express and is a robust solution for turning raw meeting transcripts into professional, shareable summaries.
Core Technologies 💻

The application's functionality is powered by a set of modern and efficient technologies:

Node.js: The JavaScript runtime environment that executes all the backend code.

Express: A fast, minimalist web framework used to create the server and define the REST API endpoints.

Gemini API: A powerful large language model that intelligently processes transcripts and generates concise, structured summaries.

Nodemailer: The email-sending module that connects to an SMTP service (like Gmail) to deliver summaries directly to recipients' inboxes.

marked: A Markdown parser that ensures the AI-generated summaries are converted into clean, rich HTML for beautifully formatted emails.

dotenv: A utility that handles the secure loading of sensitive credentials, such as API keys and email passwords, from a dedicated .env file.

API Endpoints & Workflow 🔄

The backend operates with a straightforward two-step process, exposed through two primary API endpoints:

/api/summarize (POST)

This endpoint receives a raw meeting transcript and a prompt from the frontend.

It constructs a comprehensive prompt and makes a fetch call to the Gemini API.

The AI processes the request and returns a summary, which is then sent back to the frontend.

/api/share (POST)

This endpoint receives the Markdown-formatted summary and a list of recipient email addresses.

It uses the marked library to convert the summary from Markdown into clean HTML, ensuring the email has proper formatting (bold text, bullet points, etc.).

It then uses Nodemailer to send the HTML-formatted email to all specified recipients.

Design  🏗️

The architecture of this backend is designed for clarity and maintainability. By modularizing the API routes into a separate file (routes/summarizeRoutes.js), the main index.js file remains lightweight and easy to manage. This separation of concerns simplifies development, making it easy to add new features without cluttering the core application logic. The use of environment variables is a critical security measure, ensuring sensitive data is never hard-coded and remains protected.
