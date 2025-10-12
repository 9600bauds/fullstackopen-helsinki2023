import express, { Request, Response, NextFunction } from 'express';
import patientsService from '../services/patientsService';
import { newEntrySchema } from '../schemas';
import { newPatientSchema } from '../schemas';
import { z } from 'zod';
import { Entry, NewEntry, NewPatient, Patient } from '../types/types';
import { parseDiagnosisCodes } from '../utils';

const patientsRouter = express.Router();

patientsRouter.get('/', (_req, res) => {
  const allPatients = patientsService.getNonSensitivePatients();
  res.send(allPatients);
});

patientsRouter.get('/:id', (_req, res) => {
  const patient = patientsService.getPatient(_req.params.id);
  if (!patient) {
    res.status(404).send({ error: 'Patient not found' });
    return;
  }
  res.send(patient);
});

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Parse the body AND ATTACH the typed result back to the request
    console.log('received new entry: ', req.body);
    req.body = newEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

patientsRouter.post(
  '/:id/entries',
  newEntryParser,
  (req: Request<{ id: string }, unknown, NewEntry>, res: Response<Entry>) => {
    const newEntry = req.body; // Already validated by newEntryParser as middleware

    const diagnosisCodes = parseDiagnosisCodes(newEntry);
    const newEntryWithCodes = { ...newEntry, diagnosisCodes };

    const addedEntry = patientsService.addEntry(
      req.params.id,
      newEntryWithCodes
    );
    res.json(addedEntry);
  }
);

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Parse the body AND ATTACH the typed result back to the request
    req.body = newPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

patientsRouter.post(
  '/',
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const newPatient = req.body; // Already validated by newPatientParser as middleware

    const addedPatient = patientsService.addPatient(newPatient);
    res.json(addedPatient);
  }
);

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

patientsRouter.use(errorMiddleware);

export default patientsRouter;
