const mongoose = require('mongoose');const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blogSchema');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  helper.initialBlogs.forEach(async (blogData) => {
    let blogObject = new Blog(blogData);
    await blogObject.save();
  });
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs');

  const titles = response.body.map((r) => r.title);
  expect(titles).toContain('This Horse Knows Karate?!');
});

afterAll(async () => {
  await mongoose.connection.close();
});
