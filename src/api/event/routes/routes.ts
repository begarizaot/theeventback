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
  ],
};
