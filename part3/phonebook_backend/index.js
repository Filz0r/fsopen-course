require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Persons = require('./models/persons');

const logger = morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
    JSON.stringify(req.body),
  ].join(' ');
});
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('build'));
app.use(logger);

app.get('/info', async (request, response) => {
  const phonebookLength = await Persons.find({}).then((result) => {
    return result.length;
  });
  const info = {
    message: `Phonebook has info for ${phonebookLength} people`,
    time: new Date(),
  };
  response.send(`<div>${info.message}<br>${info.time}</div>`);
});

app.get('/api/persons', (request, response) => {
  Persons.find({}).then((result) => {
    response.json(result);
  });
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: 'a name must be provided',
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: 'a number must be provided',
    });
  }
  const person = new Persons({
    name: body.name,
    number: body.number,
  });
  person.save().then((result) => response.json(result));
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Persons.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((person) => response.json(person))
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (request, response) => {
  Persons.findById(request.params.id).then((result) => {
    response.json(result);
  });
});

app.delete('/api/persons/:id', (request, response, next) => {
  Persons.findByIdAndRemove(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unkown route' });
};
const errorHandler = (error, request, response, next) => {
  console.error(error);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformated id' });
  }

  next(error);
};
app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
