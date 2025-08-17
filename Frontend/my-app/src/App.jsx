import React, { useState } from 'react';
import "./App.css"; // Assuming you have a CSS file for styles
import { marked } from 'marked'; // For rendering markdown in the summary
/**
 * Main application component for thFe AI-powered meeting notes summarizer.
 * This component now acts as the frontend, making API calls to a separate
 * Express.js backend to perform summarization and email sharing.
 */
const App = () => {
  const [transcript, setTranscript] = useState('');
  const [prompt, setPrompt] = useState('Summarize the following text in bullet points, highlighting key decisions and action items.');
  const [summary, setSummary] = useState('');
  const [emails, setEmails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const backendUrl = "http://localhost:3001"; // URL for the Express backend

  /**
   * Clears the message after a set duration.
   */
  const clearMessage = () => {
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  /**
   * Handles the request to generate a summary by calling the backend API.
   * It sends the user's transcript and prompt to the Express server.
   */
  const handleGenerateSummary = async () => {
    if (!transcript) {
      setMessage('Please enter a transcript to summarize.');
      clearMessage();
      return;
    }

    setIsLoading(true);
    setMessage('Generating summary...');
    setSummary('');

    try {
      const response = await fetch(`${backendUrl}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, prompt })
      });

      if (!response.ok) {
        throw new Error(`Backend API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      const generatedText = result?.summary || 'No summary could be generated.';
      setSummary(generatedText);
      setMessage('Summary generated successfully!');
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('');
      setMessage('Failed to generate summary. Please check the console and ensure your backend is running.');
    } finally {
      setIsLoading(false);
      clearMessage();
    }
  };

  /**
   * Handles the sharing of the summary by calling the backend API.
   * It sends the summary and recipient emails to the Express server.
   */
  const handleShareSummary = async () => {
    if (!emails || !summary) {
      setMessage('Please provide a summary and at least one email address to share.');
      clearMessage();
      return;
    }
    
    setMessage('Sharing summary...');

    try {
      const response = await fetch(`${backendUrl}/api/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary, emails })
      });
      
      if (!response.ok) {
        throw new Error(`Backend API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      console.error('Error sharing summary:', error);
      setMessage('Failed to share summary. Please check the console and ensure your backend is running.');
    } finally {
      clearMessage();
    }
  };

  return (
    <>
      {/* Add a link to the Inter font from Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      <div className="flex flex-col md:flex-row h-screen font-inter bg-slate-50 text-gray-800 p-4 sm:p-8 md:p-12 lg:p-16">
        {/* Input Section */}
        <div className="flex-1 p-6 space-y-6 bg-white rounded-t-3xl md:rounded-t-none md:rounded-l-3xl shadow-2xl border-r border-gray-200 md:w-1/2">
          <h1 className="text-4xl font-bold text-slate-800">AI Meeting Notes</h1>
          <p className="text-slate-500">Enter a transcript and a custom prompt to generate a structured summary.</p>
          
          {/* Transcript Input */}
          <div className="space-y-2">
            <label htmlFor="transcript" className="font-semibold text-slate-700">Meeting Transcript</label>
            <textarea
              id="transcript"
              className="w-full h-48 p-3 text-sm border-2 border-slate-200 bg-slate-50 rounded-lg focus:outline-none focus:ring-4 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 resize-none"
              placeholder="Paste your meeting notes or call transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <label htmlFor="prompt" className="font-semibold text-slate-700">Custom Prompt</label>
            <textarea
              id="prompt"
              className="w-full h-24 p-3 text-sm border-2 border-slate-200 bg-slate-50 rounded-lg focus:outline-none focus:ring-4 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 resize-none"
              placeholder="e.g., 'Summarize in bullet points for executives' or 'Highlight only action items'."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateSummary}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-sky-600 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </div>
            ) : (
              'Generate Summary'
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="flex-1 p-6 space-y-6 bg-white rounded-b-3xl md:rounded-b-none md:rounded-r-3xl shadow-2xl md:w-1/2 mt-4 md:mt-0">
          {/* Summary Output */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-700">Generated Summary</label>
            <div 
              className="w-full h-64 p-3 text-sm border-2 border-slate-200 bg-slate-50 rounded-lg overflow-y-auto focus:outline-none focus:ring-4 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 resize-none"
              dangerouslySetInnerHTML={{ __html: marked.parse(summary) }}
            ></div>
          </div>

          {/* Share Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="emails" className="font-semibold text-slate-700">Recipient Email Addresses (comma-separated)</label>
              <input
                type="text"
                id="emails"
                className="w-full p-3 text-sm border-2 border-slate-200 bg-slate-50 rounded-lg focus:outline-none focus:ring-4 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
                placeholder="e.g., john.doe@example.com, jane.smith@example.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
              />
            </div>
            <button
              onClick={handleShareSummary}
              className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:from-green-700 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              disabled={!summary || !emails}
            >
              Share Summary via Email
            </button>
          </div>
          
          {/* Message Box */}
          {message && (
            <div className={`p-4 rounded-xl shadow-md text-center font-medium ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </>
  );
};


export default App;
