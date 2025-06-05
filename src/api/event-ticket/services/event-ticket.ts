/**
 * event-ticket service
 */

import { factories } from "@strapi/strapi";
import { EventTicketFindMany, EventTickettUpdate } from "./services";
import { EventFindOne } from "../../event/services/services";

const table = "api::event-ticket.event-ticket";

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

export default factories.createCoreService(table, () => ({
  async getTicketEvents({ params }) {
    try {
      const service = await EventTicketFindMany({
        event_id: {
          id_event: params.id,
        },
      });
      return { data: service, status: true };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
  async putTicketEvents({ user, params, body }) {
    try {
      const eventData: any = await onValidateData(user, params.id);
      if (!eventData?.status) {
        return {
          status: false,
          message: eventData?.message,
        };
      }

      const { id } = body;

      await EventTickettUpdate(id, { ...body });

      return {
        message: "Ticket updated successfully",
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
