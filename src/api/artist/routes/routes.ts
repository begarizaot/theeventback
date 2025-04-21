module.exports = {
  routes: [
    {
      method: "GET",
      path: "/artist/getArtist",
      handler: "artist.getArtist",
      config: {
        auth: false,
      },
    },
  ],
};
