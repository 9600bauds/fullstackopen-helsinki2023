const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const requestedId = request.params.id;
  const blog = await Blog.findById(requestedId)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const result = await blog.save();
  response.status(201).json(result);
})

blogsRouter.delete('/:id', async (request, response) => {
  const requestedId = request.params.id;
  await Blog.findByIdAndDelete(requestedId)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const requestedId = request.params.id;
  const body = request.body

  //We only need to define the fields that we want to update
  const newFields = {
    likes: body.likes,
    title: body.title,
    url: body.url,
  }

  // "new" param is just so we can return the modified object: https://fullstackopen.com/en/part3/saving_data_to_mongo_db#other-operations
  const updatedBlog = await Blog.findByIdAndUpdate(requestedId, newFields, { new: true })


  if (updatedBlog) {
    response.json(updatedBlog)
  }
  else {
    response.status(404).end()
  }
})

module.exports = blogsRouter