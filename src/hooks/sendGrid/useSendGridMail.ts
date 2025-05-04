const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

export const useSendGridMail = () => {
  const mailSend = async ({
    email = "",
    templateId = "",
    dynamicData,
  }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const msg = {
          to: email,
          from: `The Event Jet <${process.env.EMAIL_ADDRESS}>`,
          templateId: templateId || "",
          dynamic_template_data: dynamicData || {},
        };

        await sgMail.send(msg);
        resolve(`Correo enviado a ${msg.to}`);
      } catch (err) {
        reject(err);
      }
    });
  };

  return { mailSend };
};
