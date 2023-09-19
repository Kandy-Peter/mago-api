import { MailDataRequired } from "@sendgrid/mail";
import sendGrid from "../config/sendgrid";
import emailMessage from "../constants/emailTemplate";

const MAGO_SENDER = process.env.MAGO_SENDER as string;

const sendEmail = async ({
  email,
  subject,
  title,
  body,
  code,
  lang,
}: {
  title: string;
  subject: string;
  body: string;
  code: string;
  lang: string;
  email: string;
}) => {
  try {
    const msg = {
      to: email,
      subject: subject || `Mago - ${title}`,
      from: MAGO_SENDER,
      html: emailMessage({
        title,
        text: body,
        code,
        lang,
      }),
    };

    return sendGrid(msg);
  } catch (error) {
    console.log(error);
  }
};

export default sendEmail;
