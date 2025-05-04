/**
 * event-discount-code service
 */

import { factories } from "@strapi/strapi";
import { EventDiscountCodeFindOne } from "./services";

const table = "api::event-discount-code.event-discount-code";

export default factories.createCoreService(table, () => ({
  async postEventsDiscountCode({ params, body }) {
    try {
      const service = await EventDiscountCodeFindOne(null, {
        event_id: {
          id_event: params.id,
        },
        name: {
          $eqi: body.code ?? "",
        },
      });
      let value = 0;

      if (service) {
        const stock = service.stock <= service.stock_max;
        service.state == "val" &&
          (value = body.value - (stock ? service.value : 0));
        service.state == "por" &&
          (value = Number(
            (
              body.value -
              (body.value * (stock ? service.value : 0)) / 100
            ).toFixed(2)
          ));
      }

      return {
        data: value,
        message: value <= 0 ? "Discount code is not valid" : "",
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
