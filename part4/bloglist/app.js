const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const middleware = require("./utils/middleware");
const config = require("./utils/config");
const logger = require("./utils/logger");

logger.info("starting up at", config.MONGODB_URI, process.env.NODE_ENV);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use(middleware.requestLogger);

app.use("/api/login", loginRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

//Create and assign the testing router only if we're in the testing environment
if (process.env.NODE_ENV === "test") {
  console.log(`Server booting in test mode`);
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

//Do we really need the unknown endpoint?
app.use(middleware.unknownEndpoint);
//Do we really need the error handler?
app.use(middleware.errorHandler);

module.exports = app;
