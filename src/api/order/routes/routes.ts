module.exports = {
  routes: [
    {
      method: "GET",
      path: "/order/getSendMail/:orderId",
      handler: "order.getSendMail",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/order/getMyOrders",
      handler: "order.getMyOrders",
    },
    {
      method: "GET",
      path: "/order/getAllOrdersList/:eventId",
      handler: "order.getAllOrdersList",
    },
    {
      method: "GET",
      path: "/order/getAllOrders/:eventId",
      handler: "order.getAllOrders",
    },
    {
      method: "GET",
      path: "/order/getAllOrdersFree/:eventId",
      handler: "order.getAllOrdersFree",
    },
    {
      method: "GET",
      path: "/order/getRefundOrder/:eventId/:orderId",
      handler: "order.getRefundOrder",
    },
    {
      method: "POST",
      path: "/order/postCreatePayment",
      handler: "order.postCreatePayment",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/order/postCreatePaymentFree",
      handler: "order.postCreatePaymentFree",
    },
    {
      method: "POST",
      path: "/order/postCreateOrder",
      handler: "order.postCreateOrder",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/order/postCreateOrderFree",
      handler: "order.postCreateOrderFree",
    },
    {
      method: "POST",
      path: "/order/postSendMail/:orderId",
      handler: "order.postSendMail",
      config: {
        auth: false,
      },
    },
  ],
};
