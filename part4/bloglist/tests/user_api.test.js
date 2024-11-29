const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const testHelper = require("./test_helper");
const testingData = require("./testing_data");
const User = require("../models/user");

const api = supertest(app);

describe("when there are initially users in the DB", () => {
  beforeEach(async () => {
    await testingData.setupTestDB(
      testingData.initialUsers,
      testingData.initialBlogs,
    );
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await testHelper.getAllUsersAsJSON();

    await api
      .post("/api/users")
      .send(testingData.newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await testHelper.getAllUsersAsJSON();

    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(testingData.newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await testHelper.getAllUsersAsJSON();

    const alreadyExistingUsername = usersAtStart[0].username;
    //Use the spread operator to get a copy of newUser, but with username modified
    const newUserWithRepeatUsername = {
      ...testingData.newUser,
      username: alreadyExistingUsername,
    };

    const result = await api
      .post("/api/users")
      .send(newUserWithRepeatUsername)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await testHelper.getAllUsersAsJSON();
    assert(result.body.error.includes("`username` to be unique")); //The capitalization is sometimes different in this mongo error?

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if username is too short", async () => {
    const usersAtStart = await testHelper.getAllUsersAsJSON();

    //Use the spread operator to get a copy of newUser, but with username modified
    const newUserWithShortUsername = { ...testingData.newUser, username: "me" };

    const result = await api
      .post("/api/users")
      .send(newUserWithShortUsername)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await testHelper.getAllUsersAsJSON();
    assert(
      result.body.error.includes("is shorter than the minimum allowed length"),
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if password is too short", async () => {
    const usersAtStart = await testHelper.getAllUsersAsJSON();

    //Use the spread operator to get a copy of newUser, but with password modified
    const newUserWithShortPassword = { ...testingData.newUser, password: "2" };

    const result = await api
      .post("/api/users")
      .send(newUserWithShortPassword)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await testHelper.getAllUsersAsJSON();
    assert(
      result.body.error.includes("password must be at least 3 characters"),
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
