const mongoose = require('mongoose');const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blogSchema');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  //Might need to use a non-parallel function here if the order of the blogs is important
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
  const blogs = await helper.blogsInDb();

  expect(blogs).toHaveLength(helper.initialBlogs.length);
});

test('a specific blog is within the returned blogs', async () => {
  const blogs = await helper.blogsInDb();

  const titles = blogs.map((r) => r.title);
  expect(titles).toContain('This Horse Knows Karate?!');
});

test('a valid blog can be added', async () => {
  const newBlog = {
    _id: '64a711a238976db70dedbeef',
    title: 'I Was A Wizard The Whole Time',
    author: 'imadb',
    url: 'www.youplume.com/r/watch?=thing',
    likes: 72,
    __v: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogs = await helper.blogsInDb();
  expect(blogs).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogs.map((r) => r.title);
  expect(titles).toContain('I Was A Wizard The Whole Time');
});

test('blog without url cannot be added', async () => {
  const newBlog = {
    _id: '64a711a238976db70dedbeef',
    title: 'I Was A Wizard The Whole Time',
    author: 'imadb',
    likes: 72,
    __v: 0,
  };

  await api.post('/api/blogs').send(newBlog).expect(400);

  const blogs = await helper.blogsInDb();
  expect(blogs).toHaveLength(helper.initialBlogs.length);
});

afterAll(async () => {
  await mongoose.connection.close();
});
