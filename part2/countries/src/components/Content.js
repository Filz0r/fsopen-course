import Country from './Country';
const Content = ({ countriesToShow, setCountriesToShow }) => {
  if (countriesToShow.length > 10) {
    return <p>To many matches, add more letters</p>;
  } else if (
    (countriesToShow.length > 2 && countriesToShow.length < 10) ||
    countriesToShow.length === 0
  ) {
    return (
      <ul>
        {countriesToShow.map((country, index) => (
          <li key={index}>
            {country.name.common}{' '}
            <button onClick={() => setCountriesToShow([country])}>show</button>
          </li>
        ))}
      </ul>
    );
  } else {
    return <Country country={countriesToShow[0]} />;
  }
};

export default Content;
