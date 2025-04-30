import client from "@sendgrid/client";
client.setApiKey(process.env.SENDGRIDVALIDATE_KEY);

export const useSendGridClient = () => {
  const validateEmail = async (email) => {
    return new Promise((resolve, reject) => {
      client
        .request({
          url: `/v3/validations/email`,
          method: "POST",
          body: { email },
        })
        .then(([response]: any) => {
          resolve(response?.body?.result?.verdict || "");
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return { validateEmail };
};
