/**
 * event service
 */

import { factories } from "@strapi/strapi";
import {
  EventCreate,
  EventFindMany,
  EventFindOne,
  EventFindPage,
  EventUpdate,
  filterGeneral,
  populate,
} from "./services";
import {
  onValidateTeamAccess,
  TeamAccessCreate,
  TeamAccessFindMany,
} from "../../team-access/services/services";
import { OrderAnalityEvent } from "../../order/services/services";
import { EventLocationFindCreate } from "../../event-location/services/services";
import { useGooglecCloud, useMoment } from "../../../hooks";
import { useCrypto } from "../../../hooks/useCrypto";
import { EventTicketCreate } from "../../event-ticket/services/services";
import {
  SuperAdminFindMany,
  SuperAdminFindOne,
} from "../../super-admin/services/services";
import { HomeFindMany } from "../../home/services/services";

const { uploadImage } = useGooglecCloud();
const { encrypt } = useCrypto();

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

  const resTeam = await onValidateTeamAccess({ user, eventData });

  if (!resTeam?.status) {
    return {
      status: false,
      message: resTeam?.message,
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
      const data: any = await HomeFindMany();
      const eventId = data?.eventCarruselItem?.[0]?.isVisible
        ? data?.eventCarruselItem?.[0]?.event_id?.id
        : null;
      const service = await EventFindPage(
        {
          ...filterGeneral,
          id: {
            $notIn: eventId ? [eventId] : [],
          },
        },
        {
          pageSize: 3,
          page: 1,
        },
        {
          start_date: "asc",
        }
      );

      const results =
        data?.automaticCarruselItem && !eventId
          ? service.results.slice(1)
          : service.results;

      return { data: results, status: true };
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
          start_date: "desc",
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

      const sortedEvents = [...service, ...resServiceTeam].sort(
        (a, b) =>
          new Date(b?.start_date).getTime() - new Date(a?.start_date).getTime()
      );

      return {
        data: sortedEvents,
        status: true,
      };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
  async getEventAllPage({ query }) {
    const { search, page, size, filter } = query;

    const dataFilter = filter ? JSON.parse(filter) : {};

    try {
      const service = await EventFindPage(
        {
          ...(search?.length > 2 && { name: { $containsi: search || "" } }),
          ...(dataFilter && {
            ...(dataFilter.category
              ? {
                  categories_id: {
                    slug: { $containsi: dataFilter.category || "" },
                  },
                }
              : {}),
          }),
          ...filterGeneral,
        },
        {
          pageSize: size,
          page: page,
        },
        {
          start_date: "asc",
        }
      );
      return {
        data: service.results,
        pagination: service.pagination,
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

      return {
        data: event,
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

      const adminUser = await SuperAdminFindOne({
        users_id: {
          id: user.id,
        },
      });

      const event: any = await EventFindOne(null, { id_event: params.id });
      if (!event) {
        return {
          status: false,
          message: "Event not found",
        };
      }

      let res = await OrderAnalityEvent(event.id, event.url_map);

      if (!adminUser) {
        res.eventSales.ticketData = res?.eventSales?.ticketData?.filter(
          (item: any) => item.isAdmin != true
        );
      }
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
  async postCreateEvent({ user, body }) {
    try {
      if (!user) {
        return {
          status: false,
          message: "User not found",
        };
      }

      delete body.id_event;

      const eventData = await EventCreate({
        ...body,
        ...(body?.categories && {
          categories_id: body?.categories,
        }),
        ...(body?.artists && {
          artists_ids: body?.artists,
        }),
        ...(body?.age_restrictions && {
          event_restriction_id: body?.age_restrictions,
        }),
        ...(body?.startEndDate && {
          start_date: useMoment(body?.startEndDate[0]),
          end_date: useMoment(body?.startEndDate[1]),
        }),
        users_id: user.id,
        event_status_id: 1,
        slug: body?.name
          ?.toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, ""),
      });

      let locationData: any = null;
      if (body?.place) {
        locationData = await EventLocationFindCreate(
          body?.place,
          eventData?.id
        );
      }

      const listTickets = await Promise.all(
        body?.tickests?.map(async (item: any) => {
          const res = await EventTicketCreate({
            ...item,
            event_id: eventData?.id,
            stock: item?.quantity,
            ...(item?.startEndDate
              ? {
                  start_date: useMoment(item?.startEndDate[0]),
                  end_date: useMoment(item?.startEndDate[1]),
                }
              : {
                  start_date: eventData?.start_date,
                  end_date: eventData?.end_date,
                }),
            ...(item?.codePassword && {
              codePassword: item?.codePassword,
            }),
          });
          return res.id;
        })
      );

      const dateString = useMoment().format("DDMMYYYY");
      const eventEncrypt = encrypt(`eventId${eventData.id}${dateString}`);
      const eventDataRes = await EventUpdate(eventData?.id, {
        ...(body?.place && {
          event_locations_id: locationData?.id,
        }),
        id_event: eventEncrypt,
        event_tickets_ids: listTickets,
      });

      const superAdmins = await SuperAdminFindMany();

      if (superAdmins && superAdmins?.length > 0) {
        await Promise.all(
          superAdmins.map(async (item: any) => {
            TeamAccessCreate({
              event_id: eventData?.id,
              user_id: item?.users_id?.id,
              type_role_id: 1,
            });
          })
        );
      }

      return {
        message: "create event successfully",
        data: eventDataRes,
        status: true,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: `${error?.message || ""}`,
      };
    }
  },
  async putUpdateEventFollowing({ params }) {
    try {
      const eventData: any = await EventFindOne(
        null,
        {
          id_event: params.id,
        },
        ["id", "following"]
      );

      if (!eventData) {
        return {
          status: false,
          message: "Event not found",
        };
      }

      await EventUpdate(eventData?.id, {
        following: Number(eventData?.following ?? 0) + 1,
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

      let locationData: any = null;

      if (body?.place) {
        locationData = await EventLocationFindCreate(
          body?.place,
          eventData?.data?.id
        );
      }

      delete body.id_event;

      await EventUpdate(eventData?.data?.id, {
        ...body,
        ...(body?.categories && {
          categories_id: body?.categories,
        }),
        ...(body?.artists && {
          artists_ids: body?.artists,
        }),
        ...(body?.age_restrictions && {
          event_restriction_id: body?.age_restrictions,
        }),
        ...(body?.place && {
          event_locations_id:
            locationData?.id || eventData?.data?.event_locations_id,
        }),
        ...(body?.startEndDate && {
          start_date: useMoment(body?.startEndDate[0]),
          end_date: useMoment(body?.startEndDate[1]),
        }),
      });

      return {
        message: "Update event successfully",
        status: true,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: `${error?.message || ""}`,
      };
    }
  },
  async putUpdateEventImage({ user, params, files }) {
    try {
      const eventData: any = await onValidateData(user, params.id);

      if (!eventData?.status) {
        return {
          status: false,
          message: eventData?.message,
        };
      }

      if (!files?.image) {
        return {
          status: false,
          message: "No files provided",
        };
      }

      const url_image = await uploadImage(
        "events",
        files?.image,
        eventData?.data?.id,
        `event_id_${eventData?.data?.id}_${new Date().getTime()}`
      );

      await EventUpdate(eventData?.data?.id, {
        url_image: url_image,
      });

      return {
        message: "Update event image successfully",
        status: true,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: `${error?.message || ""}`,
      };
    }
  },
  async postCreateUsers({ body }) {
    try {
      // Procesar los primeros 5 elementos del body

      // const res = await Promise.all(
      //   body.map(async (item: any, index: number) => {
      //     try {
      //       const validatedUserId = await UserFindOne({
      //         email: { $eqi: item?.users_id || "" },
      //       });

      //       const infoORder = { ...item };
      //       delete infoORder.tickets_id;
      //       const order = await OrderCreate({
      //         ...infoORder,
      //         users_id: validatedUserId?.id,
      //       });

      //       const dateString = useMoment().format("DDMMYYYY");
      //       const orderEncrypt = encrypt(`orderId${order.id}${dateString}`);
      //       await OrderUpdate(order.id, {
      //         order_id: orderEncrypt,
      //       });

      //       const ticktsList = await Promise.all(
      //         item.tickets_id.map(async (ticket) => {
      //           const eventTicket = await EventTicketFindOne({
      //             title: { $eqi: ticket?.ticket_type_id || "" },
      //             event_id: item?.event_id,
      //           });

      //           delete ticket.ticket_type_id;
      //           return await TicketCreate(
      //             {
      //               ...ticket,
      //               orders_id: order.id,
      //               event_ticket_id: eventTicket?.id,
      //             },
      //             {},
      //             ["id"]
      //           );
      //         })
      //       );

      //       const dateStringTicket = useMoment().format("DDMMYYYY");
      //       await Promise.all(
      //         ticktsList.map(async (ticket) => {
      //           return await TicketUpdate(ticket.id, {
      //             id_ticket: encrypt(`ticketId${ticket.id}${dateStringTicket}`),
      //           });
      //         })
      //       );

      //       return ticktsList;
      //     } catch (err) {
      //       console.error(`Error procesando evento ${index + 1}:`, err);
      //       return null;
      //     }
      //   })
      // );

      return {
        message: "User added to event successfully",
        // length: body.length,
        // data: res,
        status: true,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: `${error?.message || ""}`,
      };
    }
  },
}));
