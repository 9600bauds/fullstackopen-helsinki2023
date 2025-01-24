import {
  Gender,
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

export const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

export const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }

  return name;
};

export const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

export const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date');
  }
  return date;
};

export const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }

  return ssn;
};

export const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

export const parseGender = (gender: unknown): string => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender');
  }

  return gender;
};

export const parseOccupation = (occupation: unknown): string => {
  //Optional field
  if (!isString(occupation)) {
    throw new Error('Incorrect occupation');
  }

  return occupation;
};

export const obj2NewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    'name' in object &&
    'dateOfBirth' in object &&
    'ssn' in object &&
    'gender' in object
  ) {
    const newPatient: NewPatient = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation:
        'occupation' in object ? parseOccupation(object.occupation) : undefined,
    };

    return newPatient;
  }

  throw new Error('Incorrect data: some fields are missing');
};
