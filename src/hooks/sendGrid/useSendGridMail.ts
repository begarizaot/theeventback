const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

export const useSendGridMail = () => {
  const mailSend = async ({ email = "", subject = "", html = "" }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const msg = {
          to: email || "",
          from: `The Event Jet <${process.env.EMAIL_ADDRESS}>`,
          subject: subject || "",
          html: html || "",
        };
        await sgMail.send(msg);
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  };

  return { mailSend };
};
