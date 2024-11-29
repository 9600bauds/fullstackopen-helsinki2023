const testingRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const testingData = require("../tests/testing_data");

testingRouter.post("/reset", async (request, response) => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  response.status(204).end();
});

// Endpoint used to reset the testing database to an initial testing state, with a few blogs and users already saved
testingRouter.post("/seed", async (request, response) => {
  await testingData.setupTestDB(
    testingData.initialUsers,
    testingData.initialBlogs,
  );

  response.status(204).end();
});

module.exports = testingRouter;
