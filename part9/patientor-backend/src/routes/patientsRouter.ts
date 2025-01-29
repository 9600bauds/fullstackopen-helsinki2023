import express, { Request, Response, NextFunction } from 'express';
import patientsService from '../services/patientsService';
import { newPatientSchema } from '../utils';
import { z } from 'zod';
import { NewPatient, Patient } from '../types/types';

const patientsRouter = express.Router();

patientsRouter.get('/', (_req, res) => {
  const allPatients = patientsService.getNonSensitivePatients();
  res.send(allPatients);
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    newPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

patientsRouter.post(
  '/',
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientsService.addPatient(req.body);
    res.json(addedPatient);
  }
);

patientsRouter.use(errorMiddleware);

export default patientsRouter;
