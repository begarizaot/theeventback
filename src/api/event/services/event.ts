/**
 * event service
 */

import { factories } from "@strapi/strapi";
import {
  EventFindMany,
  EventFindOne,
  EventFindPage,
  filterGeneral,
} from "./services";
import {
  TeamAccessFindMany,
  TeamAccessFindOne,
} from "../../team-access/services/services";
import { OrderAnalityEvent } from "../../order/services/services";

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
  async getMyEvents({ user }) {
    try {
      if (!user) {
        return {
          status: false,
          message: "User not found",
        };
      }
      const service = await EventFindMany(
        {
          users_id: {
            id: user.id,
          },
        },
        {
          start_date: "asc",
        }
      );
      return {
        data: service,
        status: true,
      };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
  async getSharedEvents({ user }) {
    try {
      if (!user) {
        return {
          status: false,
          message: "User not found",
        };
      }
      const service = await TeamAccessFindMany({
        user_id: {
          id: user.id,
        },
      });
      return {
        data: service,
        status: true,
      };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
  async getAdminEventDetail({ user, params }) {
    try {
      if (!user) {
        return {
          status: false,
          message: "User not found",
        };
      }

      const event: any = await EventFindOne(null, { id_event: params.id });
      if (!event) {
        return {
          status: false,
          message: "Event not found",
        };
      }

      if (event.users_id.id == user.id) {
        return {
          data: event,
          status: true,
        };
      }

      const service: any = await TeamAccessFindOne({
        user_id: {
          id: user.id,
        },
      });
      return {
        data: service.event_id,
        status: true,
      };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
  async getAdminEventAnality({ user, params }) {
    try {
      if (!user) {
        return {
          status: false,
          message: "User not found",
        };
      }

      const event: any = await EventFindOne(null, { id_event: params.id });
      if (!event) {
        return {
          status: false,
          message: "Event not found",
        };
      }

      const res = await OrderAnalityEvent(event.id, event.url_map);

      return {
        data: res,
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
