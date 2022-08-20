const PersonForm = ({
  addPerson,
  handleNameChange,
  handleNumberChange,
  newNumber,
  newName,
}) => {
  return (
    <div>
      <h2>Add new</h2>
      <form onSubmit={addPerson}>
        <div>
          name:
          <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number:
          <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type='submit'>add</button>
        </div>
      </form>
    </div>
  );
};

export default PersonForm;
