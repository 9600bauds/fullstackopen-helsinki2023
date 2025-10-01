import patientsData from '../data/patientsData';
import { NonSensitivePatient, Patient, NewPatient } from '../types/types';
import { v1 as uuid } from 'uuid';
import { newPatientSchema, patient2NonSensitivePatient } from '../utils';

const createPatient = (obj: NewPatient, id?: string | null): Patient => {
  const patient = newPatientSchema.parse(obj) as Patient;
  if (id) patient.id = id;
  else patient.id = uuid();
  patient.entries = [];
  return patient;
};

const patients: Patient[] = patientsData.map((obj) =>
  createPatient(obj, obj.id)
);

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
  const patient = createPatient(patientData);

  patients.push(patient);
  return patient;
};

const patientsService = {
  getPatients,
  getPatient,
  getNonSensitivePatients,
  addPatient,
};

export default patientsService;
