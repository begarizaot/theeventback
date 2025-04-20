/**
 * event service
 */

import { factories } from "@strapi/strapi";
import { EventFindPage, filterGeneral } from "./services";

const table = "api::event.event";

export default factories.createCoreService(table, () => ({
  async getEventsHome() {
    try {
      const service = await EventFindPage(filterGeneral, {
        pageSize: 3,
        page: 1,
      });
      return { data: service.results, status: true };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
}));
