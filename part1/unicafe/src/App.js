import { useState } from 'react';

const Button = (props) => {
  const { handleClick, text } = props;
  return <button onClick={handleClick}>{text}</button>;
};

const Title = (props) => {
  const { text } = props;
  return <h1>{text}</h1>;
};

const Statistics = (props) => {
  const { good, neutral, bad, all, average } = props;

  // since there is no feedback we don't need to calculate anything
  // so we return the <p> instead of doing calculations
  if (all === 0) {
    return <p>No feedback given</p>;
  }

  const positivePercent = all > 0 ? `${(good * 100) / all}%` : '0%';
  const trueAverage = average > 0 ? average / all : 0;

  return (
    <div>
      <Title text='Statistics' />
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>statistic</th>
          </tr>
        </thead>
        <tbody>
          <StatisticLine name='good' count={good} />
          <StatisticLine name='neutral' count={neutral} />
          <StatisticLine name='bad' count={bad} />
          <StatisticLine name='all' count={all} />
          <StatisticLine name='average' count={trueAverage} />
          <StatisticLine name='positive' count={positivePercent} />
        </tbody>
      </table>
    </div>
  );
};

const StatisticLine = (props) => {
  const { name, count } = props;
  return (
    <tr>
      <td>{name}</td>
      <td>{count}</td>
    </tr>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);
  const [average, setAverage] = useState(0);

  const addGoodReview = () => {
    setGood(good + 1);
    setAll(all + 1);
    setAverage(average + 1);
  };

  const addNeutralReview = () => {
    setAll(all + 1);
    setNeutral(neutral + 1);
  };

  const addBadReview = () => {
    setBad(bad + 1);
    setAll(all + 1);
    setAverage(average - 1);
  };

  return (
    <div>
      <Title text='Give Feedback' />
      <Button handleClick={addGoodReview} text='Good' />
      <Button handleClick={addNeutralReview} text='Neutral' />
      <Button handleClick={addBadReview} text='Bad' />
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        average={average}
        all={all}
      />
    </div>
  );
};

export default App;
