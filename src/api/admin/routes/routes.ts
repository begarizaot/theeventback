module.exports = {
  routes: [
    {
      method: "GET",
      path: "/admin/getAdmin/:id",
      handler: "admin.getAdmin",
    },
  ],
};
