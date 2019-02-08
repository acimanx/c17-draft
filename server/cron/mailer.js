const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
require('dotenv').load();

const params = {
    auth: {
        api_key: process.env.MAILER_API_KEY,
        domain: process.env.MAILER_API_DOMAIN
    },
    proxy: false // optional proxy, default is false
};

async function mailer(email) {
    if (typeof params.auth.api_key !== 'string') {
        console.log(
            `api key for mailer is empty, please check documentation and create .env file  `
        );
    } else {
        const nodemailerMailgun = nodemailer.createTransport(mg(params));
    }
    if (!email) {
        console.log(`Email wasn't provided`);
    } else {
        // setup email data with unicode symbols
        let mailOptions = {
            from: 'example@example.com', // sender address
            to: email, // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world?', // plain text body
            html: '<b>Hello world?</b>' // html body
        };

        let info = await nodemailerMailgun.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    }
}

module.exports = mailer;
