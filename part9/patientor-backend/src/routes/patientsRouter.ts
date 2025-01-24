import express from 'express';
import patientsService from '../services/patientsService';
import { obj2NewPatient } from '../utils';

const patientsRouter = express.Router();

patientsRouter.get('/', (_req, res) => {
  const allPatients = patientsService.getNonSensitivePatients();
  res.send(allPatients);
});

patientsRouter.post('/', (req, res) => {
  try {
    const newPatient = obj2NewPatient(req.body);

    const addedEntry = patientsService.addPatient(newPatient);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong!';
    if (error instanceof Error) {
      errorMessage = 'Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default patientsRouter;
