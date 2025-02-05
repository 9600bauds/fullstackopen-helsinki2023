const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (password.length < 3) {
    return response
      .status(400)
      .send({ error: "password must be at least 3 characters" });
  }
  const saltRounds = 10; // Todo: Standardize this somewhere (as an .env variable? I don't know what's considered best practice)
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    url: 1,
    likes: 1,
    author: 1,
  });
  response.json(users);
});

usersRouter.get("/:username", async (request, response) => {
  const requestedUsername = request.params.username;
  const user = await User.findOne({ username: requestedUsername }).populate(
    "blogs",
    {
      title: 1,
      url: 1,
      likes: 1,
      author: 1,
    },
  );
  if (user) {
    response.json(user);
  } else {
    response.status(404).end();
  }
});

module.exports = usersRouter;
