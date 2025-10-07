import {
  NonSensitivePatient,
  Patient,
  NewPatient,
  EntryWithoutId,
} from '../types/types';
import { v1 as uuid } from 'uuid';
import { patient2NonSensitivePatient } from '../utils';
import patients from '../data/patientsData';

const getPatients = (): Patient[] => {
  return patients;
};

const getPatient = (id: string): Patient | undefined => {
  const patient = patients.find((p) => p.id === id);
  return patient;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map((patient) => patient2NonSensitivePatient(patient));
};

const addPatient = (patientData: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...patientData,
    entries: [],
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, newEntry: EntryWithoutId) => {
  const patient = getPatient(patientId);
  if (!patient) {
    throw new Error('Patient not found!');
  }
  const entry = { ...newEntry, id: uuid() };

  patient.entries.push(entry);
  return entry;
};

const patientsService = {
  getPatients,
  getPatient,
  getNonSensitivePatients,
  addPatient,
  addEntry,
};

export default patientsService;
