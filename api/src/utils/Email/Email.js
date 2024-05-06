var nodemailer = require('nodemailer');
const fs = require('fs');

const data = {
  name: 'John Doe',
  url: 'google.com',
};

fs.readFile('EmailCard.html', 'utf8', (err, html) => {
  if (err) {
    console.error(err);
    return;
  }

  html = html.replace('${name}', data.name);
  html = html.replace('${url}', data.url);
  // console.log('sending name----', html);

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'adhavpavan@gmail.com',
      pass: 'wtoc xfeq sedb jrmi',
    },
  });

  var mailOptions = {
    from: 'adhavpavan@gmail.com',
    to: 'poojakanjalkar554@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!',
    html: html,
  };

  const sendEmail = () => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  };
  sendEmail();
});
