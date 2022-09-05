const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blogs');
const User = require('../models/users');
const { SECRET } = require('../utils/config');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
  });

  if (blog) {
    response.json(blog.toJSON());
  } else {
    response.status(404).end();
  }
});

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  const { url, title, author, likes } = request.body;
  const user = request.user;
  const token = request.token;

  try {
    const decodedToken = jwt.verify(token, SECRET);

    if (!(token && decodedToken.id)) {
      next();
    }

    const blog = new Blog({
      url,
      title,
      author,
      likes,
      user: user.id,
    });

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);

    await user.save();

    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const user = request.user;
  const token = request.token;

  try {
    const decodedToken = jwt.verify(token, SECRET);

    if (!(token && decodedToken.id)) {
      next();
    }

    const { user: blogUser } = await Blog.findById(request.params.id);

    // not sure why this happens but I have to convert the user entry
    // to a string in here instead of the model file.
    // Both the toJSON and toObject methods were tried, but if
    // blog.user is destructured it always returns as an Object
    // instead of a String
    if (blogUser.toString() !== user.id) {
      return response
        .status(401)
        .send({ error: "this user can't delete this blog" });
    }
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
