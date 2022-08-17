import { useState } from 'react';

const Button = (props) => {
  const { handleClick, text } = props;
  return <button onClick={handleClick}>{text}</button>;
};

const Title = (props) => {
  const { text } = props;
  return <h1>{text}</h1>;
};

const Content = (props) => {
  const { name, count } = props;
  return (
    <p>
      {name}: {count}
    </p>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const addGoodReview = () => {
    setGood(good + 1);
  };

  const addNeutralReview = () => {
    setNeutral(neutral + 1);
  };

  const addBadReview = () => {
    setBad(bad + 1);
  };

  return (
    <div>
      <Title text='Give Feedback' />
      <Button handleClick={addGoodReview} text='Good' />
      <Button handleClick={addNeutralReview} text='Neutral' />
      <Button handleClick={addBadReview} text='Bad' />
      <Title text='Statistics' />
      <Content name='good' count={good} />
      <Content name='neutral' count={neutral} />
      <Content name='bad' count={bad} />
    </div>
  );
};

export default App;
