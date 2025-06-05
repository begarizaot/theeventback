module.exports = {
  routes: [
    {
      method: "GET",
      path: "/event-restriction/getListRestrictions",
      handler: "event-restriction.getListRestrictions",
      config: {
        auth: false,
      },
    },
  ],
};
