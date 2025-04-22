/**
 * event service
 */

import { factories } from "@strapi/strapi";
import { EventFindOne, EventFindPage, filterGeneral } from "./services";

const table = "api::event.event";

export default factories.createCoreService(table, () => ({
  async getEventsHome() {
    try {
      const service = await EventFindPage(
        filterGeneral,
        {
          pageSize: 3,
          page: 1,
        },
        {
          start_date: "asc",
        }
      );
      return { data: service.results, status: true };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
  async getEventDetail({ params }) {
    try {
      const service = await EventFindOne(null, { id_event: params.id });
      return { data: service, status: true };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
  async getEventMeta({ params }) {
    try {
      const service = await EventFindOne({}, { id_event: params.id }, [
        "id_event",
        "name",
        "url_image",
      ]);
      return {
        data: {
          id: service.id_event ?? "",
          title: service.name ?? "",
          urlImage: service.url_image ?? "",
        },
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
