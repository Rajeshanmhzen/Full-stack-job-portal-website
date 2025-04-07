import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host:"sandbox.smtp.mailtrap.io",
    port:2525,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "7053ab9853b47e",
      pass: "4a748d24125554"
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function emailSender(mailOptions) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: mailOptions.from, // sender address
    to: mailOptions.to, // list of receivers
    subject:mailOptions.subject, // Subject line
    text: mailOptions.text, // plain text body
    html: mailOptions.html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

export default transporter