import diagnosesData from '../data/diagnosesData';
import { Diagnosis } from '../types/types';

const diagnoses: Diagnosis[] = diagnosesData;

const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

const addDiagnosis = () => {
  return null;
};

const diagnosesService = {
  getDiagnoses,
  addDiagnosis,
};

export default diagnosesService;
