import express from 'express';
import patientsService from '../services/patientsService';

const patientsRouter = express.Router();

patientsRouter.get('/', (_req, res) => {
  const allPatients = patientsService.getNonSensitivePatients();
  res.send(allPatients);
});

patientsRouter.post('/', (_req, res) => {
  res.send('Saving a diagnoses!');
});

export default patientsRouter;
