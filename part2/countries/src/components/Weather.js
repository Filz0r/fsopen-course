import { useEffect, useState } from 'react';
import axios from 'axios';

const Weather = ({ country }) => {
  const [weather, setWeather] = useState([]);
  const api_key = process.env.REACT_APP_API_KEY;
  const coordinates = Object.values(country.capitalInfo);
  const [latitude, longitude] = coordinates[0];

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}&units=metric`
      )
      .then((response) => {
        setWeather(response.data);
      })
      .catch((e) => console.log(e));
  }, []);

  if (weather.length !== 0) {
    // Since the useEffect call makes 2 requests, one for refreshing the page when the
    // filter is changed, and an other after getting the data from the API the link needs
    // be generated before drawing the weather component, or the app breaks because the
    // response to the first call will be empty, meaning we cant access weather.weather[0]
    // as it's undefined, when the first request is made that is.
    const imageLink = `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
    return (
      <div>
        <h2>Weather in {country.capital[0]} </h2>
        <p>
          Temperature is: <strong>{weather.main.temp}ºC</strong>
        </p>
        <img src={imageLink} />
        <p>
          Wind is: <strong>{weather.wind.speed}m/s</strong>
        </p>
      </div>
    );
  } else {
    return <p>Weather currently unavailable</p>;
  }
};
export default Weather;
