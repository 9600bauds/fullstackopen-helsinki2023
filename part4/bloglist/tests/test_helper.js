const Blog = require("../models/blog");
const User = require("../models/user");
const app = require("../app");
const supertest = require("supertest");
const testingData = require("./testing_data");
const api = supertest(app);

// Why do we want them as JSON, though?
const getAllBlogsAsJSON = async () => {
  const allBlogs = await Blog.find({});
  return allBlogs.map((blog) => blog.toJSON());
};

const getAllUsersAsJSON = async () => {
  const allUsers = await User.find({});
  return allUsers.map((user) => user.toJSON());
};

const getNonExistingID = async () => {
  let newBlogWithBadID = { ...testingData.newBlog }; //We clone this one, so we can mutate it. Note that this is JSON and not a Blog object
  delete newBlogWithBadID._id; //So it gets a new ID
  const blog = new Blog(newBlogWithBadID);
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const getValidUserToken = async (userData) => {
  if (!userData) {
    userData = testingData.initialUsers[0];
  }
  const response = await api
    .post("/api/login")
    .send({ username: userData.username, password: userData.password });

  return response.body.token;
};

module.exports = {
  getAllBlogsAsJSON,
  getAllUsersAsJSON,
  getNonExistingID,
  getValidUserToken,
};
