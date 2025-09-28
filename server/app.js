
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { coreRouter } = require("./core/routes");

const app = express();
const port = 5000;

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(bodyParser.json());

// Attach io to app for access in routes
app.set("io", io);
app.use("/api/core", coreRouter);

// handle uncaught errors
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
