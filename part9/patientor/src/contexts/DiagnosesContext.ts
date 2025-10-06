import { createContext, useContext } from 'react';
import { Diagnosis } from '../types';

export const DiagnosesContext = createContext<Diagnosis[] | undefined>(
  undefined //init value
);

export const useDiagnoses = () => {
  const context = useContext(DiagnosesContext);
  if (context === undefined) {
    throw new Error('useDiagnoses must be used within a DiagnosisProvider');
  }
  return context;
};
