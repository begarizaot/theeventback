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
      path: "/order/getAllOrders/:eventId",
      handler: "order.getAllOrders",
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
      path: "/order/postCreateOrder",
      handler: "order.postCreateOrder",
      config: {
        auth: false,
      },
    },
  ],
};
