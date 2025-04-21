module.exports = {
  routes: [
    {
      method: "GET",
      path: "/event/getEventsHome",
      handler: "event.getEventsHome",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/event/getEventMeta/:id",
      handler: "event.getEventMeta",
      config: {
        auth: false,
      },
    },
  ],
};
