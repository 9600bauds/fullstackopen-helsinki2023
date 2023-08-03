const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blogSchema');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    //Might need to use a non-parallel function here if the order of the objects is important

    await Promise.all(
        helper.initialUsers.map((user) =>
            api.post('/api/users').send(user).expect(201)
        )
    );

    const validToken = await helper.getValidToken(); //For testing, we assume that the first example user will have made all the blogs.

    await Promise.all(
        helper.initialBlogs.map((blog) =>
            api
                .post('/api/blogs')
                .send(blog)
                .set('Authorization', `Bearer ${validToken}`)
                .expect(201)
        )
    );
});

describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
        const blogs = await helper.blogsInDb();

        const blog = blogs[0];

        const response = await api
            .get(`/api/blogs/${blog.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(response.body).toEqual(blog);
    });

    test('fails with statuscode 404 if note does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId();

        await api.get(`/api/notes/${validNonexistingId}`).expect(404);
    });
});

describe('when there are blogs initially saved', () => {
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

    test('unique identifier is named "id"', async () => {
        const blogs = await helper.blogsInDb();
        for (let blog of blogs) {
            expect(blog.id).toBeDefined();
        }
    });
});

describe('when adding blogs', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'I Was A Wizard The Whole Time',
            url: 'www.youplume.com/r/watch?=thing',
            likes: 72,
        };

        const validToken = await helper.getValidToken();

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${validToken}`)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const blogs = await helper.blogsInDb();
        expect(blogs).toHaveLength(helper.initialBlogs.length + 1);

        const titles = blogs.map((r) => r.title);
        expect(titles).toContain('I Was A Wizard The Whole Time');
    });

    test('blog without title cannot be added', async () => {
        const newBlog = {
            url: 'www.youplume.com/r/watch?=thing',
            likes: 72,
        };

        const validToken = await helper.getValidToken();

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${validToken}`)
            .expect(400);

        const blogs = await helper.blogsInDb();
        expect(blogs).toHaveLength(helper.initialBlogs.length);
    });

    test('blog without url cannot be added', async () => {
        const newBlog = {
            title: 'I Was A Wizard The Whole Time',
            likes: 72,
        };

        const validToken = await helper.getValidToken();

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${validToken}`)
            .expect(400);

        const blogs = await helper.blogsInDb();
        expect(blogs).toHaveLength(helper.initialBlogs.length);
    });

    test('blog without likes becomes blog with 0 likes', async () => {
        const newBlog = {
            title: 'I Was A Wizard The Whole Time',
            url: 'www.youplume.com/r/watch?=thing',
        };

        const validToken = await helper.getValidToken();

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${validToken}`)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const blogs = await helper.blogsInDb();
        expect(blogs).toHaveLength(helper.initialBlogs.length + 1);

        const blog = blogs.find((r) => r.title === 'I Was A Wizard The Whole Time');
        expect(blog.likes).toBe(0);
    });
});

describe('deleting a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blog = blogsAtStart[0];

        const validToken = await helper.getValidToken();

        await api
            .delete(`/api/blogs/${blog.id}`)
            .set('Authorization', `Bearer ${validToken}`)
            .expect(204);

        const blogsAtEnd = await helper.blogsInDb();

        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

        const found = blogsAtEnd.find((r) => r.title === blog.title);
        expect(!found);
    });
});

describe('updating an existing blog', () => {
    test('succeeds with status code 200 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb();
        let blogToUpdate = blogsAtStart[0];
        blogToUpdate.title += ' - edited!';
        blogToUpdate.likes++;

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(200);

        const blogsAtEnd = await helper.blogsInDb();

        expect(blogsAtEnd).toHaveLength(blogsAtStart.length);

        const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);

        expect(updatedBlog.title).toEqual(blogToUpdate.title);
        expect(updatedBlog.likes).toEqual(blogToUpdate.likes);
    });

    test('fails with status code 404 if id does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId();

        const validToken = await helper.getValidToken();

        const editedBlog = {
            title: 'I dont even real',
            url: 'www.youplume.com/r/watch?=no',
            likes: '555',
        };
        await api
            .put(`/api/blogs/${validNonexistingId}`)
            .send(editedBlog)
            .set('Authorization', `Bearer ${validToken}`)
            .expect(404);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
