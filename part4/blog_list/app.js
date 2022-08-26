//const blogListsRouter =
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const logger = require('./utils/logger');
const { MONGO_URI } = require('./utils/config');
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require('./utils/middleware');
const blogsRouter = require('./controllers/blogList');

const app = express();

logger.info('connecting to MongoDB');

mongoose
  .connect(MONGO_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => logger.error('error connecting to DB', error.message));

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/blogs', blogsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
