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
const ErrorFormData = require('./models/ErrorFormData');

const app = express();
require('dotenv').config();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(compression());
app.use(express.static(path.join(__dirname, 'client/build')));

//MongoDB DataBase connection
const mongoURI = process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/your_db_name';
console.log('Connecting to MongoDB:', mongoURI);
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'manaopili.info@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD
  }
});
// const transporter = nodemailer.createTransport({
//   host: 'smtp.office365.com',
//   port: 587,
//   secure: false, // Use TLS
//   auth: {
//     user: 'rittirag@manaopili.com',
//     pass: 'Hockeymana@18fsasd'
//   },
//   tls: {
//     ciphers: 'SSLv3'
//   }
// });

// Queue email sending to handle in a separate process if needed
async function queueEmailSending(mailOptions, OrganizationName, email, people, process, technology) {
  console.log('Queueing email:', mailOptions);
  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      const error_message = error.message || 'Unknown error';
      // Save error message to database
      const errorFormData = new ErrorFormData({ email, OrganizationName, people, process, technology, error_message });
      await errorFormData.save()

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
    queueEmailSending(
      {
        from: 'manaopili.info@gmail.com',
        to: `rittirag@manaopili.com,leilani@manaopili.com,mike.yee@manaopili.com,${email}`,
        cc: 'raghu@manaopili.com',
        subject: `Digital Transformation Technology (ITSM) Workflows Report for ${OrganizationName}`,
        html: `<p>Thank you for taking the Digital Trip Survey for Technology Workflows (ITSM).</p>
  
          <p>We hope that you will find the attached report useful in determining your next Digital Transformation steps.</p>
  
          <p>Our team is available if you would like to <a href="https://outlook.office.com/bookwithme/user/2d20486392d94cf9b823bc508a230121@manaopili.com/meetingtype/DxI_vD9gjkeIW8tY5UxRYQ2?anonymous&ep=mLinkFromTile">schedule</a> a walk-through of your report, or if you are interested in getting a detailed Digital Trip Survey report complete with specific recommendations.</p>
  
          <p>If you have any questions, please feel free to contact us.</p>
  
          <p>Mahalo,<br>
          Mana'o Pili, LLC</p>
      `,
        attachments: [{
          filename: 'report.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        }]
      }, OrganizationName, email, people, process, technology);
  } catch (error) {
    console.log('Error:', error);
    const error_message = error.message || 'Unknown error';
    // Save error message to database
    const errorFormData = new ErrorFormData({ email, OrganizationName, people, process, technology, error_message });
    await errorFormData.save()
  }
}

// Route: Submit form and send PDF
app.post('/api/submit-form', async (req, res) => {
  console.log('Incoming form data:', req.body);
  try {
    const { OrganizationName, email, people, process, technology } = req.body;

    if (!OrganizationName) {
      console.error('Error: Missing OrganizationName');
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    console.log('Saving form data to database');
    const formData = new FormData({ OrganizationName, email, people, process, technology });
    await formData.save();

    res.json({ success: true, message: 'Data received. Your report will be generated and emailed shortly.' });

    console.log('Processing form data in the background');
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