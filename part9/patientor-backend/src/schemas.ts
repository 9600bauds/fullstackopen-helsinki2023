import { z } from 'zod';
import { Gender } from './types/types';
import { HealthCheckRating } from './types/types';

// There's a lot of code duplication here.
// Ideally, we'd use zod-first architecture and then just infer the types from the schemas.
// However, since this is a course about learning typescript, defining the types too is educational.
// So, code duplication it is.

export const newPatientSchema = z.object({
  name: z.string().min(2),
  dateOfBirth: z.string().date(),
  ssn: z.string().min(3),
  gender: z.nativeEnum(Gender),
  occupation: z.string().optional(),
});

const baseNewEntrySchema = z.object({
  type: z.enum(['Hospital', 'OccupationalHealthcare', 'HealthCheck']),
  description: z.string().min(1),
  date: z.string().date(),
  specialist: z.string().min(1),
  diagnosisCodes: z.array(z.string()).optional(),
});
const dischargeSchema = z.object({
  date: z.string().date(),
  criteria: z.string(),
});
const hospitalEntrySchema = baseNewEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: dischargeSchema,
});
const sickLeaveSchema = z
  .object({ startDate: z.string().date(), endDate: z.string().date() })
  .optional();
const occupationalHealthcareEntrySchema = baseNewEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string().min(1),
  sickLeave: sickLeaveSchema,
});
const healthCheckEntrySchema = baseNewEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

export const newEntrySchema = z.discriminatedUnion('type', [
  hospitalEntrySchema,
  occupationalHealthcareEntrySchema,
  healthCheckEntrySchema,
]);
