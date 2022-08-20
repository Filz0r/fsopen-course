import Weather from './Weather';

const Country = ({ country }) => {
  const languages = Object.values(country.languages);
  return (
    <div>
      <h1>Country Info</h1>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area} sq/mt</p>
      <p>Languages:</p>
      <ul>
        {languages.map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <h2>Flag</h2>
      <img src={country.flags.png} alt='Country flag' />
      <Weather country={country} />
    </div>
  );
};
export default Country;
