const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/users');
const Blog = require('../models/blogs');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('secretpassword', 10);
  const user = new User({
    username: 'root',
    name: 'administrator',
    passwordHash,
  });

  await user.save();
});

describe('testing if the users get/post requests work', () => {
  test('creating a new user', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'filipe',
      name: 'Filipe Figueiredo',
      password: 'password',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  }, 10000);

  test('checking if the users can be viewed', async () => {
    const users = await helper.usersInDb();

    const result = await api.get('/api/users');
    expect(result.body).toEqual(users);
  });

  test('usernames must be unique', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'superuser',
      password: 'password',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username must be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('usernames must have at least 3 characters', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'ro',
      name: 'superuser',
      password: 'password',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'username must be at least 3 characters long'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('passwords must have at least 3 characters', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'rooooot',
      name: 'superuser',
      password: 'pa',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'password must be at least 3 characters long'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

describe('testing login/token functionalities', () => {
  test('test if an invalid login reports an error', async () => {
    const userToLogin = {
      username: 'root',
      password: 'wrongpassword ',
    };

    const result = await api
      .post('/api/login')
      .send(userToLogin)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('invalid username or password');
  });

  test('test if a token is set when the login is successful', async () => {
    const userToLogin = {
      username: 'root',
      password: 'secretpassword',
    };

    const result = await api
      .post('/api/login')
      .send(userToLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result.body.token).toBeDefined();
  }, 10000);

  test('test if an user can create a blog with a token', async () => {
    const userToLogin = {
      username: 'root',
      password: 'secretpassword',
    };

    const resultFromLogin = await api
      .post('/api/login')
      .send(userToLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const token = resultFromLogin.body.token;

    const userId = await helper.userIdFinder(resultFromLogin.body.username);

    const blogToPost = {
      url: 'http://thisisatest.com',
      author: 'Filipe',
      title: 'This is a test',
      likes: 0,
      user: userId,
    };

    const result = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(blogToPost)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    // delete the id from the newly created blog in order to check if the
    // result is equal to the blog we tried to post with the correct data
    // structure.
    delete result.body.id;
    expect(result.body).toEqual(blogToPost);
  });

  test("test if an user can't create a blog without a token", async () => {
    const blogToPost = {
      url: 'http://thisisatest.com',
      author: 'Filipe',
      title: 'This is a test',
    };

    const result = await api
      .post('/api/blogs')
      .send(blogToPost)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toBe('token missing or invalid');
  });

  test('test if an user can delete a blog with a token', async () => {
    const userToLogin = {
      username: 'root',
      password: 'secretpassword',
    };

    const resultFromLogin = await api
      .post('/api/login')
      .send(userToLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const token = resultFromLogin.body.token;

    const blogToPost = {
      url: 'http://thisisatest.com',
      author: 'Filipe',
      title: 'This is a test',
    };

    const resultFromBlogPost = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(blogToPost)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const idFromBlogToDelete = resultFromBlogPost.body.id;

    await api
      .delete(`/api/blogs/${idFromBlogToDelete}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);
  });

  test("test if an user can't delete a blog without a token", async () => {
    const userToLogin = {
      username: 'root',
      password: 'secretpassword',
    };

    const resultFromLogin = await api
      .post('/api/login')
      .send(userToLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const token = resultFromLogin.body.token;

    const blogToPost = {
      url: 'http://thisisatest.com',
      author: 'Filipe',
      title: 'This is a test',
    };

    const resultFromBlogPost = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(blogToPost)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const idFromBlogToDelete = resultFromBlogPost.body.id;

    const result = await api
      .delete(`/api/blogs/${idFromBlogToDelete}`)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toBe('token missing or invalid');
  });

  test("test if an user can't delete a blog with the wrong token", async () => {
    const userToLogin = {
      username: 'root',
      password: 'secretpassword',
    };

    const resultFromLogin = await api
      .post('/api/login')
      .send(userToLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const token = resultFromLogin.body.token;

    const blogToPost = {
      url: 'http://thisisatest.com',
      author: 'Filipe',
      title: 'This is a test',
    };

    const resultFromBlogPost = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(blogToPost)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const invalidUser = {
      username: 'testing',
      name: 'testing',
      password: 'testpassword',
    };

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const resultFromInvalidLogin = await api
      .post('/api/login')
      .send({ username: invalidUser.username, password: invalidUser.password })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const invalidToken = resultFromInvalidLogin.body.token;

    const idFromBlogToDelete = resultFromBlogPost.body.id;

    const result = await api
      .delete(`/api/blogs/${idFromBlogToDelete}`)
      .set('Authorization', `bearer ${invalidToken}`)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toBe("this user can't delete this blog");
  });

  test('check if blogs has the user id when saved', async () => {
    await Blog.deleteMany({});
    const users = await helper.usersInDb();
    const user = users[0];
    const blogsAtStart = await helper.blogsInDb();

    const userToLogin = {
      username: 'root',
      password: 'secretpassword',
    };

    const resultFromLogin = await api
      .post('/api/login')
      .send(userToLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const token = resultFromLogin.body.token;

    const userId = await helper.userIdFinder(resultFromLogin.body.username);

    const blogToPost = {
      url: 'http://thisisatest.com',
      author: 'Filipe',
      title: 'This is a test',
      likes: 0,
      user: userId,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(blogToPost)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const savedBlog = blogsAtEnd[0];

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);

    expect(savedBlog.user.toString()).toEqual(user.id);
  });

  test('check if the blog has information on the user', async () => {
    await Blog.deleteMany({});

    const userToLogin = {
      username: 'root',
      password: 'secretpassword',
    };

    const resultFromLogin = await api
      .post('/api/login')
      .send(userToLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const token = resultFromLogin.body.token;

    const userId = await helper.userIdFinder(resultFromLogin.body.username);

    const blogToPost = {
      url: 'http://thisisatest.com',
      author: 'Filipe',
      title: 'This is a test',
      likes: 0,
      user: userId,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(blogToPost)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogList = await api.get(`/api/blogs`);
    const blogToInspect = blogList.body[0];

    expect(blogToInspect.user.username).toEqual(resultFromLogin.body.username);
    expect(blogToInspect.user.name).toEqual(resultFromLogin.body.name);
    expect(blogToInspect.user.id).toEqual(userId);
  });

  test('check if the user page has information on the blog', async () => {
    await Blog.deleteMany({});

    const userToLogin = {
      username: 'root',
      password: 'secretpassword',
    };

    const resultFromLogin = await api
      .post('/api/login')
      .send(userToLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const token = resultFromLogin.body.token;

    const userId = await helper.userIdFinder(resultFromLogin.body.username);

    const blogToPost = {
      url: 'http://thisisatest.com',
      author: 'Filipe',
      title: 'This is a test',
      likes: 0,
      user: userId,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(blogToPost)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const userList = await api.get('/api/users');
    const userToInspect = userList.body[0];

    expect(userToInspect.blogs[0].title).toEqual(blogToPost.title);
    expect(userToInspect.blogs[0].author).toEqual(blogToPost.author);
    expect(userToInspect.blogs[0].url).toEqual(blogToPost.url);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
