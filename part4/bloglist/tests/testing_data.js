const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

const newBlog = {
  title: "Beryllium is weird",
  author: "liquidman",
  url: "https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12",
  likes: 1,
  __v: 0,
};

const initialUsers = [
  {
    username: "carplover2",
    name: "Urist",
    password: "hunter123",
  },
  {
    username: "madkap",
    name: "Jeremy",
    password: "eightmilliondollars",
  },
];

const newUser = {
  username: "mluukkai",
  name: "Matti Luukkainen",
  password: "salainen",
};

// Creates a new user in the database from user data.
// This function mainly exists because we need to hash the password.
const createTestUser = async (userData) => {
  const saltRounds = 10; // Todo: Standardize this somewhere (if tests fail, check that this matches const saltRounds in the user controller)
  const passwordHash = await bcrypt.hash(userData.password, saltRounds);
  const user = new User({
    username: userData.username,
    name: userData.name,
    passwordHash,
  });
  const savedUser = await user.save();

  return savedUser;
};
// Creates a new blog in the database and updates the user's blogs array
const createTestBlog = async (blogData, user) => {
  const blog = new Blog({
    ...blogData,
    user: user._id,
  });
  const savedBlog = await blog.save();

  // Use the atomic $push operation
  await User.findByIdAndUpdate(
    user._id,
    { $push: { blogs: savedBlog._id } },
    { new: true },
  );

  return savedBlog;
};

const setupTestDB = async (initialUsers, initialBlogs) => {
  // Wipe everything
  await User.deleteMany({});
  await Blog.deleteMany({});

  // Create all the users first
  const createdUsers = await Promise.all(
    initialUsers.map(async (userData) => createTestUser(userData)),
  );

  // Create all the blogs after. Note that for simplicity's sake, ALL the blogs are submitted by the FIRST user! (our good ol' Urist)
  const firstUser = createdUsers[0];
  const createdBlogs = await Promise.all(
    initialBlogs.map(async (blogData) => createTestBlog(blogData, firstUser)),
  );
};

module.exports = {
  initialBlogs,
  newBlog,
  initialUsers,
  newUser,
  createTestUser,
  createTestBlog,
  setupTestDB,
};
