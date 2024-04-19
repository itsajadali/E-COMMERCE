// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require("nodemailer");

// sandbox1235aeb6f370457e9694eddb7dbae0df.mailgun.org
// e1d073a24e07340e45edd5df27fc8d4b-19806d14-2608b572

const sendEmail = async (options) => {
  // create transporter

  //   const transporter = nodemailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: process.env.SMTP_PORT,
  //     secure: true,
  //     auth: {
  //       user: process.env.SMTP_EMAIL,
  //       pass: process.env.SMTP_PASSWORD,
  //     },
  //   });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIl,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.SMTP_EMAIl,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
