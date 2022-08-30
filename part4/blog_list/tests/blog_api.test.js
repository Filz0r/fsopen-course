const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blogs');

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
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  }, 10000);

  test('can add an blog to the db', async () => {
    const blogToInsert = {
      author: 'SomeAuthor',
      title: 'Some Tittle',
      url: 'https://example.com/this-is-a-sample-url',
      likes: 0,
    };

    await api
      .post('/api/blogs')
      .send(blogToInsert)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  });

  test('checking if a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const blogsAfterDeleted = blogsAtEnd.map((blog) => blog.title);
    expect(blogsAfterDeleted).not.toContain(blogToDelete.title);
  });

  test('checking if a blog can be updated', async () => {
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
    const blogToInsert = {
      author: 'SomeAuthor',
      title: 'Some Tittle',
      url: 'https://example.com/this-is-a-sample-url',
    };

    const response = await api
      .post('/api/blogs')
      .send(blogToInsert)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.likes).toBe(0);
  });

  test("data can't be pushed without an title", async () => {
    const blogToInsertWithoutTitle = {
      author: 'SomeAuthor',
      url: 'https://example.com/this-is-a-sample-url',
    };

    await api.post('/api/blogs').send(blogToInsertWithoutTitle).expect(400);
  });

  test("data can't be pushed without an url", async () => {
    const blogToInsertWithoutUrl = {
      author: 'SomeAuthor',
      title: 'SomeTitle',
    };

    await api.post('/api/blogs').send(blogToInsertWithoutUrl).expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
