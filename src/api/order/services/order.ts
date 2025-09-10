/**
 * order service
 */

import { factories } from "@strapi/strapi";
import {
  PdfOrder,
  useGeneral,
  useGooglecCloud,
  useMoment,
  useSendGridClient,
  useSendGridMail,
  useStripe,
  useTwilio,
} from "../../../hooks";
import { EventFindOne, filterGeneral } from "../../event/services/services";
import {
  EventTicketFindOne,
  EventTickettUpdate,
} from "../../event-ticket/services/services";
import { useSeats } from "../../../hooks/useSeats";
import { validateUser } from "../../../extensions/users-permissions/services/services";
import {
  EventDiscountCodeFindOne,
  EventDiscountCodeUpdate,
} from "../../event-discount-code/services/services";
import { useCrypto } from "../../../hooks/useCrypto";
import {
  onGroupTickets,
  OrderCreate,
  OrderFindMany,
  OrderFindOne,
  OrderFindPage,
  OrderUpdate,
} from "./services";
import { TicketCreate, TicketUpdate } from "../../ticket/services/services";
import { EventAffiliateFindOne } from "../../event-affiliate/services/services";

const { validateEmail } = useSendGridClient();
const { getUniqueObjects } = useGeneral();
const { validateReserveSeats, bookSeats } = useSeats();
const {
  createPaymentMethod,
  createPaymentIntents,
  createRefund,
  updatePaymentIntents,
  retrievePaymentIntents,
} = useStripe();
const { encrypt } = useCrypto();
const { mailSend } = useSendGridMail();
const { uploadPDF } = useGooglecCloud();
const { sendSMSPhone } = useTwilio();

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

  // const resTeam = await onValidateTeamAccess({user, eventData});

  // if (!resTeam?.status) {
  //   return {
  //     status: false,
  //     message: resTeam?.message,
  //   };
  // }

  return {
    status: true,
    data: eventData,
  };
};

const onValidateTicket = async (eventData: any, tickets: any) => {
  if (!eventData.url_map) {
    let listTickets = (
      (await Promise.all(
        tickets?.map(async (ticket) => {
          return await EventTicketFindOne({
            id: ticket.id,
            stock: {
              $gt: 0,
              $gte: ticket.select,
            },
          });
        })
      )) || []
    ).filter((ticket) => ticket);

    if (listTickets?.length < tickets?.length) {
      return {
        status: false,
        message: `${getUniqueObjects(listTickets, tickets, "id")
          .map((obj) => obj.title)
          .join(", ")} ticket sold out`,
      };
    }
  } else {
    const allSeatIds = tickets.flatMap((item) => {
      if (item.isTable) {
        return item.seatId;
      } else {
        return Array(item.select).fill(item.seatId[0]);
      }
    });

    const reserveMap = await validateReserveSeats(
      eventData.url_map,
      allSeatIds
    );

    if (!reserveMap.status) {
      return {
        status: false,
        message: reserveMap.message,
      };
    }
  }

  return {
    status: true,
  };
};

const onTicketsFilter = (url_map: any, tickets: any) => {
  let result = tickets;
  if (url_map) {
    result = tickets
      .filter((item) => Array.isArray(item.seatId))
      .flatMap((item) => {
        return Array.from({ length: item?.select ?? 1 }).map((_, i) => {
          const seatI = item.isTable
            ? item.seatId?.[i] || null
            : item.seatId?.[0];
          const { seatId, select, ...rest } = item;
          return {
            ...rest,
            seatI,
          };
        });
      });
  } else {
    result = tickets.flatMap((item) => {
      return Array.from({ length: item?.select ?? 1 }).map((_, i) => {
        const seatI = item.isTable
          ? item.seatId?.[i] || null
          : item.seatId?.[0];
        const { seatId, select, ...rest } = item;
        return {
          ...rest,
          seatI,
        };
      });
    });
  }

  return result;
};

const table = "api::order.order";
export default factories.createCoreService(table, () => ({
  async getSendMail({ params }) {
    try {
      const { orderId } = params;

      const order = await OrderFindOne(
        {
          order_id: orderId,
        },
        {
          event_id: {
            populate: "*",
          },
          users_id: {
            populate: "*",
          },
          tickets_id: {
            populate: ["event_ticket_id"],
          },
        }
      );

      if ((!order || !order?.stripe_id) && !order?.freeOrder) {
        return {
          status: false,
          message: "Order not found or already paid",
        };
      }

      if (!order?.freeOrder) {
        const paymentInte = await retrievePaymentIntents(order?.stripe_id);
        if (!paymentInte?.status?.includes("succe")) {
          return {
            status: false,
            data: paymentInte,
            message: "Payment not found",
          };
        }
      }

      const { users_id, event_id, prices, tickets_id, url_pdf } = order as any;
      const {
        event_locations_id: locations,
        event_restriction_id: restriction,
      } = event_id;

      let pdfUrl = url_pdf;
      if (!url_pdf) {
        const pdf = await PdfOrder({ ...event_id, users_id }, tickets_id);
        pdfUrl = await uploadPDF(pdf, "order", `order_${orderId}`);
        OrderUpdate(order.id, {
          url_pdf: pdfUrl,
        });
      }

      await mailSend({
        email: users_id?.email || "",
        templateId: process.env.SENDGRID_TEMPLATE_ORDER,
        dynamicData: {
          pdfUrl: pdfUrl,
          ticket_id: order?.order_id,
          event: {
            image: event_id?.url_image,
            name: event_id?.name,
            date: useMoment(event_id?.start_date).format("dddd, D MMMM"),
            time: `${useMoment(event_id?.start_date).format(
              "hh:mm a"
            )} - ${useMoment(event_id?.end_date).format("hh:mm a")}`,
            location: locations.formatted_address,
            restriction: restriction.title,
          },
          tickets: onGroupTickets(tickets_id),
          refundable: (prices?.totalRefundable || 0).toFixed(2),
          subTotal: (prices?.discountCode || prices?.subTotal || 0).toFixed(2),
          serviceFees: (prices?.serviceFee || 0).toFixed(2),
          proccessingFee: (prices?.processingFee || 0).toFixed(2),
          total: (prices?.total || 0).toFixed(2),
        },
      });

      users_id?.phoneNumber &&
        sendSMSPhone(
          `${users_id?.country_id?.code || "+1"}${users_id?.phoneNumber}`,
          `Thank you for your order, ${users_id?.firstName || ""}! Your ticket to "${event_id?.name}" is confirmed. View your ticket here: ${pdfUrl}`
        ).catch((error) => {
          console.log("SMS Error", JSON.stringify(error));
        });

      return {
        message: "Email sent successfully",
        status: true,
      };
    } catch (error) {
      return {
        status: false,
        message: `${error?.message || ""}`,
      };
    }
  },
  async getMyOrders({ user }) {
    try {
      const order = await OrderFindMany(
        {
          users_id: {
            id: user.id,
          },
        },
        {
          event_id: {
            populate: "*",
          },
          users_id: {
            fields: ["id", "firstName", "lastName", "email", "phoneNumber"],
          },
          tickets_id: {
            populate: ["event_ticket_id"],
          },
        }
      );

      return {
        data: order,
        status: true,
      };
    } catch (error) {
      return {
        status: false,
        message: `${error?.message || ""}`,
      };
    }
  },
  async getAllOrdersList({ user, params }) {
    const eventData: any = await onValidateData(user, params.eventId);

    if (!eventData?.status) {
      return {
        status: false,
        message: eventData?.message,
      };
    }

    try {
      const order = await OrderFindMany(
        {
          $or: [
            { isRefundable: { $eq: false } },
            { isRefundable: { $null: true } },
          ],
        },
        {
          event_id: {
            populate: "*",
          },
          users_id: {
            populate: {
              country_id: {
                fields: ["code"],
              },
            },
            fields: ["id", "firstName", "lastName", "email", "phoneNumber"],
          },
          tickets_id: {
            populate: ["event_ticket_id"],
          },
          event_discount_code_id: {
            fields: ["name"],
          },
        }
      );

      return {
        data: order,
        status: true,
      };
    } catch (error) {
      return {
        status: false,
        message: `${error?.message || ""}`,
      };
    }
  },
  async getAllOrders({ user, params, query }) {
    const eventData: any = await onValidateData(user, params.eventId);

    if (!eventData?.status) {
      return {
        status: false,
        message: eventData?.message,
      };
    }

    const { search, page, size } = query;

    try {
      const order = await OrderFindPage(
        {
          event_id: {
            id: eventData?.data?.id,
          },
          $or: [{ freeOrder: { $eq: false } }, { freeOrder: { $null: true } }],
          ...(search?.length > 2 && {
            $or: [
              { users_id: { email: { $containsi: search || "" } } },
              { users_id: { firstName: { $containsi: search || "" } } },
              { users_id: { lastName: { $containsi: search || "" } } },
              { users_id: { phoneNumber: { $containsi: search || "" } } },
            ],
          }),
        },
        {
          event_id: {
            populate: "*",
          },
          users_id: {
            populate: {
              country_id: {
                fields: ["code"],
              },
            },
            fields: ["id", "firstName", "lastName", "email", "phoneNumber"],
          },
          tickets_id: {
            populate: ["event_ticket_id"],
          },
          event_discount_code_id: {
            fields: ["name"],
          },
        },
        {
          page: page || 1,
          pageSize: size || 10,
        }
      );

      return {
        data: order.results,
        pagination: order.pagination,
        status: true,
      };
    } catch (error) {
      return {
        status: false,
        message: `${error?.message || ""}`,
      };
    }
  },
  async getAllOrdersFree({ user, params, query }) {
    const eventData: any = await onValidateData(user, params.eventId);

    if (!eventData?.status) {
      return {
        status: false,
        message: eventData?.message,
      };
    }

    const { search, page, size } = query;

    try {
      const order = await OrderFindPage(
        {
          freeOrder: true,
          event_id: {
            id: eventData?.data?.id,
          },
          ...(search?.length > 2 && {
            $or: [
              { users_id: { email: { $containsi: search || "" } } },
              { users_id: { firstName: { $containsi: search || "" } } },
              { users_id: { lastName: { $containsi: search || "" } } },
              { users_id: { phoneNumber: { $containsi: search || "" } } },
            ],
          }),
        },
        {
          event_id: {
            populate: "*",
          },
          users_id: {
            populate: {
              country_id: {
                fields: ["code"],
              },
            },
            fields: ["id", "firstName", "lastName", "email", "phoneNumber"],
          },
          tickets_id: {
            populate: ["event_ticket_id"],
          },
          event_discount_code_id: {
            fields: ["name"],
          },
        },
        {
          page: page || 1,
          pageSize: size || 10,
        }
      );

      return {
        data: order.results,
        pagination: order.pagination,
        status: true,
      };
    } catch (error) {
      return {
        status: false,
        message: `${error?.message || ""}`,
      };
    }
  },
  async getRefundOrder({ user, params }) {
    try {
      const eventData: any = await onValidateData(user, params.eventId);

      if (!eventData?.status) {
        return {
          status: false,
          message: eventData?.message,
        };
      }

      const orderData = await OrderFindOne({ order_id: params.orderId });

      if (!orderData) {
        return {
          status: false,
          message: "Order not found",
        };
      }

      if (orderData?.isRefundable) {
        return {
          status: false,
          message: "The order has already been refunded",
        };
      }

      const refund = await createRefund({
        paymentIntentId: orderData.stripe_id,
        amount: orderData.base_price,
      });

      if (refund.status == "succeeded") {
        await OrderUpdate(orderData.id, {
          isRefundable: true,
        });
      }

      return {
        data: refund.status,
        status: true,
      };
    } catch (error) {
      return {
        status: false,
        message: `${error?.message || ""}`,
      };
    }
  },
  async postSendMail({ params, body }) {
    try {
      const { orderId } = params;

      const order = await OrderFindOne(
        {
          order_id: orderId,
        },
        {
          event_id: {
            populate: "*",
          },
          users_id: {
            populate: "*",
          },
          tickets_id: {
            populate: ["event_ticket_id"],
          },
        }
      );

      if ((!order || !order?.stripe_id) && !order?.freeOrder) {
        return {
          status: false,
          message: "Order not found or already paid",
        };
      }

      if (!order?.freeOrder) {
        const paymentInte = await retrievePaymentIntents(order?.stripe_id);
        if (!paymentInte?.status?.includes("succe")) {
          return {
            status: false,
            data: paymentInte,
            message: "Payment not found",
          };
        }
      }

      const { users_id, event_id, prices, tickets_id, url_pdf } = order as any;
      const {
        event_locations_id: locations,
        event_restriction_id: restriction,
      } = event_id;

      let pdfUrl = url_pdf;
      if (!url_pdf) {
        const pdf = await PdfOrder({ ...event_id, users_id }, tickets_id);
        pdfUrl = await uploadPDF(pdf, "order", `order_${orderId}`);
        OrderUpdate(order.id, {
          url_pdf: pdfUrl,
        });
      }

      await mailSend({
        email: users_id?.email || "",
        templateId: process.env.SENDGRID_TEMPLATE_ORDER,
        dynamicData: {
          pdfUrl: pdfUrl,
          ticket_id: order?.order_id,
          event: {
            image: event_id?.url_image,
            name: event_id?.name,
            date: useMoment(event_id?.start_date).format("dddd, Do MMMM"),
            time: `${useMoment(event_id?.start_date).format(
              "hh:mm a"
            )} - ${useMoment(event_id?.end_date).format("hh:mm a")}`,
            location: locations.formatted_address,
            restriction: restriction.title,
          },
          tickets: onGroupTickets(tickets_id),
          refundable: order?.freeOrder
            ? 0
            : (prices?.totalRefundable || 0).toFixed(2),
          subTotal: (prices?.discountCode || prices?.subTotal || 0).toFixed(2),
          serviceFees: order?.freeOrder
            ? 0
            : (prices?.serviceFee || 0).toFixed(2),
          proccessingFee: order?.freeOrder
            ? 0
            : (prices?.processingFee || 0).toFixed(2),
          total: order?.freeOrder ? 0 : (prices?.total || 0).toFixed(2),
        },
      });

      sendSMSPhone(
        `${users_id?.country_id?.code || "+1"}${users_id?.phoneNumber}`,
        `Thank you for your order, ${users_id?.firstName || ""}! Your ticket to "${event_id?.name}" is confirmed. View your ticket here: ${pdfUrl}`
      ).catch((error) => {
        console.log("SMS Error", JSON.stringify(error));
      });

      return {
        message: "Email sent successfully",
        status: true,
      };
    } catch (error) {
      return {
        status: false,
        message: `${error?.message || ""}`,
      };
    }
  },
  async postCreatePayment({ body }) {
    try {
      const { userData, eventId, tickets, type, paymentId, values } = body;

      const emailVal = await validateEmail(userData.email);
      if (emailVal != "Valid") {
        return {
          status: false,
          data: null,
          message: "Verify your email not valid",
        };
      }

      const eventData: any = await EventFindOne(
        {
          event_status_id: true,
        },
        {
          ...filterGeneral,
          id_event: eventId,
        },
        ["id", "url_map", "name"]
      );

      if (!eventData) {
        return {
          status: false,
          data: null,
          message: "Event not found",
        };
      }

      if (eventData?.event_status_id?.id != 1) {
        return {
          status: false,
          data: null,
          message: "Event is not active",
        };
      }

      const validateTicket = await onValidateTicket(eventData, tickets);

      if (!validateTicket.status) {
        return {
          status: false,
          message: validateTicket.message,
        };
      }

      let paymentMethodId = paymentId;
      if (type == "card") {
        const paymentMethod = await createPaymentMethod(paymentMethodId);
        if (!paymentMethod) {
          return {
            status: false,
            message: "Failed to create payment method",
          };
        }
        paymentMethodId = paymentMethod.id;
      }

      let metadata = {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        country: userData.country,
        phone: userData.phoneNumber,
        eventName: eventData?.name,
        id_event: eventId,
        prices: JSON.stringify(values),
        priceBase: values.discountCode || values.subTotal,
      };
      let paymentRequest = {
        amount: values.total,
        data: metadata,
        payment: paymentMethodId,
      };

      const paymentIntents = await createPaymentIntents(paymentRequest);

      return {
        data: {
          id: paymentIntents.id,
          client_secret: paymentIntents.client_secret,
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
  async postCreatePaymentFree({ user, body }) {
    try {
      const { userData, eventId, tickets } = body;

      const emailVal = await validateEmail(userData.email);
      if (emailVal != "Valid") {
        return {
          status: false,
          data: null,
          message: "Verify your email not valid",
        };
      }

      const eventData: any = await onValidateData(user, eventId);

      if (!eventData?.status) {
        return {
          status: false,
          message: eventData?.message,
        };
      }

      const validateTicket = await onValidateTicket(eventData.data, tickets);

      if (!validateTicket.status) {
        return {
          status: false,
          message: validateTicket.message,
        };
      }

      return {
        data: "",
        status: true,
      };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
  async postCreateOrder({ body }) {
    try {
      const { userData, eventId, tickets, values, payment, aff } = body;

      const eventData: any = await EventFindOne(
        {},
        {
          ...filterGeneral,
          id_event: eventId,
        },
        ["id", "url_map", "name"]
      );

      if (!eventData || !userData.email) {
        return {
          status: false,
          data: null,
          message: "Event not found",
        };
      }

      const valOrder = await OrderFindOne({ stripe_id: payment.id });
      if (valOrder) {
        return {
          status: false,
          data: null,
          message: "The order has been paid",
        };
      }

      delete userData?.phoneNumber;
      const valUser = await validateUser(userData);

      let affiliateId = null;
      if (aff) {
        affiliateId = await EventAffiliateFindOne(null, {
          event_id: {
            id: eventData?.id,
          },
          id_affiliate: aff,
          isVisible: true,
          expiration_date: {
            $gte: new Date(),
          },
        });
      }

      let codeDiscount = null;
      if (userData.discountCode) {
        codeDiscount = await EventDiscountCodeFindOne(
          {},
          {
            event_id: {
              id_event: eventId,
            },
            name: {
              $eqi: userData.discountCode ?? "",
            },
          },
          ["id", "stock"]
        );

        codeDiscount &&
          EventDiscountCodeUpdate(codeDiscount.id, {
            stock: codeDiscount.stock + 1,
          });
      }

      // url_pdf
      const order = await OrderCreate({
        stripe_id: payment.id,
        total_price: values.total,
        base_price: values.subTotal,
        service_fee: values.discountCode
          ? Number(values.subTotal) - Number(values.discountCode)
          : 0,
        prices: values || {},
        price_refundable: values.totalRefundable || 0,
        event_id: eventData?.id,
        event_discount_code_id: codeDiscount?.id || null,
        users_id: valUser.id,
        event_affiliate_id: affiliateId?.id || null,
      });
      if (!order) {
        return {
          status: false,
          message: "Failed to create order",
        };
      }

      const dateString = useMoment().format("DDMMYYYY");
      const orderEncrypt = encrypt(`orderId${order.id}${dateString}`);
      await OrderUpdate(order.id, {
        order_id: orderEncrypt,
      });

      await updatePaymentIntents(payment.id, {
        metadata: {
          order_id: orderEncrypt,
        },
      });

      let result = onTicketsFilter(eventData.url_map, tickets);

      const ticktsList = await Promise.all(
        result.map(async (item) => {
          return await TicketCreate(
            {
              table: item?.isTable ? item?.seatI : null,
              orders_id: order.id,
              value: item?.price || 0,
              event_ticket_id: item?.id,
            },
            {},
            ["id"]
          );
        })
      );

      if (eventData.url_map) {
        const allSeatIds = tickets.flatMap((item) => {
          if (item.isTable) {
            return item.seatId;
          } else {
            return Array(item.select).fill(item.seatId[0]);
          }
        });
        await bookSeats(eventData.url_map, allSeatIds);
      }

      const dateStringTicket = useMoment().format("DDMMYYYY");
      await Promise.all(
        ticktsList.map(async (item) => {
          return await TicketUpdate(item.id, {
            id_ticket: encrypt(`ticketId${item.id}${dateStringTicket}`),
          });
        })
      );

      tickets.map((item) => {
        EventTickettUpdate(item.id, { stock: item.stock - item.select });
      });

      return {
        data: orderEncrypt,
        status: true,
      };
    } catch (error) {
      return {
        status: false,
        message: `${error?.message || ""}`,
      };
    }
  },
  async postCreateOrderFree({ body }) {
    try {
      const { userData, eventId, tickets, values } = body;

      const eventData = await EventFindOne(
        {},
        {
          ...filterGeneral,
          id_event: eventId,
        },
        ["id", "url_map", "name"]
      );

      if (!eventData || !userData.email) {
        return {
          status: false,
          data: null,
          message: "Event not found",
        };
      }

      delete userData?.phoneNumber;
      const valUser = await validateUser(userData);

      // url_pdf
      const order = await OrderCreate({
        total_price: values.total,
        base_price: values.subTotal,
        service_fee: 0,
        prices: values || {},
        price_refundable: 0,
        event_id: eventData?.id,
        users_id: valUser.id,
        freeOrder: true,
      });
      if (!order) {
        return {
          status: false,
          message: "Failed to create order",
        };
      }

      const dateString = useMoment().format("DDMMYYYY");
      const orderEncrypt = encrypt(`orderId${order.id}${dateString}`);
      await OrderUpdate(order.id, {
        order_id: orderEncrypt,
      });

      let result = onTicketsFilter(eventData.url_map, tickets);

      const ticktsList = await Promise.all(
        result.map(async (item) => {
          return await TicketCreate(
            {
              table: item?.isTable ? item?.seatI : null,
              orders_id: order.id,
              value: item?.price || 0,
              event_ticket_id: item?.id,
            },
            {},
            ["id"]
          );
        })
      );

      if (eventData.url_map) {
        const allSeatIds = tickets.flatMap((item) => {
          if (item.isTable) {
            return item.seatId;
          } else {
            return Array(item.select).fill(item.seatId[0]);
          }
        });
        await bookSeats(eventData.url_map, allSeatIds);
      }

      const dateStringTicket = useMoment().format("DDMMYYYY");
      await Promise.all(
        ticktsList.map(async (item) => {
          return await TicketUpdate(item.id, {
            id_ticket: encrypt(`ticketId${item.id}${dateStringTicket}`),
          });
        })
      );

      tickets.map((item) => {
        EventTickettUpdate(item.id, { stock: item.stock - item.select });
      });

      return {
        data: orderEncrypt,
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
