const http = require("http");

const app = require("./index");

const connectDB = require(
  "./Config/ConnectTODbase"
);

const { initSocket } = require("./Sockets/socket");

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});