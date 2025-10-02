import { Entry } from '../../types';
import { Diagnosis } from '../../types';

interface Props {
  entry: Entry;
  diagnoses?: Diagnosis[];
}
export const EntryDetails = ({ entry, diagnoses }: Props) => {
  const getDiagnosisDescription = (code: string): string => {
    const diagnosis = diagnoses?.find((d) => d.code === code);
    return diagnosis ? diagnosis.name : 'Unknown diagnosis';
  };
  return (
    <li key={entry.id}>
      Date: {entry.date}
      <br />
      Description: {entry.description}
      <br />
      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <ul>
          {entry.diagnosisCodes.map((code) => (
            <li key={code}>
              {code}: {getDiagnosisDescription(code)}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};
