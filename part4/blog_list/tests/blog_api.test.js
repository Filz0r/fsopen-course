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

test('blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
}, 10000);

test('database contains all the blogs from helper function', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogs.length);
}, 10000);

test('check if the blog objects contain a field called id', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body[0].id).toBeDefined();
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
