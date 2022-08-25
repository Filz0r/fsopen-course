require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Persons = require('./models/persons');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('build'));

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
app.use(logger);

app.use(express.json());

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

app.get('/api/persons/:id', (request, response) => {
  Persons.findById(request.params.id).then((result) => {
    response.json(result);
  });
});

app.delete('/api/persons/:id', (request, response) => {
  Persons.findByIdAndRemove(request.params.id, (error, docs) => {
    if (error) {
      console.log(error);
      return response.status(400).end();
    } else {
      console.log('Deleted: ', docs);
      return response.status(204).end();
    }
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
