import Header from './Header'
import Content from './Content'
import Total from './Total'

const Course = ({props}) => {
  const exerciseNumbers = props.parts.map(part => part.exercises)
  const sum = exerciseNumbers.reduce( //evil reduce magic
    (accumulator, currentValue) => accumulator + currentValue, 0
  );
  return (
    <div>
      <Header course={props.name} />
      <Content parts={props.parts} />
      <Total sum={sum} />
    </div>
  )
}

export default Course