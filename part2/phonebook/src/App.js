import { useEffect, useState } from 'react';
import axios from 'axios';
import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const hook = () => {
    axios.get('http://localhost:3001/persons').then((response) => {
      setPersons(response.data);
    });
  };

  useEffect(hook, []);

  const checkIfNameExists = persons.some((person) => person.name === newName);

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };

    if (checkIfNameExists) {
      setNewName('');
      setNewNumber('');
      return alert(`${newName} is already added to phonebook`);
    }

    setPersons(persons.concat(personObject));
    setNewName('');
    setNewNumber('');
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const personsToShow = filter
    ? persons.filter((person) => person.name.match(new RegExp(filter, 'gi')))
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilterChange={handleFilterChange} />
      <PersonForm
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newNumber={newNumber}
        newName={newName}
      />
      <Persons persons={personsToShow} />
    </div>
  );
};

export default App;
