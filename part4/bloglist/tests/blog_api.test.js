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

  test('all the testing blogs are saved successfully', async () => {
    const response = await api.get('/api/blogs')
    const blogsReturned = response.body;
    assert.strictEqual(blogsReturned.length, testHelper.initialBlogs.length)
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid ID', async () => {
      const blogsAtFirst = await testHelper.getAllBlogsAsJSON()
      const blogID = blogsAtFirst[0].id;
      await api
        .get(`/api/blogs/${blogID}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = 'youcantellthisisinvalidbecauseofthelength'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })

    test('returns 404 if the ID is valid but nonexistent', async () => {
      const validNonexistingId = await testHelper.getNonExistingID()

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })

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
      // I guess we just don't even save the return of this ^
      const blogsNow = await testHelper.getAllBlogsAsJSON();
      assert.strictEqual(blogsNow.length, blogsAtFirst.length + 1)
    })
  })
})

describe('with no blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
  })
  describe('saving a blog with missing fields', () => {
    test('a blog with undefined likes becomes a blog with 0 likes', async () => {
      let newBlogWithoutLikes = { ...testHelper.newBlog } //We clone this one, so we can mutate it
      delete newBlogWithoutLikes.likes;
      const response = await api
        .post('/api/blogs')
        .send(newBlogWithoutLikes)
      const savedBlog = response.body
      assert.strictEqual(savedBlog.likes, 0)
    })

    test('a blog with no URL returns 400 bad request', async () => {
      let newBlogWithoutURL = { ...testHelper.newBlog } //We clone this one, so we can mutate it
      delete newBlogWithoutURL.url;
      await api
        .post('/api/blogs')
        .send(newBlogWithoutURL)
        .expect(400)
    })

    test('a blog with no title returns 400 bad request', async () => {
      let newBlogWithoutTitle = { ...testHelper.newBlog } //We clone this one, so we can mutate it
      delete newBlogWithoutTitle.title;
      await api
        .post('/api/blogs')
        .send(newBlogWithoutTitle)
        .expect(400)
    })
  })
})
after(async () => {
  await mongoose.connection.close()
})