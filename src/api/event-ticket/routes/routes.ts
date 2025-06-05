module.exports = {
  routes: [
    {
      method: "GET",
      path: "/event-ticket/getTicketEvents/:id",
      handler: "event-ticket.getTicketEvents",
      config: {
        auth: false,
      },
    },
    {
      method: "PUT",
      path: "/event-ticket/putTicketEvents/:id",
      handler: "event-ticket.putTicketEvents",
    },
  ],
};
