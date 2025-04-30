/**
 * order service
 */

import { factories } from "@strapi/strapi";
import { useSendGridClient } from "../../../hooks";

const { validateEmail } = useSendGridClient();

const table = "api::order.order";
export default factories.createCoreService(table, () => ({
  async postCreatePayment({ body }) {
    try {
      const { userData } = body;

      const emailVal = await validateEmail(userData.email);
      if (emailVal != "Valid") {
        return {
          status: false,
          data: null,
          message: "Verify your email not valid",
        };
      }

      return {
        data: body,
        status: true,
      };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
}));
