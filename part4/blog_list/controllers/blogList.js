const blogsRouter = require('express').Router();
const Blog = require('../models/blogs');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body);

  try {
    const savedBlog = await blog.save();

    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body;

  const blog = {
    author: body.author,
    url: body.url,
    likes: body.likes,
    title: body.title,
  };

  try {
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
    response.status(200).json(blog);
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
