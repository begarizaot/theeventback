/**
 * event-ticket service
 */

import { factories } from "@strapi/strapi";
import {
  EventTicketCreate,
  EventTicketFindMany,
  EventTicketFindOne,
  EventTickettUpdate,
} from "./services";
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
    ["id", "start_date", "end_date"]
  );

  if (!eventData) {
    return {
      status: false,
      message: "Event not found",
    };
  }

  // if (user.id != eventData?.users_id.id) {
  //   return {
  //     status: false,
  //     message: "You are not the owner of this event",
  //   };
  // }

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
  async createTicketEvents({ user, params, body }) {
    try {
      const eventData: any = await onValidateData(user, params.id);
      if (!eventData?.status) {
        return {
          status: false,
          message: eventData?.message,
        };
      }

      await EventTicketCreate({
        ...body,
        event_id: eventData?.data?.id,
        ...(body?.startEndDate
          ? {
              start_date: body?.startEndDate[0],
              end_date: body?.startEndDate[1],
            }
          : {
              start_date: eventData?.data?.start_date,
              end_date: eventData?.data?.end_date,
            }),
        ...(body?.codePassword && {
          codePassword: body?.codePassword,
        }),
      });

      return {
        message: "Ticket created successfully",
        status: true,
      };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
  async editTicketEvents({ user, params, body }) {
    try {
      const eventData: any = await onValidateData(user, params.id);
      if (!eventData?.status) {
        return {
          status: false,
          message: eventData?.message,
        };
      }

      const { id } = body;

      const ticket = await EventTicketFindOne({
        id: id,
      });

      if (!ticket) {
        return {
          status: false,
          message: "Ticket not found",
        };
      }

      const quantityDiff = body.quantity - ticket.stock;

      if (quantityDiff < 0) {
        return {
          status: false,
          message: "Stock cannot be less than quantity",
        };
      }

      await EventTickettUpdate(id, {
        ...body,
        stock: body?.stock || 0,
        ...(body?.startEndDate && {
          start_date: body?.startEndDate[0],
          end_date: body?.startEndDate[1],
        }),
      });

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
