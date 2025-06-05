module.exports = {
  routes: [
    {
      method: "GET",
      path: "/category/getListCategories",
      handler: "category.getListCategories",
      config: {
        auth: false,
      },
    },
  ],
};
