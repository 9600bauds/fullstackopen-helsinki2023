import express from 'express';
import diagnosesService from '../services/diagnosesService';

const diagnosesRouter = express.Router();

diagnosesRouter.get('/', (_req, res) => {
  const allDiagnoses = diagnosesService.getDiagnoses();
  res.send(allDiagnoses);
});

diagnosesRouter.post('/', (_req, res) => {
  res.send('Saving a diagnoses!');
});

export default diagnosesRouter;
