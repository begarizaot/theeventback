/**
 * home controller
 */

import { factories } from "@strapi/strapi";
import { HomeFindMany } from "../services/services";

export default factories.createCoreController("api::home.home", {
  async find(ctx) {
    const data: any = await HomeFindMany();
    data.eventCarruselItem = data?.eventCarruselItem?.filter((item) => item.isVisible);
    return { data };
  },
});
