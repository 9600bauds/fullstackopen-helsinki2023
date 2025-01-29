import {
  Gender,
  NewPatient,
  NonSensitivePatient,
  Patient,
} from './types/types';

import { z } from 'zod';

// Ugly TS hack, uses destructuring to actually omit the ssn
export const patient2NonSensitivePatient = (
  patient: Patient
): NonSensitivePatient => {
  const { ssn: _ssn, ...onlyTheRelevantFields } = patient; //Evil destructuring
  return onlyTheRelevantFields;
};

export const newPatientSchema = z.object({
  name: z.string().min(2),
  dateOfBirth: z.string().date(),
  ssn: z.string().min(3),
  gender: z.nativeEnum(Gender),
  occupation: z.string().optional(),
});

export const obj2NewPatient = (object: unknown): NewPatient => {
  return newPatientSchema.parse(object);
};
