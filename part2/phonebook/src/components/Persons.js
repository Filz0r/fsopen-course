const PersonInfo = ({ persons }) => {
  return (
    <ul>
      {persons.map((person) => (
        <li key={person.id}>
          {person.name} {person.number}
        </li>
      ))}
    </ul>
  );
};

const Persons = ({ persons }) => {
  return (
    <div>
      <h2>Numbers</h2>
      <PersonInfo persons={persons} />
    </div>
  );
};

export default Persons;
