const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://admin:${password}@cluster0.j8nft.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Persons', personSchema);

const name = process.argv[3];
const number = process.argv[4];

if (name && number) {
  const person = new Person({
    name,
    number,
  });
  return person
    .save()
    .then(() => {
      console.log('person saved');
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
} else {
  Person.find({}).then((result) => {
    console.log('Your Phonebook contains:');
    result.forEach((person) => console.log(person.name, person.number));
    return mongoose.connection.close();
  });
}
