import { useEffect, useState } from 'react';
import Content from './components/Content';
import Filter from './components/Filter';
import axios from 'axios';

const App = () => {
  const [filter, setFilter] = useState(['']);
  const [countries, setCountries] = useState([]);
  const [countriesToShow, setCountriesToShow] = useState([]);

  const hook = () => {
    axios.get('https://restcountries.com/v3.1/all').then((response) => {
      setCountries(response.data);
    });
  };

  useEffect(hook, []);

  const handleFilterChange = (event) => {
    const search = event.target.value;
    setFilter(search);
    const regex = new RegExp(search, 'i');
    const filteredCountries = countries.filter((country) =>
      country.name.common.match(regex)
    );
    setCountriesToShow(filteredCountries);
  };

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <Content
        countriesToShow={countriesToShow}
        setCountriesToShow={setCountriesToShow}
      />
    </div>
  );
};

export default App;
