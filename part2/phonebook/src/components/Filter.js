const Filter = ({ handleFilterChange }) => {
  return (
    <div>
      <p>filter shown with</p>
      <input onChange={handleFilterChange} />
    </div>
  );
};

export default Filter;
