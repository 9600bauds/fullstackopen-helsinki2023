import { CoursePart } from '../interfaces/CoursePart';

interface ContentProps {
  courseParts: CoursePart[];
}

export const Content = (props: ContentProps) => {
  return props.courseParts.map((part) => (
    <p>
      {part.name} {part.exerciseCount}
    </p>
  ));
};
