const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const testHelper = require('./test_helper')
const testingData = require('./testing_data')
const Blog = require('../models/blog')

const api = supertest(app)



describe('with multiple test blogs saved', () => {
  beforeEach(async () => {
    await testingData.setupTestDB(testingData.initialUsers, testingData.initialBlogs)
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
    assert.strictEqual(blogsReturned.length, testingData.initialBlogs.length)
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

    test('fails with statuscode 400 if id is invalid', async () => {
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

  describe('deleting a specific blog', () => {
    test('succeeds with code 204 with a valid ID', async () => {
      const validToken = await testHelper.getValidUserToken();
      const blogsAtFirst = await testHelper.getAllBlogsAsJSON()
      const blogID = blogsAtFirst[0].id;
      await api
        .delete(`/api/blogs/${blogID}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(204)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
      const validToken = await testHelper.getValidUserToken();
      const invalidId = 'youcantellthisisinvalidbecauseofthelength'

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(400)
    })

    test('returns 204 if the ID is valid but nonexistent', async () => {
      const validToken = await testHelper.getValidUserToken();
      const validNonexistingId = await testHelper.getNonExistingID()

      await api
        .delete(`/api/blogs/${validNonexistingId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(204)
    })

    test('returns 403 if the user didn\'t create this blog', async () => {
      //We assume all blogs were created by the example user
      const validTokenForSomeoneElse = await testHelper.getValidUserToken(testingData.initialUsers[1]);
      const blogsAtFirst = await testHelper.getAllBlogsAsJSON()
      const blogID = blogsAtFirst[0].id;

      await api
        .delete(`/api/blogs/${blogID}`)
        .set('Authorization', `Bearer ${validTokenForSomeoneElse}`)
        .expect(403)
    })
  })

  describe('modifying a specific blog', () => {
    test('succeeds when modifying likes', async () => {
      const blogsAtFirst = await testHelper.getAllBlogsAsJSON()
      const blogID = blogsAtFirst[0].id;
      const newAttributes = { likes: 999 }

      const response = await api
        .put(`/api/blogs/${blogID}`)
        .send(newAttributes)
        .expect(200) //I guess it returns 200?
      const updatedBlog = response.body;
      assert.deepEqual(updatedBlog.likes, 999)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
      const invalidId = 'youcantellthisisinvalidbecauseofthelength'
      const newAttributes = { likes: 999 }

      await api
        .put(`/api/blogs/${invalidId}`)
        .send(newAttributes)
        .expect(400)
    })

    test('returns 404 if the ID is valid but nonexistent', async () => {
      const validNonexistingId = await testHelper.getNonExistingID()
      const newAttributes = { likes: 999 }

      await api
        .put(`/api/blogs/${validNonexistingId}`)
        .send(newAttributes)
        .expect(404)
    })
  })

  describe('saving a new blog', () => {
    test('succeeds with code 201', async () => {
      const validToken = await testHelper.getValidUserToken();
      await api
        .post('/api/blogs')
        .send(testingData.newBlog)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(201)
    })

    test('saves the content correctly', async () => {
      const validToken = await testHelper.getValidUserToken();
      const sentBlog = testingData.newBlog
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validToken}`)
        .send(sentBlog)
      const savedBlog = response.body
      assert.strictEqual(sentBlog.title, savedBlog.title)
      assert.strictEqual(sentBlog.author, savedBlog.author)
      assert.strictEqual(sentBlog.url, savedBlog.url)
      assert.strictEqual(sentBlog.likes, savedBlog.likes)
    })

    test('lengthens the amount of saved blogs by 1', async () => {
      const validToken = await testHelper.getValidUserToken();
      const blogsAtFirst = await testHelper.getAllBlogsAsJSON();
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validToken}`)
        .send(testingData.newBlog)
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
      const validToken = await testHelper.getValidUserToken();
      let newBlogWithoutLikes = { ...testingData.newBlog } //We clone this one, so we can mutate it
      delete newBlogWithoutLikes.likes;
      const response = await api
        .post('/api/blogs')
        .send(newBlogWithoutLikes)
        .set('Authorization', `Bearer ${validToken}`)
      const savedBlog = response.body
      assert.strictEqual(savedBlog.likes, 0)
    })

    test('a blog with no URL returns 400 bad request', async () => {
      const validToken = await testHelper.getValidUserToken();
      let newBlogWithoutURL = { ...testingData.newBlog } //We clone this one, so we can mutate it
      delete newBlogWithoutURL.url;
      await api
        .post('/api/blogs')
        .send(newBlogWithoutURL)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(400)
    })

    test('a blog with no title returns 400 bad request', async () => {
      const validToken = await testHelper.getValidUserToken();
      let newBlogWithoutTitle = { ...testingData.newBlog } //We clone this one, so we can mutate it
      delete newBlogWithoutTitle.title;
      await api
        .post('/api/blogs')
        .send(newBlogWithoutTitle)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(400)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})