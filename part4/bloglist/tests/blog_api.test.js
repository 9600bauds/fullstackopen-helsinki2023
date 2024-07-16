const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const testHelper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)



describe('with multiple test blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = testHelper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })


  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returned blogs have an id property', async () => {
    const response = await api.get('/api/blogs')
    const blogsReturned = response.body;
    for (const blog of blogsReturned) {
      assert(blog.id)
    }
  })

  describe('saving a new blog', () => {
    test('succeeds with code 201', async () => {
      await api
        .post('/api/blogs')
        .send(testHelper.newBlog)
        .expect(201)
    })

    test('saves the content correctly', async () => {
      const sentBlog = testHelper.newBlog
      const response = await api
        .post('/api/blogs')
        .send(sentBlog)
      const savedBlog = response.body
      assert.strictEqual(sentBlog.title, savedBlog.title)
      assert.strictEqual(sentBlog.author, savedBlog.author)
      assert.strictEqual(sentBlog.url, savedBlog.url)
      assert.strictEqual(sentBlog.likes, savedBlog.likes)
    })

    test('lengthens the amount of saved blogs by 1', async () => {
      const blogsAtFirst = await testHelper.getAllBlogsAsJSON();
      await api
        .post('/api/blogs')
        .send(testHelper.newBlog)
      const blogsNow = await testHelper.getAllBlogsAsJSON();
      assert.strictEqual(blogsNow.length, blogsAtFirst.length + 1)
    })
  })
})

describe('with no blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
  })
})
after(async () => {
  await mongoose.connection.close()
})