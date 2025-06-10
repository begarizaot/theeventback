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
    {
      method: "GET",
      path: "/artist/getListArtist",
      handler: "artist.getListArtist",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/artist/getArtistAllPage",
      handler: "artist.getArtistAllPage",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/artist/getArtistDetail/:id",
      handler: "artist.getArtistDetail",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/artist/getArtistMeta/:id",
      handler: "artist.getArtistMeta",
      config: {
        auth: false,
      },
    },
  ],
};
