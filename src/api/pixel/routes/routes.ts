module.exports = {
  routes: [
    {
      method: "POST",
      path: "/pixel/postCreatePixel/:id",
      handler: "pixel.postCreatePixel",
      config: {
        auth: false,
      },
    },
    {
      method: "PUT",
      path: "/pixel/putUpdatePixel/:id",
      handler: "pixel.putUpdatePixel",
      config: {
        auth: false,
      },
    },
  ],
};
