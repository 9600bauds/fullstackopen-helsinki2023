const blogRouter = require('express').Router();
const Blog = require('../models/blogSchema');
const middleware = require('../utils/middleware');
const User = require('../models/user');

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
        .populate('author', { name: 1 });
    response.json(blogs);
});

blogRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
        return response.status(404).end();
    }
    response.json(blog);
});

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
    const user = request.user;

    const { title, url, likes } = request.body;
    const blog = new Blog({ title, author: user.id, url, likes });
    const result = await blog.save();
    //Update using the atomic operation $push, to prevent race conditions
    await User.updateOne({ _id: user.id }, { $push: { blogs: result._id } });
    response.status(201).json(result);
});

blogRouter.put('/:id', async (request, response) => {
    const body = request.body; //Needs sanitization

    const blogPojo = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogPojo, {
        new: true,
        runValidators: true,
        context: 'query',
    });

    if (!updatedBlog) {
        return response.status(404).end();
    }

    response.json(updatedBlog);
});

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const blogToDelete = await Blog.findById(request.params.id);
    if (!blogToDelete) {
    //Technically we failed, but the blog doesn't exist, so... mission accomplished?
        return response.status(204).end();
    }

    const user = request.user;
    if (user.id.toString() !== blogToDelete.author.toString()) {
        return response
            .status(403)
            .json({ error: 'you do not have permission to delete this blog' });
    }

    // Remove blog from the user's list of blogs
    user.blogs = user.blogs.filter(
        (blogId) => blogId.toString() !== request.params.id
    );
    await user.save();

    await Blog.findByIdAndRemove(request.params.id); //We don't care if this succeeds or not
    response.status(204).end();
});

module.exports = blogRouter;
