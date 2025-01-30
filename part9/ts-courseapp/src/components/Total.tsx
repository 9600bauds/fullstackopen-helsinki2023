import { CoursePart } from '../interfaces/CoursePart';

interface TotalProps {
  courseParts: CoursePart[];
}

export const Total = (props: TotalProps) => {
  const totalExercises = props.courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0
  );

  return <p>Number of exercises {totalExercises}</p>;
};
