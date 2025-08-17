const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv'); 
const summarizeRoutes = require('./routes/main'); 

dotenv.config();

const app = express();
const port = 3001;
const apiKey = process.env.API_KEY; 

app.use(express.json());
app.use(cors());



const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

app.use('/api', summarizeRoutes(transporter, apiKey));

// Start the server
app.listen(port, () => {
  console.log(`Express backend listening at http://localhost:${port}`);
});

