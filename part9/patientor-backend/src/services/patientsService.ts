import patientsData from '../data/patientsData';
import { NonSensitivePatient, Patient, NewPatient } from '../types/types';
import { v1 as uuid } from 'uuid';
import { obj2NewPatient, patient2NonSensitivePatient } from '../utils';

const patients: Patient[] = patientsData.map((obj) => {
  const object = obj2NewPatient(obj) as Patient;
  object.id = obj.id;
  return object;
});

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map((patient) => patient2NonSensitivePatient(patient));
};

const addPatient = (patientData: NewPatient): Patient => {
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
