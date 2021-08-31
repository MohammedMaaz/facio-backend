const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const getEmailTransportObj = () => {
  switch (config.email.service) {
    case 'gmail':
      return {
        service: config.email.service,
        auth: {
          type: 'OAuth2',
          user: config.email.from,
          clientId: config.email.gmail.oauth.clientId,
          clientSecret: config.email.gmail.oauth.clientSecret,
          refreshToken: config.email.gmail.oauth.refreshToken,
        },
      };
    default:
      return config.email.smtp;
  }
};

// fallback to smtp
const transport = nodemailer.createTransport(getEmailTransportObj());
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch((e) => {
      logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env');
      logger.warn(e);
    });
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {object} user
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (user, token) => {
  const subject = 'Reset Password';
  const resetPasswordUrl = `${config.app.url}/on-password-reset?token=${token}`;
  const text = `Dear ${user.name},

To reset your password, click on this link:
${resetPasswordUrl}

If you did not request any password resets, then please ignore this email.`;
  await sendEmail(user.email, subject, text);
};

/**
 * Send verification email
 * @param {object} user
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (user, token) => {
  const subject = 'Email Verification';
  const verificationEmailUrl = `${config.app.url}/on-email-verification?token=${token}`;
  const text = `Dear ${user.name},

To verify your email, click on this link:
${verificationEmailUrl}

If you did not create an account, then please ignore this email.`;
  await sendEmail(user.email, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
