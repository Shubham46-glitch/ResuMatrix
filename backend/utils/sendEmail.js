const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter
  // We use Ethereal for dev if EMAIL_HOST is not provided
  let transporter;
  
  if (process.env.EMAIL_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Generate a test ethereal account
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
    console.log('Using Ethereal Email for testing');
  }

  // 2. Define the email options
  const message = {
    from: `${process.env.FROM_NAME || 'ResuMatrix'} <${process.env.FROM_EMAIL || 'noreply@resumatrix.com'}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // 3. Send the email
  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
  
  if (!process.env.EMAIL_HOST) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};

module.exports = sendEmail;
