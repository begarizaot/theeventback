/**
 * ticket service
 */

import { factories } from "@strapi/strapi";
import { TeamAccessFindOne } from "../../team-access/services/services";
import { EventFindOne } from "../../event/services/services";
import { TicketFindOne, TicketUpdate } from "./services";

const onValidateUSer = async (user, eventId) => {
  if (!user || !user.id) {
    return {
      status: false,
      message: "User not found or not authenticated.",
    };
  }
  const eventData: any = await EventFindOne(
    null,
    {
      id_event: eventId,
    },
    ["id"]
  );

  const isTeam: any = await TeamAccessFindOne({
    event_id: eventData.id,
    user_id: user?.id,
  });

  if (!isTeam && user.id != eventData?.users_id.id) {
    return {
      status: false,
      message: "User does not have access to this event.",
    };
  }

  return {
    status: true,
    data: eventData,
  };
};

const table = "api::ticket.ticket";
export default factories.createCoreService(table, () => ({
  async getTicketData({ user, params }) {
    try {
      const eventData = await onValidateUSer(user, params.eventId);
      if (!eventData?.status) {
        return {
          status: false,
          message:
            eventData?.message || "User does not have access to this event.",
        };
      }

      const dataTicket = await TicketFindOne(
        {
          event_ticket_id: {
            fields: ["title"],
          },
        },
        {
          id_ticket: params.ticketId,
        }
      );

      if (!dataTicket) {
        return {
          status: false,
          message: "Ticket not found.",
        };
      }

      if (dataTicket.isScanner) {
        return {
          status: false,
          message: "Ticket is already scanned.",
        };
      }

      return {
        data: dataTicket,
        status: true,
      };
    } catch (error) {
      return {
        status: false,
        message: `${error?.message || ""}`,
      };
    }
  },
  async getScannerTicket({ user, params }) {
    try {
      const eventData = await onValidateUSer(user, params.eventId);
      if (!eventData?.status) {
        return {
          status: false,
          message:
            eventData?.message || "User does not have access to this event.",
        };
      }

      const dataTicket = await TicketFindOne(
        {},
        {
          id_ticket: params.ticketId,
        }
      );

      if (!dataTicket) {
        return {
          status: false,
          message: "Ticket not found.",
        };
      }

      if (dataTicket.isScanner) {
        return {
          status: false,
          message: "Ticket is already scanned.",
        };
      }

      await TicketUpdate(dataTicket.id, {
        isScanner: true,
        scanner_date: new Date(),
      });

      return {
        message: "Ticket scanned successfully.",
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
