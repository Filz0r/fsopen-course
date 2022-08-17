import { useState } from 'react';

const Display = (props) => {
  const { anecdote, votes } = props;
  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdote}</p>
      <p>this anecdote has {votes} votes</p>
    </div>
  );
};

const Button = (props) => {
  const { handleClick, text } = props;
  return <button onClick={handleClick}>{text}</button>;
};

const MostVoted = (props) => {
  const { anecdote, votes } = props;
  return (
    <div>
      <h2>Anecdote with most Votes</h2>
      <p>{anecdote}</p>
      <p>has {votes} votes</p>
    </div>
  );
};

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
  ];

  const baseVotes = new Uint8Array(anecdotes.length);

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(baseVotes);

  const setRandomAnecdote = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length));
  };

  const incrementVotes = () => {
    const newVotes = [...votes];
    newVotes[selected] += 1;
    setVotes(newVotes);
  };

  const indexOfMostVoted = () => {
    const mostVoted = Math.max(...votes);
    const index = votes.indexOf(mostVoted);
    return index;
  };

  return (
    <div>
      <Display anecdote={anecdotes[selected]} votes={votes[selected]} />
      <Button handleClick={setRandomAnecdote} text='next anecdote' />
      <Button handleClick={incrementVotes} text='vote' />
      <MostVoted
        anecdote={anecdotes[indexOfMostVoted()]}
        votes={votes[indexOfMostVoted()]}
      />
    </div>
  );
};

export default App;
