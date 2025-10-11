import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { Entry, HospitalEntry } from '../../types';
import { useForm, SubmitHandler } from 'react-hook-form';
import patientService from '../../services/patients';

export type FormData = Omit<HospitalEntry, 'id'>;

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
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      //Manually adding the "type" field for now, since it's hardcoded to be a hospital entry
      const dataToSend = { ...data, type: 'Hospital' as const };
      const result = await patientService.addEntry(patientId, dataToSend);
      // If this line is reached, result was received successfully
      clearError();
      appendEntry(result);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(String(e));
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      Add new entry...<br></br>
      {
        error && (
          <div style={{ color: 'red' }}>{`Error: ${error}`}</div>
        ) /* Todo: Use MUI for error styling */
      }
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
      <Button type="submit" variant="contained" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit!'}
      </Button>
    </Box>
  );
};
export default AddEntryForm;
