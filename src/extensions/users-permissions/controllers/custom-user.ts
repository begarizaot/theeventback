import { CountryFindOne } from "../../../api/country/services/services";
import { useSendGridClient, useTwilio } from "../../../hooks";
import { UserCreate, UserFindOne, UserUpdate } from "../services/services";
import jwt from "jsonwebtoken";

const { validateEmail } = useSendGridClient();
const { sendSMS, verifySMS } = useTwilio();

const onResData = (data) => {
  return {
    ...data,
    token: strapi.plugins["users-permissions"].services.jwt.issue(
      {
        id: data.id,
      }
      // { expiresIn: "3h" }
    ),
  };
};

export default {
  async getUserData(ctx) {
    try {
      const {
        request: {
          header: { authorization },
        },
      } = ctx;

      if (!authorization) {
        return {
          status: false,
          data: null,
          message: "Authorization header is missing",
        };
      }

      const token = authorization.split(" ")[1];
      if (!token) {
        return {
          status: false,
          data: null,
          message: "Token is missing",
        };
      }
      const decoded:any = jwt.verify(
        token,
        process.env.JWT_SECRET,
        { ignoreExpiration: true }
      );
      if (!decoded) {
        return {
          status: false,
          data: null,
          message: "Invalid token",
        };
      }
      const userData: any = await UserFindOne({
        id: decoded?.id,
      });

      return {
        status: true,
        message: "",
        data: userData,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        data: null,
        message: "User not found or invalid token",
      };
    }
  },
  async getValidateEmail(ctx) {
    try {
      const {
        params: { email },
      } = ctx;

      const emailVal = await validateEmail(email);
      console.log(emailVal);
      if (emailVal != "Valid") {
        return {
          status: false,
          message: "Please enter a valid email address to continue.",
        };
      }

      const userData: any = await UserFindOne({ email: { $eqi: email || "" } });

      return {
        status: true,
        message: "",
        data: userData,
      };
    } catch (error) {
      return {
        status: false,
        data: null,
        message: "Error validating email",
      };
    }
  },
  async postLogin(ctx) {
    try {
      const {
        request: { body },
      } = ctx;

      const { email, type, phone, country } = body;

      const validateType = String(type).toLocaleLowerCase() == "email";

      const userData: any = await UserFindOne(
        validateType
          ? { email: { $eqi: email || "" } }
          : { phoneNumber: { $eqi: String(phone) || "" } }
      );

      if (!userData) {
        return {
          status: false,
          data: null,
          message: "User not found",
        };
      }

      // const emailRes = await sendSMS({
      //   to: validateType ? email : `${country}${phone}`,
      //   channel: validateType ? "email" : "sms",
      // });

      // if (!emailRes.status) {
      //   return emailRes;
      // }

      // if (!userData?.country_id) {
      //   const countryRes = await CountryFindOne({
      //     code: { $eqi: country },
      //   });
      //   UserUpdate(userData?.id, {
      //     country_id: countryRes.id,
      //   });
      // }

      return {
        status: true,
        data: onResData(userData),
      };
    } catch (error) {
      return {
        status: false,
        data: null,
        message: "User not found or invalid type",
      };
    }
  },
  async postValidateOTP(ctx) {
    try {
      const {
        request: { body },
      } = ctx;

      const { email, type, phone, country, otp } = body;

      const validateType = String(type).toLocaleLowerCase() == "email";

      const userData = await UserFindOne(
        validateType
          ? { email: { $eqi: email || "" } }
          : { phoneNumber: { $eqi: String(phone) || "" } }
      );

      if (!userData) {
        return {
          status: false,
          data: null,
          message: "User not found",
        };
      }

      const validPassword: any = await verifySMS({
        to: validateType ? email : `${country}${phone}`,
        code: otp,
      });

      if (!validPassword || !validPassword?.valid) {
        return {
          status: false,
          data: null,
          message: "Code not valid",
        };
      }

      return {
        status: true,
        data: onResData(userData),
      };
    } catch (error) {
      return {
        status: false,
        data: null,
        message: "Error validating OTP",
      };
    }
  },
  async postRegister(ctx) {
    try {
      const {
        request: { body },
      } = ctx;

      const { email, phone, country } = body;

      const userData = await UserFindOne({
        $or: [
          { email: { $eqi: email || "" } },
          { phoneNumber: { $eqi: String(phone) || "" } },
        ],
      });

      if (userData) {
        return {
          status: false,
          data: null,
          message: "User already exists",
        };
      }

      const countryReq = await CountryFindOne({
        code: { $eqi: country },
      });

      await UserCreate({
        ...body,
        phoneNumber: String(phone),
        country_id: countryReq.id,
      });

      const emailRes = await sendSMS({
        to: `${country}${phone}`,
        channel: "sms",
      });

      if (!emailRes.status) {
        return emailRes;
      }

      return {
        status: true,
        data: { ...body, type: "Phone" },
      };
    } catch (error) {
      console.log(error.message);
      return {
        status: false,
        data: null,
        message: "Error registering user or invalid data",
      };
    }
  },
};
