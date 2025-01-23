const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const { generatePDF } = require('./utils/generatePDF');
const { calculateAverages, calculateOverall, calculateOverallITSMModule, calculateCurrentlyImplementedITSMModules } = require('./utils/calculateAverages');
const FormData = require('./models/FormData'); // Import the FormData model

const app = express();
require('dotenv').config();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(compression());
app.use(express.static(path.join(__dirname, 'client/build')));

// MongoDB DataBase connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/your_db_name';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your_email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your_password'
  }
});

// Queue email sending to handle in a separate process if needed
async function queueEmailSending(mailOptions) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Background processing function
async function processFormData(OrganizationName, email, people, process, technology) {
  try {
    // Calculate scores in parallel
    const [peopleAverages, processAverages, technologyAverages] = await Promise.all([
      calculateAverages(people),
      calculateAverages(process),
      calculateAverages(technology)
    ]);

    const overallScores = calculateOverall(peopleAverages, processAverages, technologyAverages);
    const overallITSMModule = calculateOverallITSMModule(people, process, technology);
    const currentlyImplementedITSMModules = calculateCurrentlyImplementedITSMModules(people, process, technology);

    // Generate PDF with the calculated scores (consider saving to disk temporarily)
    const pdfBuffer = await generatePDF(OrganizationName, email, peopleAverages, processAverages, technologyAverages, overallScores, overallITSMModule, currentlyImplementedITSMModules);

    // Offload email sending to a background task
    queueEmailSending({
      from: 'jothi@cuion.in',
      to: 'mike.yee@manaopili.com',
      cc:'sranav@cuion.in',
      subject: `Digital Transformation Technology (ITSM) Workflows Report for ${OrganizationName}`,
      html: `<p>Thank you for taking the Digital Trip Survey for Technology Workflows (ITSM).</p>
  
          <p>We hope that you will find the attached report useful in determining your next Digital Transformation steps.</p>
  
          <p>Our team is available if you would like to <a href="https://calendly.com/manaopili">schedule</a> a walk-through of your report, or if you are interested in getting a detailed Digital Trip Survey report complete with specific recommendations.</p>
  
          <p>If you have any questions, please feel free to contact us.</p>
  
          <p>Mahalo,<br>
          Mana'o Pili, LLC</p>
      `,
      attachments: [{
          filename: 'report.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
      }]
  });
  } catch (error) {
    console.error('Error processing form data:', error);
  }
}

// Route: Submit form and send PDF
app.post('/api/submit-form', async (req, res) => {
  console.log('Incoming form data:', req.body);
  try {
      const { OrganizationName, email, people, process, technology } = req.body;

      if (!OrganizationName) {
          return res.status(400).json({ success: false, message: "Name is required" });
      }

      // Save form data to MongoDB
      const formData = new FormData({ OrganizationName, email, people, process, technology });
      await formData.save();

      // Send an immediate response to the client
      res.json({ success: true, message: 'Data received. Your report will be generated and emailed shortly.' });

      // Perform the rest of the processing in the background
      processFormData(OrganizationName, email, people, process, technology);

  } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Route: Health check
app.get('/', (req, res) => {
  res.send("API is working");
});

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});