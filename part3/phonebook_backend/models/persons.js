const mongoose = require('mongoose');

const url = process.env.MONGO_URI;
mongoose
  .connect(url)
  .then((result) => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => console.log('error: ', error.message));

const numberValidator = [
  {
    // validate length of number
    validator: (number) => {
      if (number.length < 9) {
        return false;
      }
      return true;
    },
    message: 'number must have at least 8 numbers',
  },
  {
    //validate if number has '-' as third or fourth parameter
    validator: (number) => {
      if (number[2] === '-' || number[3] === '-') {
        return true;
      }
      return false;
    },
    message: "number must have an  '-' as the third our fourth parameter",
  },
  {
    // validate if there are only numbers on the number input
    validator: (number) => {
      return /^\d{2,3}-\d+$/.test(number);
    },
    message: 'number must only contain numbers or one "-"',
  },
];

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: numberValidator,
    required: true,
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Persons', personSchema);
