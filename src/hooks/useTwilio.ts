import twilio from "twilio";
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const useTwilio = () => {
  const sendSMS = async ({ to, channel }) => {
    try {
      const response = await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SID)
        .verifications.create({
          to,
          channel,
        });
      return response;
    } catch (error) {
      return {
        status: false,
        message: "Error sending SMS verification, please try again",
      };
    }
  };

  const verifySMS = async ({ to, code }) => {
    try {
      const response = await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SID)
        .verificationChecks.create({ to, code });
      return response;
    } catch (error) {
      console.log(error);
      return {
        status: false,
        data: null,
        message: "Error verifying SMS",
      };
    }
  };

  return { sendSMS, verifySMS };
};
