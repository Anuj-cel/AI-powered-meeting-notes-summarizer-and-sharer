const express = require('express');

const createSummarizeRouter = (transporter, apiKey) => {
  const router = express.Router();
  
  
  router.post('/summarize', async (req, res) => {
    const { transcript, prompt } = req.body;

    if (!transcript || !prompt) {
      return res.status(400).json({ error: 'Transcript and prompt are required.' });
    }

    const fullPrompt = `${prompt}\n\nTranscript:\n${transcript}`;

    // API call payload
    const payload = {
      contents: [{
        parts: [{ text: fullPrompt }]
      }],
    };
    
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=" + apiKey;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary could be generated.';

      res.json({ summary: generatedText });

    } catch (error) {
      console.error('Error generating summary:', error);
      res.status(500).json({ error: 'Failed to generate summary.' });
    }
  });


  router.post('/share', async (req, res) => {
    const { summary, emails } = req.body;

    if (!summary || !emails) {
      return res.status(400).json({ error: 'Summary and recipient emails are required.' });
    }
    
    const formattedSummary = summary.replace(/\n/g, '<br>');

    const recipients = emails.split(',').map(email => email.trim());

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: recipients,
      subject: 'AI-Generated Meeting Summary',
      html: `
        <h2>Meeting Summary from your AI Assistant</h2>
        <p>Hello,</p>
        <p>Here is the meeting summary you requested:</p>
        <div style="background-color: #f4f4f4; padding: 16px; border-radius: 8px;">
          ${formattedSummary}
        </div>
        <p>Regards,<br>Your AI Assistant</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email successfully sent to: ${recipients.join(', ')}`);
      res.status(200).json({ message: `Summary successfully shared via email to: ${recipients.join(', ')}` });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Failed to send email. Please check your Nodemailer configuration.' });
    }
  });
  
  return router;
};

module.exports = createSummarizeRouter;
