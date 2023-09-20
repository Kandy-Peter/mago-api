import sgMail, { MailDataRequired } from '@sendgrid/mail';
import 'dotenv/config';
import logger from './logger';

const { SENDGRID_API_KEY, NODE_ENV } = process.env;

const isTest = NODE_ENV === 'test';

sgMail.setApiKey(SENDGRID_API_KEY as string);

/**
 * @author Kandy
 * @param {Object} msg
 */

const sendMail = async (msg: MailDataRequired) => {
  const defaultMsg = {
    to: msg.to || 'test@mago.com',
    from: msg.from || 'Mago Support <noreply@mago.io>',
    bcc: msg.bcc || undefined,
    cc: msg.cc || undefined,
    subject: msg.subject || 'Mago',
    html: msg.html || '<p>Test</p>',
  } as MailDataRequired;

  if (msg.attachments) {
    defaultMsg.attachments = msg.attachments;
  }

  if (isTest) {
    return Promise.resolve();
  }

  return sgMail.send(defaultMsg).then(() => {
    logger.info('Email sent');
  }).catch((error) => {
    logger.error(error);
  });
};

export default sendMail;
