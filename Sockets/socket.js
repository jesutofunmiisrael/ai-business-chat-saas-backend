let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on(
      "joinConversation",
      (conversationId) => {
        socket.join(conversationId);

        console.log(
          `Joined conversation: ${conversationId}`
        );
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.io not initialized"
    );
  }

  return io;
};

module.exports = {
  initSocket,
  getIO,
};