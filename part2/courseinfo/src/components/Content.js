import Part from "./Part";

const Content = ({ parts }) => {
  return (
    <span>
      {parts.map(part => 
      <Part key={part.id} part={part} />
      )}
    </span>
  )
}

export default Content