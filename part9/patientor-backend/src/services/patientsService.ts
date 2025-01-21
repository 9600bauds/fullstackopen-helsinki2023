import patientsData from '../data/patientsData';
import { NonSensitivePatient, Patient } from '../types/types';

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

const addPatient = () => {
  return null;
};

const patientsService = {
  getPatients,
  getNonSensitivePatients,
  addPatient,
};

export default patientsService;
