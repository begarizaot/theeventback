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
  ],
};
