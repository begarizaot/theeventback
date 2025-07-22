/**
 * home controller
 */

import { factories } from "@strapi/strapi";
import { HomeFindMany } from "../services/services";
import { useMoment } from "../../../hooks";
import { EventFindPage, filterGeneral } from "../../event/services/services";

export default factories.createCoreController("api::home.home", {
  async find(ctx) {
    const data: any = await HomeFindMany();
    const service = await EventFindPage(
      filterGeneral,
      {
        pageSize: 1,
        page: 1,
      },
      {
        start_date: "asc",
      }
    );
    data.eventCarruselItem = data?.eventCarruselItem?.filter(
      (item) =>
        item.isVisible &&
        useMoment(item?.event_id?.start_date).isAfter(useMoment())
    );

    if (data.automaticCarruselItem) {
      data.eventCarruselItem[0] = {
        title: data.title,
        description: data.description,
        ...data.eventCarruselItem[0],
        event_id: service.results[0],
      };
    }

    return { data };
  },
});
