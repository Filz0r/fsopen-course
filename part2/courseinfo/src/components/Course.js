const Header = ({name}) => {
  return <h1>{name}</h1>;
};

const Content = ({parts}) => {
  return parts.map(part => <div key={part.id} ><Part part={part} /></div>)
};
const Part = ({part}) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};
const Total = ({parts}) => {
    const exercisesArray = []
    parts.map(part => exercisesArray.push(part.exercises))
    const total = exercisesArray.reduce((total, exercises) => total + exercises, 0)
    return <p><strong>Total of exercises {total}</strong></p>;
  };
const Course = ({ course }) => {
    return (
        <div>      
            <Header name={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}
export default Course