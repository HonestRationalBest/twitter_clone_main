import mailer from "../core/mailer";

interface sendEmailProps {
  emailFrom: string;
  emailTo: string;
  subject: string;
  html: string;
  callback?: (err: Error | null, info: any) => void;
}

export const sendEmail = ({
  emailFrom,
  emailTo,
  subject,
  html,
  callback,
}: sendEmailProps): void => {
  mailer.sendMail(
    {
      from: emailFrom,
      to: emailTo,
      subject: subject,
      html: html,
    },
    callback ||
      function (err: Error | null, info: any) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      }
  );
};
