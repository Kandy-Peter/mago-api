import mail, { MailDataRequired } from '@sendgrid/mail';
import 'dotenv/config';

const { SENDGRID_API_KEY, NODE_ENV } = process.env;

const isTest = NODE_ENV === 'test';

mail.setApiKey(SENDGRID_API_KEY as string);

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
    text: msg.text || '<strong>Mago Support team</strong>',
  } as MailDataRequired;

  if (msg.attachments) {
    defaultMsg.attachments = msg.attachments;
  }

  if (isTest) {
    return Promise.resolve();
  }

  return mail.send(defaultMsg);
};

export default sendMail;
