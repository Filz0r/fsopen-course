import { useEffect, useState } from 'react';
import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import phonebookService from './services/phonebook';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState(null);

  const hook = () => {
    phonebookService
      .getAllPersons()
      .then((personsList) => {
        setPersons(personsList);
      })
      .catch((error) => console.log(error));
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
      const [personToUpdate] = persons.filter(
        (person) => person.name === newName
      );
      const updatedPerson = { ...personToUpdate, number: newNumber };

      if (
        window.confirm(
          `${newName} is already added to phonebook, do you wish to update the number?`
        )
      ) {
        phonebookService
          .updatePerson(updatedPerson.id, updatedPerson)
          .then((personReturned) => {
            console.log(`${updatedPerson.name} was updated`);
            setPersons(
              persons.map((personObj) =>
                personObj.id !== updatedPerson.id ? personObj : personReturned
              )
            );
            setNewName('');
            setNewNumber('');
            setMessage(`Updated the number from ${personReturned.name}`);
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          })
          .catch((error) => {
            console.log(error);
            setPersons(
              persons.map((personObj) =>
                personObj.id !== updatedPerson.id ? personObj : updatedPerson
              )
            );
            setNewName('');
            setNewNumber('');
            setMessage(
              `ERROR: ${updatedPerson.name} has already been deleted from the server`
            );
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          });
      } else {
        setNewName('');
        setNewNumber('');
      }
    } else {
      phonebookService.createPerson(personObject).then((newPerson) => {
        setPersons(persons.concat(newPerson));
        setNewName('');
        setNewNumber('');
        setMessage(`Added ${newPerson.name}`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      });
    }
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

  const handleDeletePerson = (id) => {
    const filterPersons = personsToShow.filter((person) => person.id === id);
    const { name, id: personID } = filterPersons[0];

    if (window.confirm(`Delete ${name} from the phonebook?`)) {
      phonebookService.deletePerson(personID);
      setPersons(personsToShow.filter((person) => person.id !== personID));
    }
  };

  const personsToShow = filter
    ? persons.filter((person) => person.name.match(new RegExp(filter, 'gi')))
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter handleFilterChange={handleFilterChange} />
      <PersonForm
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newNumber={newNumber}
        newName={newName}
      />
      <Persons
        persons={personsToShow}
        handleDeletePerson={handleDeletePerson}
      />
    </div>
  );
};

export default App;
