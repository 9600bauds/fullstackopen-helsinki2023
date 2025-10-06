import { CardContent } from '@mui/material';
import { Card, Tooltip } from '@mui/material';
import React from 'react';
import { Entry } from '../../types';
import { useDiagnoses } from '../../contexts/DiagnosesContext';

interface BaseEntryDetailsProps {
  entry: Entry;
  icon?: React.ElementType;
  children?: React.ReactNode;
}
const BaseEntryDetails = ({ entry, icon, children }: BaseEntryDetailsProps) => {
  const diagnoses = useDiagnoses();

  const getDiagnosisDescription = (code: string): string => {
    const diagnosis = diagnoses?.find((d: { code: string }) => d.code === code);
    return diagnosis ? diagnosis.name : 'Unknown diagnosis';
  };

  return (
    <Card variant="outlined" key={entry.id} style={{ marginBottom: '0.5em' }}>
      <CardContent>
        Date: {entry.date}{' '}
        {icon && (
          <Tooltip title={`${entry.type}`}>{React.createElement(icon)}</Tooltip>
        )}
        <br />
        Description: {entry.description}
        <br />
        {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
          <div>
            Diagnosis Codes:
            <ul>
              {entry.diagnosisCodes.map((code) => (
                <li key={code}>
                  {code}: {getDiagnosisDescription(code)}
                </li>
              ))}
            </ul>
          </div>
        )}
        {children}
        <i>Diagnosed by {entry.specialist}</i>.
      </CardContent>
    </Card>
  );
};
export default BaseEntryDetails;
