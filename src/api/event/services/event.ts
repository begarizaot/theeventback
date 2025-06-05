/**
 * event service
 */

import { factories } from "@strapi/strapi";
import {
  EventFindMany,
  EventFindOne,
  EventFindPage,
  EventUpdate,
  filterGeneral,
  populate,
} from "./services";
import {
  TeamAccessFindMany,
  TeamAccessFindOne,
} from "../../team-access/services/services";
import { OrderAnalityEvent } from "../../order/services/services";

const onValidateData = async (user: any, eventId: any) => {
  if (!user) {
    return {
      status: false,
      message: "User not found",
    };
  }
  const eventData: any = await EventFindOne(
    null,
    {
      id_event: eventId,
    },
    ["id"]
  );

  if (!eventData) {
    return {
      status: false,
      message: "Event not found",
    };
  }

  if (user.id != eventData?.users_id.id) {
    return {
      status: false,
      message: "You are not the owner of this event",
    };
  }

  return {
    status: true,
    data: eventData,
  };
};

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
      const serviceTeam = await TeamAccessFindMany({
        user_id: {
          id: user.id,
        },
      });
      const resServiceTeam = (serviceTeam ?? []).map((item: any) => {
        return {
          ...item.event_id,
          type_role_id: item.type_role_id,
        };
      });
      return {
        data: [...service],
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

      const event: any = await EventFindOne(
        {
          ...populate,
          event_tickets_ids: { ...populate.event_tickets_ids, filters: {} },
          event_status_id: { ...populate.event_status_id, filters: {} },
          artists_ids: { ...populate.artists_ids, filters: {} },
          users_id: { ...populate.users_id, filters: {} },
        },
        { id_event: params.id }
      );
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
  async putUpdateEventFollowing({ user, params }) {
    try {
      const eventData: any = await onValidateData(user, params.id);

      if (!eventData?.status) {
        return {
          status: false,
          message: eventData?.message,
        };
      }

      await EventUpdate(eventData?.data?.id, {
        following: Number(eventData?.data?.following ?? 0) + 1,
      });

      return {
        message: "Update event successfully",
        status: true,
      };
    } catch (error) {
      return {
        status: false,
        message: `${error?.message || ""}`,
      };
    }
  },
  async putUpdateEvent({ user, params, body }) {
    try {
      const eventData: any = await onValidateData(user, params.id);

      if (!eventData?.status) {
        return {
          status: false,
          message: eventData?.message,
        };
      }
console.log(body)
      await EventUpdate(eventData?.data?.id, body);

      return {
        message: "Update event successfully",
        status: true,
      };
    } catch (error) {
      return {
        status: false,
        message: `${error?.message || ""}`,
      };
    }
  },
}));
