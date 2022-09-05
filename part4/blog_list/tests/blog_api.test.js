const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blogs');
const User = require('../models/users');
const bcrypt = require('bcrypt');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  await Blog.insertMany(helper.initialBlogs);
});

describe('checking if the database is well structured', () => {
  test('check if the blog objects contain a field called id', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0].id).toBeDefined();
  }, 10000);

  test('database contains all the blogs from helper function', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  }, 10000);
});

describe('checking if the API can comunicante with the db properly', () => {
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
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  }, 10000);

  test('can add an blog to the db', async () => {
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
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  });

  test('checking if a blog can be deleted', async () => {
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

    const blogsAfterNewBlog = await helper.blogsInDb();
    expect(blogsAfterNewBlog).toHaveLength(blogsAtStart.length + 1);

    const idFromBlogToDelete = resultFromBlogPost.body.id;

    await api
      .delete(`/api/blogs/${idFromBlogToDelete}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAfterNewBlog.length - 1);

    const blogsAfterDeleted = blogsAtEnd.map((blog) => blog.title);
    expect(blogsAfterDeleted).not.toContain(blogToPost.title);
  });

  test('checking if a blog can be updated (DOES NOT CHECK FOR USER)', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = { ...blogToUpdate };
    updatedBlog.likes += 1;

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const updatedBlogs = await helper.blogsInDb();
    const blogAfterUpdate = updatedBlogs[0];
    expect(blogAfterUpdate.likes).toBe(blogToUpdate.likes + 1);
  });
});

describe('validating data before adding it to the database', () => {
  test('check if the likes property defaults to 0 when missing', async () => {
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
      user: userId,
    };

    const result = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(blogToPost)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(result.body.likes).toBe(0);
  });

  test("data can't be pushed without an title", async () => {
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

    const blogToInsertWithoutTitle = {
      author: 'SomeAuthor',
      url: 'https://example.com/this-is-a-sample-url',
      user: userId,
    };

    const result = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(blogToInsertWithoutTitle)
      .expect(400);

    expect(result.body.error).toBe(
      'Blog validation failed: title: Path `title` is required.'
    );
  }, 10000);

  test("data can't be pushed without an url", async () => {
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

    const blogToInsertWithoutUrl = {
      author: 'SomeAuthor',
      title: 'This is a title',
      user: userId,
    };

    const result = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(blogToInsertWithoutUrl)
      .expect(400);

    expect(result.body.error).toBe(
      'Blog validation failed: url: Path `url` is required.'
    );
  });
});

afterAll(() => {
  mongoose.connection.close();
});
