const Blog = require('../models/blogSchema');
const User = require('../models/user');
const app = require('../app');
const supertest = require('supertest');
const api = supertest(app);

const initialUsers = [
    {
        username: 'rickman11',
        name: 'Ricky Steve',
        password: 'hunter123',
    },
    {
        username: 'karl01',
        name: 'Orange Head',
        password: 'doineed1',
    },
];

const initialBlogs = [
    {
        title: 'This Horse Knows Karate?!',
        url: 'www.karatehorse.com',
        likes: 91,
    },
    {
        title: 'Deadly Karate Donkey',
        url: 'www.karatedonk.com',
        likes: 117,
    },
    {
        title: 'Awesome Hoof Kick',
        url: 'www.topkicks.com/horse.html',
        likes: 41,
    },
    {
        title: 'EXTREME FAST DUCK VERY HIGH SPEED',
        url: 'www.plebbit.com/r/duckfast',
        likes: 11,
    },
    {
        title: 'VERY WIDE DUCKS',
        url: 'www.plebbit.com/r/ducklong',
        likes: 18,
    },
    {
        title: 'pen',
        url: 'https://www.google.com/search?q=pen',
        likes: 0,
    },
];

const nonExistingId = async () => {
    const blog = new Blog({
        title: 'This blog does not exist.',
        url: 'https://www.google.com/search?q=bed',
    });
    await blog.save();
    await blog.deleteOne();

    return blog._id.toString();
};

const getValidToken = async (index) => {
    if (!index) index = 0;
    const testUser = initialUsers[index];
    const response = await api
        .post('/api/login')
        .send({ username: testUser.username, password: testUser.password })
        .expect(200)
        .expect('Content-Type', /application\/json/);

    return response.body.token;
};

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
    const users = await User.find({});
    return users.map((u) => u.toJSON());
};

module.exports = {
    initialBlogs,
    initialUsers,
    blogsInDb,
    usersInDb,
    getValidToken,
    nonExistingId,
};
