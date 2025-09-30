import { ServerClient } from "postmark";
const client = new ServerClient(process.env.POSTMARK_KEY);

export const useSendGridMail = () => {
  const mailSend = async ({
    email = "",
    templateId = "",
    dynamicData,
  }) => {
    return new Promise(async (resolve, reject) => {
      // try {
      //   const msg = {
      //     to: email,
      //     from: `The Event Jet <${process.env.EMAIL_ADDRESS}>`,
      //     templateId: templateId || "",
      //     dynamic_template_data: dynamicData || {},
      //   };

      //   await sgMail.send(msg);
      //   resolve(`Correo enviado a ${msg.to}`);
      // } catch (err) {
      //   reject(err);
      // }

      try {
        const msg = {
          From: `The Event Jet <${process.env.EMAIL_ADDRESS}>`,
          To: email,
          TemplateId: 41654945,
          TemplateModel: dynamicData || {},
        };

        await client.sendEmailWithTemplate(msg);
        resolve(`Correo enviado a ${email}`);
      } catch (err) {
        reject(err);
      } 
    });
  };

  return { mailSend };
};
