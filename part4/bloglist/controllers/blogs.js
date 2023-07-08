const blogRouter = require('express').Router();
const Blog = require('../models/blogSchema');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).end();
  }
  response.json(blog);
});

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);
  const result = await blog.save();
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

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blogPojo,
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  );

  if (!updatedBlog) {
    return response.status(404).end();
  }

  response.json(updatedBlog);
});

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id); //We don't care if this succeeds or not
  response.status(204).end();
});

module.exports = blogRouter;
