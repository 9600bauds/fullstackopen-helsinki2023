const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const requestedId = request.params.id;
  const blog = await Blog.findById(requestedId).populate("user", {
    username: 1,
    name: 1,
  });
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const blogObject = {
    _id: body._id,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: request.user.id,
  };
  const blog = new Blog(blogObject);

  const savedBlog = await blog
    .save()
    .then((savedDoc) => savedDoc.populate("user", { username: 1, name: 1 })); //Theoretically this prevents needing a second DB call?

  //Update using the atomic operation $push, to prevent race conditions
  await User.updateOne(
    { _id: request.user.id },
    { $push: { blogs: savedBlog._id } },
  );

  response.status(201).json(savedBlog);
});

blogsRouter.post("/:id/comments", async (request, response) => {
  //You do not need authorization to comment on a blog, and it has no rate limiting, or sanitization beyond schema, etc...

  const requestedId = request.params.id;
  const comment = request.body.comment;
  if (!comment) {
    return response.status(400).json({
      error: "comment must be sent as a string inside the 'comment' field",
    });
  }

  const updatedBlog = await Blog.findOneAndUpdate(
    { _id: requestedId },
    { $push: { comments: comment } }, //Update using the atomic operation $push, to prevent race conditions
    { new: true, runValidators: true }, // runValidators to apply schema validation on the new comments
  ).populate("user", { username: 1, name: 1 });

  if (updatedBlog) {
    response.status(201).json(updatedBlog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const requestedId = request.params.id;
    const blog = await Blog.findById(requestedId);

    if (!blog) {
      return response.status(204).end(); //Nothing to delete... mission accomplished?
    }

    if (blog.user.toString() !== request.user.id.toString()) {
      //console.log("expected", blog.user.toString(), "got", request.user.toString())
      return response.status(403).json({ error: "not authorized" });
    }

    await blog.deleteOne(); //so we don't have to Find it again
    response.status(204).end();
  },
);

blogsRouter.put("/:id", async (request, response) => {
  //I guess as of right now you don't need authorization to edit a blog?
  const requestedId = request.params.id;
  const body = request.body;

  //We only need to define the fields that we want to update
  const newFields = {
    likes: body.likes,
    title: body.title,
    url: body.url,
  };

  // "new" param is just so we can return the modified object: https://fullstackopen.com/en/part3/saving_data_to_mongo_db#other-operations
  const updatedBlog = await Blog.findByIdAndUpdate(requestedId, newFields, {
    new: true,
  }).populate("user", { username: 1, name: 1 });

  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(404).end();
  }
});

module.exports = blogsRouter;
