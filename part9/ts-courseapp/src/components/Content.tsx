import { CoursePart } from '../interfaces/CoursePart';
import Part from './Part';

interface ContentProps {
  courseParts: CoursePart[];
}

export const Content = (props: ContentProps) => {
  return props.courseParts.map((part) => <Part part={part} />);
};
