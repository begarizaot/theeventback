/**
 * home controller
 */

import { factories } from "@strapi/strapi";
import { HomeFindMany } from "../services/services";
import { useMoment } from "../../../hooks";

export default factories.createCoreController("api::home.home", {
  async find(ctx) {
    const data: any = await HomeFindMany();
    data.eventCarruselItem = data?.eventCarruselItem?.filter(
      (item) =>
        item.isVisible &&
        useMoment(item?.event_id?.start_date).isAfter(useMoment())
    );
    return { data };
  },
});
