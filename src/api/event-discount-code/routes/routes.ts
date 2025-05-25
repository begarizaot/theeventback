module.exports = {
  routes: [
    {
      method: "GET",
      path: "/event-discount-code/getListDiscountCode/:eventId",
      handler: "event-discount-code.getListDiscountCode",
    },
    {
      method: "POST",
      path: "/event-discount-code/postEventsDiscountCode/:id",
      handler: "event-discount-code.postEventsDiscountCode",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/event-discount-code/postCreateDiscountCode/:eventId",
      handler: "event-discount-code.postCreateDiscountCode",
    },
    {
      method: "PUT",
      path: "/event-discount-code/putUpdateDiscountCode/:eventId",
      handler: "event-discount-code.putUpdateDiscountCode",
    },
  ],
};
