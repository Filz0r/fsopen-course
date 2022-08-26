const blogsRouter = require('express').Router();
const Blog = require('../models/blogs');

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blog) => response.json(blog));
});

blogsRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

module.exports = blogsRouter;
