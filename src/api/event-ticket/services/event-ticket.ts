/**
 * event-ticket service
 */

import { factories } from "@strapi/strapi";
import { EventTicketFindMany } from "./services";

const table = "api::event-ticket.event-ticket";

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
}));
