const PersonInfo = ({ persons, handleDeletePerson }) => {
  return (
    <ul>
      {persons.map((person) => (
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDeletePerson(person.id)}>delete</button>
        </li>
      ))}
    </ul>
  );
};

const Persons = ({ persons, handleDeletePerson }) => {
  return (
    <div>
      <h2>Numbers</h2>
      <PersonInfo persons={persons} handleDeletePerson={handleDeletePerson} />
    </div>
  );
};

export default Persons;
