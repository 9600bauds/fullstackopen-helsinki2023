import { CoursePart } from '../interfaces/CoursePart';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface PartProps {
  part: CoursePart;
}

export const Part = (props: PartProps) => {
  const part = props.part;
  switch (part.kind) {
    case 'basic':
      return (
        <p>
          <div>
            <b>
              {part.name} ({part.exerciseCount} exercises)
            </b>
          </div>
          <div>
            <i>{part.description}</i>
          </div>
        </p>
      );
    case 'group':
      return (
        <p>
          <div>
            <b>
              {part.name} ({part.exerciseCount} exercises)
            </b>
          </div>
          <div>
            <i>{part.groupProjectCount} group exercises</i>
          </div>
        </p>
      );
    case 'background':
      return (
        <p>
          <div>
            <b>
              {part.name} ({part.exerciseCount} exercises)
            </b>
          </div>
          <div>
            <i>{part.description}</i>
          </div>
          <div>Background material: {part.backgroundMaterial}</div>
        </p>
      );
    case 'special':
      return (
        <p>
          <div>
            <b>
              {part.name} ({part.exerciseCount} exercises)
            </b>
          </div>
          <div>
            <i>{part.description}</i>
          </div>
          <div>Requirements: {part.requirements.join(', ')}</div>
        </p>
      );
    default:
      return assertNever(part); // exhaustive type checking
  }
};

export default Part;
