'use strict';

const 
    dotenv = require('dotenv'),

    path = require('path'),

    express = require('express'),

    cors = require('cors'),

    bodyParser = require('body-parser'),

    nodemailer = require('nodemailer'),

    rateLimit = require('express-rate-limit'),

    router = express.Router(),

    { mongo } = require('../../utils/mongo')
;

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '.env') });

router.use(cors({
  origin: ['http://localhost:4200', 'https://your-production-domain.com'],
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));

router.use(bodyParser.json());

// server server url
router.get('/config.json', (req, res) => {
  res.json({ apiBase: process.env.API_BASE_URL || 'http://localhost:3000' });
});

// Create Nodemailer transporter
const 
    transporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 465,
        service:'yahoo',
        secure: false,
        auth: {
        user: process.env.YAHOO_USER,
        pass: process.env.YAHOO_PASSWORD
        },
        connectionTimeout: 10000,
        tls: { rejectUnauthorized: true },
        debug: false,
        logger: false
    }),

    // Rate limiting (15 minutes, 5 requests)
    limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 5,
        message: 'Too many requests, please try again later'
    })
;

router.use('/send-mail', limiter);

router.use('/get-username', limiter);

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

// EMAIL: forgotten username
router.post('/get-username', async (req, res, next) => {
  const { email } =  req.body;

  if ( !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) )
    return res.status(400).json({ message: 'Invalid or missing email' });

  try {
    // 2. Lookup user
    let user = null;
    await mongo(async db => {
      user = await db
        .collection('users')
        .findOne({ email }, { projection: { username: 1 } });
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 3. Send email with the found username
    const 
      mailOptions = {
        from: process.env.YAHOO_USER,
        to: email,
        subject: 'Your Athena Username',
        text: `Hello! Your Athena username is: ${user.username}`,
        html: `<p>Hello!</p><p>Your Athena username is: <strong>${user.username}</strong></p>`
      },
      info = await transporter.sendMail(mailOptions);

    // 4. Return success
    return res.status(200).json({
      user: user.username,
      message: 'Username email sent successfully',
      messageId: info.messageId
    });

  } catch (err) {
    console.error('Server Error:', err);
    return res.status(500).json({
      error: 'Could not send email',
      details: err.message
    });
  }
});

// EMAIL: forgotten password
router.post('/get-password', async (req, res) => {
  const { email } =  req.body;

  if ( !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) )
    return res.status(400).json({ message: 'Invalid or missing email' });

  try {
    // 2. Lookup user
    let user = null;
    await mongo(async db => {
      user = await db
        .collection('users')
        .findOne({ email }, { projection: { username: 1 } });
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 3. Send email with the found username
    const 
      mailOptions = {
        from: process.env.YAHOO_USER,
        to: email,
        subject: 'Your Athena Username',
        text: `Hello! Your Athena username is: ${user.username}`,
        html: `<p>Hello!</p><p>Your Athena username is: <strong>${user.username}</strong></p>`
      },
      info = await transporter.sendMail(mailOptions);

    // 4. Return success
    return res.status(200).json({
      user: user.username,
      message: 'Username email sent successfully',
      messageId: info.messageId
    });

  } catch (err) {
    console.error('Server Error:', err);
    return res.status(500).json({
      error: 'Could not send email',
      details: err.message
    });
  }
});

// EMAIL: Registration conformation
router.post('/registration-confirmation', async (req, res) => {
});

// Email endpoint
router.post('/send-mail', async (req, res) => {
  const { email, phone } = req.body;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ message: 'Invalid email format' });

  if (phone && !/^(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/.test(phone)) 
    return res.status(400).json({ message: 'Invalid phone format' });
  
  try {
    console.log('Request body:', req.body);

    // Validate required fields first
    const
    requiredFields = ['fName', 'lName', 'email', 'subject', 'message'],
    missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const

    // mail body
    htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #1a73e8;">New Contact Form Submission</h2>
        <div style="margin: 15px 0; padding: 10px; background: #f8f9fa;">
            <p style="margin: 5px 0;">
              <strong>Name:</strong>
              ${req.body.fName || 'Not provided'} ${req.body.lName || ''}
            </p>
            <p style="margin: 5px 0;">
              <strong>Email:</strong>
              <a href="mailto:${req.body.email}">${req.body.email}</a>
            </p>
            ${req.body.phone ? `
              <p style="margin: 5px 0;">
                <strong>Phone:</strong>
                <a href="tel:${req.body.phone}">${req.body.phone}</a>
              </p>` : ''
            }
            <p style="margin: 5px 0;">
              <strong>Employer:</strong>
              ${req.body.employer ? 'Yes' : 'No'}
            </p>
          </div>

          <div style="margin-top: 20px;">
            <h3 style="color: #1a73e8;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.5;">
              ${req.body.message.replace(/\n/g, '<br>')}
            </p>
          </div>
      </div>
    `,
    // Create mail options
    mailOptions = {
      from: process.env.YAHOO_USER,
      to: process.env.TO_EMAIL,
      replyTo: req.body.email,
      subject: `[Contact] ${req.body.subject.substring(0, 50) || 'No subject provided'}`,
      html: htmlBody,                                 // HTML body
      text: htmlBody.replace(/<[^>]+>/g, '\n').trim() // optional plaintext fallback
    };

    if (!req.body.email || !req.body.message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send email
    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Email sent successfully',
      id: info.messageId
    });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({
      error: 'Email failed to send',
      details: error.response || error.message
    });
  }
});

module.exports = router;