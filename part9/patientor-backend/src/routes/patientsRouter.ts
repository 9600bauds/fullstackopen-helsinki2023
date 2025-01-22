import express from 'express';
import patientsService from '../services/patientsService';

const patientsRouter = express.Router();

patientsRouter.get('/', (_req, res) => {
  const allPatients = patientsService.getNonSensitivePatients();
  res.send(allPatients);
});

patientsRouter.post('/', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { name, dateOfBirth, ssn, gender, occupation } = req.body;
  const addedEntry = patientsService.addPatient({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    name,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    dateOfBirth,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ssn,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    gender,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    occupation,
  });
  res.json(addedEntry);
});

export default patientsRouter;
