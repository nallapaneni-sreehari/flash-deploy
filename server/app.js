const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { coreRouter } = require("./core/routes");

const app = express();
// const port = process.env.PORT || 3000;
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api/core", coreRouter);

// handle uncaught errors
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
