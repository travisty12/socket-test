const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(
      "https://mern-stack-test-travis.herokuapp.com/api/product"
      );
    socket.emit("FromAPI", res.data);
    console.log('emitted');
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

let interval;

io.on("connection", socket => {
  console.log("New client connected");

  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 10000);

  socket.on("FromClient", async (packet) => {
    const res = await axios.post(
      "https://mern-stack-test-travis.herokuapp.com/api/product", packet
      );
    console.log("returned: ", res.data);
    socket.emit("ReceivePacket", true);
    console.log('emitted confirmation');
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

