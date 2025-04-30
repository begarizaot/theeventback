import { useSendGridClient } from "../../../hooks";

const { validateEmail } = useSendGridClient();

export default {
  async getValidateEmail(ctx) {
    try {
      const {
        params: { email },
      } = ctx;

      const emailVal = await validateEmail(email);
      if (emailVal != "Valid") {
        return {
          status: false,
          message: "Verify your email not valid",
        };
      }

      return {
        status: true,
        message: "",
      };
    } catch (error) {
      return {
        status: false,
        data: null,
        message: "User not found",
      };
    }
  },
};
