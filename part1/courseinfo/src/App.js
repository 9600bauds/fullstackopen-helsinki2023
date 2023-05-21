const Header = (course) => {
    return (
        <div>
            <h1>{course.name}</h1>
        </div>
    )
}

const Content = (content) => {
    return (
        <div>
            <Part name={content.part1} exerciseCount={content.exercises1} />
            <Part name={content.part2} exerciseCount={content.exercises2} />
            <Part name={content.part3} exerciseCount={content.exercises3} />
        </div>
    )
}

const Total = (values) => {
    return (
        <div>
            <p>Number of exercises {values.exercises1 + values.exercises2 + values.exercises3}</p>
        </div>
    )
}

const Part = (part) => {
    return (
        <p>
            {part.name} {part.exerciseCount}
        </p>
    )
}

const App = () => {
    const course = 'Half Stack application development'
    const part1 = 'Fundamentals of React'
    const exercises1 = 10
    const part2 = 'Using props to pass data'
    const exercises2 = 7
    const part3 = 'State of a component'
    const exercises3 = 14

    return (
        <div>
            <Header name={course} />
            <Content part1={part1} part2={part2} part3={part3} exercises1={exercises1} exercises2={exercises2} exercises3={exercises3} />
            <Total exercises1={exercises1} exercises2={exercises2} exercises3={exercises3} />
        </div>
    )
}

export default App