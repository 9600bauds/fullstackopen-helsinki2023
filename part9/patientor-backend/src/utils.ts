import { newPatientSchema } from './schemas';
import {
  Diagnosis,
  NewPatient,
  NonSensitivePatient,
  Patient,
} from './types/types';

// Ugly TS hack, uses destructuring to actually omit the ssn
export const patient2NonSensitivePatient = (
  patient: Patient
): NonSensitivePatient => {
  const { ssn: _ssn, ...onlyTheRelevantFields } = patient; //Evil destructuring
  return onlyTheRelevantFields;
};

export const obj2NewPatient = (object: unknown): NewPatient => {
  return newPatientSchema.parse(object);
};
export const parseDiagnosisCodes = (
  object: unknown
): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};
