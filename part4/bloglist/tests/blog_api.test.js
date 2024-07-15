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
})

after(async () => {
  await mongoose.connection.close()
})