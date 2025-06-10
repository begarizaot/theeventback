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
      method: "POST",
      path: "/event-ticket/createTicketEvents/:id",
      handler: "event-ticket.createTicketEvents",
    },
    {
      method: "PUT",
      path: "/event-ticket/editTicketEvents/:id",
      handler: "event-ticket.editTicketEvents",
    },
  ],
};
