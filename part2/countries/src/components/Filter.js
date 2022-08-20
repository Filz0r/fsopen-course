const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      <h1>Find a Country</h1>
      <p>
        find a country
        <input value={filter} onChange={handleFilterChange} />
      </p>
    </div>
  );
};

export default Filter;
