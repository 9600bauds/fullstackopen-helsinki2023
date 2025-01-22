import patientsData from '../data/patientsData';
import { NonSensitivePatient, Patient, newPatient } from '../types/types';
import { v1 as uuid } from 'uuid';

const patients: Patient[] = patientsData;

const getPatients = (): Patient[] => {
  return patients;
};

// Ugly TS hack, uses destructuring to actually omit the ssn
const patient2NonSensitivePatient = (patient: Patient): NonSensitivePatient => {
  const { ssn: _ssn, ...onlyTheRelevantFields } = patient; //Evil destructuring
  return onlyTheRelevantFields;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map((patient) => patient2NonSensitivePatient(patient));
};

const addPatient = (patientData: newPatient): Patient => {
  const id = uuid();

  const patient = {
    id,
    ...patientData,
  };

  patients.push(patient);
  return patient;
};

const patientsService = {
  getPatients,
  getNonSensitivePatients,
  addPatient,
};

export default patientsService;
