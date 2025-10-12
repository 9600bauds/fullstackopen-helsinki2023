import { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import {
  Entry,
  EntryTypeUnion,
  EntryWithoutId,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from '../../types';
import {
  useForm,
  SubmitHandler,
  Controller,
  UseFormRegister,
  FieldErrors,
} from 'react-hook-form';
import patientService from '../../services/patients';
import { assertNever } from '../../utils';

interface Props {
  patientId: string;
  appendEntry: (entry: Entry) => void;
}

const AddEntryForm = ({ patientId, appendEntry }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const clearError = () => {
    setError(null);
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EntryWithoutId>({
    defaultValues: {
      type: 'Hospital',
      description: '',
      date: '',
      specialist: '',
      diagnosisCodes: [],
      discharge: {
        date: '',
        criteria: '',
      },
    },
  });

  const entryType = watch('type');

  const additionalFields = (type: EntryTypeUnion) => {
    if (!type) return null;
    switch (type) {
      case 'HealthCheck':
        return (
          <HealthCheckFields
            register={register as UseFormRegister<Omit<HealthCheckEntry, 'id'>>}
            errors={errors as FieldErrors<Omit<HealthCheckEntry, 'id'>>}
          />
        );
      case 'Hospital':
        return (
          <HospitalFields
            register={register as UseFormRegister<Omit<HospitalEntry, 'id'>>}
            errors={errors as FieldErrors<Omit<HospitalEntry, 'id'>>}
          />
        );
      case 'OccupationalHealthcare':
        return (
          <OccupationalHealthcareFields
            register={
              register as UseFormRegister<
                Omit<OccupationalHealthcareEntry, 'id'>
              >
            }
            errors={
              errors as FieldErrors<Omit<OccupationalHealthcareEntry, 'id'>>
            }
          />
        );
      default:
        return assertNever(type);
    }
  };

  const onSubmit: SubmitHandler<EntryWithoutId> = async (data) => {
    try {
      const result = await patientService.addEntry(patientId, data);
      // If this line is reached, result was received successfully
      appendEntry(result);
      onSuccess();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(String(e));
      }
    }
  };

  const onSuccess = () => {
    clearError();
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      Add new entry...<br></br>
      {
        error && (
          <div style={{ color: 'red' }}>{`Error: ${error}`}</div>
        ) /* Todo: Use MUI for error styling */
      }
      <FormControl fullWidth margin="normal" error={!!errors.type}>
        <InputLabel id="entry-type-label">Entry Type</InputLabel>
        <Controller
          name="type"
          control={control}
          rules={{ required: 'Type is required' }}
          render={({ field }) => (
            <Select
              labelId="type-label"
              label="Entry Type"
              {...field} // This spreads value, onChange, onBlur, etc.
            >
              <MenuItem value={'HealthCheck'}>Health Check</MenuItem>
              <MenuItem value={'Hospital'}>Hospital</MenuItem>
              <MenuItem value={'OccupationalHealthcare'}>
                Occupational Healthcare
              </MenuItem>
            </Select>
          )}
        />
        <FormHelperText>{errors.type?.message}</FormHelperText>
      </FormControl>
      <TextField
        label="Description"
        {...register('description', {
          required: 'Description is required',
        })}
        error={!!errors.description}
        helperText={errors.description?.message}
      />
      <TextField
        label="Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        {...register('date', {
          required: 'Date is required',
        })}
        error={!!errors.date}
        helperText={errors.date?.message}
      />
      <TextField
        label="Specialist"
        {...register('specialist', {
          required: 'Specialist is required',
        })}
        error={!!errors.specialist}
        helperText={errors.specialist?.message}
      />
      {additionalFields(entryType)}
      <Button type="submit" variant="contained" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit!'}
      </Button>
    </Box>
  );
};
export default AddEntryForm;

type HospitalFormData = Omit<HospitalEntry, 'id'>;
type HospitalFieldsProps = {
  register: UseFormRegister<HospitalFormData>;
  errors: FieldErrors<HospitalFormData>;
};
export const HospitalFields = ({ register, errors }: HospitalFieldsProps) => {
  return (
    <>
      <TextField
        label="Discharge Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        {...register('discharge.date', {
          required: 'Discharge date is required',
        })}
        error={!!errors.discharge?.date}
        helperText={errors.discharge?.date?.message}
      />
      <TextField
        label="Discharge Criteria"
        {...register('discharge.criteria', {
          required: 'Discharge criteria is required',
        })}
        error={!!errors.discharge?.criteria}
        helperText={errors.discharge?.criteria?.message}
      />
    </>
  );
};

type HealthCheckFormData = Omit<HealthCheckEntry, 'id'>;
type HealthCheckFieldsProps = {
  register: UseFormRegister<HealthCheckFormData>;
  errors: FieldErrors<HealthCheckFormData>;
};
export const HealthCheckFields = ({
  register,
  errors,
}: HealthCheckFieldsProps) => {
  return (
    <>
      <TextField
        label="Health Check Rating"
        type="number"
        inputProps={{ min: 0, max: 3 }}
        {...register('healthCheckRating', {
          required: 'Health check rating is required',
          min: { value: 0, message: 'Minimum rating is 0' },
          max: { value: 3, message: 'Maximum rating is 3' },
          valueAsNumber: true,
        })}
        error={!!errors.healthCheckRating}
        helperText={errors.healthCheckRating?.message}
      />
    </>
  );
};

type OccupationalHealthcareFormData = Omit<OccupationalHealthcareEntry, 'id'>;
type OccupationalHealthcareFieldsProps = {
  register: UseFormRegister<OccupationalHealthcareFormData>;
  errors: FieldErrors<OccupationalHealthcareFormData>;
};
export const OccupationalHealthcareFields = ({
  register,
  errors,
}: OccupationalHealthcareFieldsProps) => {
  return (
    <>
      <TextField
        label="Employer Name"
        {...register('employerName', {
          required: 'Employer name is required',
        })}
        error={!!errors.employerName}
        helperText={errors.employerName?.message}
      />
      <TextField
        label="Sick Leave Start Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        {...register('sickLeave.startDate')}
        error={!!errors.sickLeave?.startDate}
        helperText={errors.sickLeave?.startDate?.message}
      />
      <TextField
        label="Sick Leave End Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        {...register('sickLeave.endDate')}
        error={!!errors.sickLeave?.endDate}
        helperText={errors.sickLeave?.endDate?.message}
      />
    </>
  );
};
