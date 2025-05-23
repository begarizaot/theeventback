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

  //   if (user.id != eventData?.users_id.id) {
  //     return {
  //       status: false,
  //       message: "You are not the owner of this event",
  //     };
  //   }

  return {
    status: true,
    data: eventData,
  };
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

      if (!order || !order.stripe_id) {
        return {
          status: false,
          message: "Order not found or already paid",
        };
      }

      const paymentInte = await retrievePaymentIntents(order.stripe_id);
      if (!paymentInte?.status?.includes("succe")) {
        return {
          status: false,
          data: paymentInte,
          message: "Payment not found",
        };
      }

      const { users_id, event_id, prices, tickets_id, url_pdf } = order as any;
      const {
        event_locations_id: locations,
        event_restriction_id: restriction,
      } = event_id;

      let pdfUrl = url_pdf;
      if (!url_pdf) {
        const pdf = await PdfOrder(event_id, tickets_id);
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
              "HH:mm a"
            )} - ${useMoment(event_id?.end_date).format("HH:mm a")}`,
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
  async getAllOrders({ user, params, query }) {
    const eventData: any = await onValidateData(user, params.eventId);

    if (!eventData?.status) {
      return {
        status: false,
        message: eventData?.message,
      };
    }

    const { search, page, size, total, date } = query;

    try {
      const order = await OrderFindPage(
        {
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

      const eventData = await EventFindOne(
        {},
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
  async postCreateOrder({ body }) {
    try {
      const { userData, eventId, tickets, values, payment } = body;

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

      const valOrder = await OrderFindOne({ stripe_id: payment.id });
      if (valOrder) {
        return {
          status: false,
          data: null,
          message: "The order has been paid",
        };
      }

      const valUser = await validateUser(userData);

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
      });
      if (!order) {
        return {
          status: false,
          message: "Failed to create order",
        };
      }

      const orderEncrypt = encrypt(`order_${order.id}`);
      OrderUpdate(order.id, {
        order_id: orderEncrypt,
      });

      updatePaymentIntents(payment.id, {
        metadata: {
          order_id: orderEncrypt,
        },
      });

      const result = tickets
        .filter((item) => Array.isArray(item.seatId))
        .flatMap((item) => {
          return Array.from({ length: item.select }).map((_, i) => {
            const seatI = item.isTable
              ? item.seatId[i] || null
              : item.seatId[0];
            const { seatId, select, ...rest } = item;
            return {
              ...rest,
              seatI,
            };
          });
        });

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

      await Promise.all(
        ticktsList.map(async (item) => {
          return await TicketUpdate(item.id, {
            id_ticket: encrypt(`ticket_${item.id}`),
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
