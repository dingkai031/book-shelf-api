/* eslint-disable no-console */
const Hapi = require("@hapi/hapi");
const { routes } = require("./routes");

// eslint-disable-next-line func-names
(async function () {
  const server = Hapi.server({
    port: 5000,
    host: "localhost",
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
})();
