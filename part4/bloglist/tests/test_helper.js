const Blog = require("../models/blog")
const User = require("../models/user")
const app = require('../app');
const supertest = require('supertest');
const api = supertest(app);

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

const newBlog = {
  title: "Beryllium is weird",
  author: "liquidman",
  url: "https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12",
  likes: 1,
  __v: 0
}

const initialUsers = [
  {
    username: 'carplover2',
    name: 'Urist',
    password: 'hunter123',
  },
  {
    username: 'madkap',
    name: 'Jeremy',
    password: 'eightmilliondollars',
  }
]

const newUser = {
  username: 'mluukkai',
  name: 'Matti Luukkainen',
  password: 'salainen',
}

// Why do we want them as JSON, though?
const getAllBlogsAsJSON = async () => {
  const allBlogs = await Blog.find({})
  return allBlogs.map(blog => blog.toJSON())
}

const getAllUsersAsJSON = async () => {
  const allUsers = await User.find({})
  return allUsers.map(user => user.toJSON())
}

const getNonExistingID = async () => {
  let newBlogWithBadID = { ...newBlog } //We clone this one, so we can mutate it. Note that this is JSON and not a Blog object
  delete newBlogWithBadID._id; //So it gets a new ID
  const blog = new Blog(newBlogWithBadID)
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const getValidUserToken = async (userData) => {
  if (!userData) {
    userData = initialUsers[0];
  }
  const response = await api
    .post('/api/login')
    .send({ username: userData.username, password: userData.password })

  return response.body.token;
};

module.exports = {
  initialBlogs,
  newBlog,
  initialUsers,
  newUser,
  getAllBlogsAsJSON,
  getAllUsersAsJSON,
  getNonExistingID,
  getValidUserToken
}