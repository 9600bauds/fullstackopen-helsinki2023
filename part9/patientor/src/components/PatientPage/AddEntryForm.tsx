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
  Autocomplete,
  Grid,
  Paper,
  Typography,
  Divider,
  Alert,
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
import { assertNever, getErrorMessage } from '../../utils';
import { useDiagnoses } from '../../contexts/DiagnosesContext';

interface Props {
  patientId: string;
  appendEntry: (entry: Entry) => void;
}

const AddEntryForm = ({ patientId, appendEntry }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const clearError = () => {
    setError(null);
  };

  const diagnoses = useDiagnoses();

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
      const message = getErrorMessage(e);
      setError(message);
    }
  };

  const onSuccess = () => {
    clearError();
    reset();
  };

  return (
    <Paper variant="outlined" style={{ padding: '16px', marginTop: '16px' }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Add New Entry
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{`Error: ${error}`}</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              {...register('description', {
                required: 'Description is required',
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register('date', {
                required: 'Date is required',
              })}
              error={!!errors.date}
              helperText={errors.date?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Specialist"
              fullWidth
              {...register('specialist', {
                required: 'Specialist is required',
              })}
              error={!!errors.specialist}
              helperText={errors.specialist?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="diagnosisCodes"
              control={control}
              render={({ field }) => {
                // The state stores only codes (string[]) but MUI's Autocomplete components uses Diagnosis[] directly
                const selectedDiagnoses = diagnoses.filter((d) =>
                  Array.isArray(field.value)
                    ? field.value.includes(d.code)
                    : false
                );
                return (
                  <Autocomplete
                    multiple
                    disableCloseOnSelect
                    options={diagnoses}
                    value={selectedDiagnoses}
                    getOptionLabel={(option) => option.code} // Display only the code in the input itself
                    renderOption={(props, option) => (
                      <li {...props}>
                        {/* Display code and description in the search */}
                        {option.code} - {option.name}
                      </li>
                    )}
                    // onChange updates the form state with an array of codes (string[])
                    onChange={(_event, newValue) => {
                      field.onChange(newValue.map((option) => option.code));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Diagnosis Codes"
                        placeholder="Type to search..."
                      />
                    )}
                  />
                );
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
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
          </Grid>

          <Grid item xs={12}>
            {additionalFields(entryType)}
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit!'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
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
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Discharge Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          {...register('discharge.date', {
            required: 'Discharge date is required',
          })}
          error={!!errors.discharge?.date}
          helperText={errors.discharge?.date?.message}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Discharge Criteria"
          fullWidth
          {...register('discharge.criteria', {
            required: 'Discharge criteria is required',
          })}
          error={!!errors.discharge?.criteria}
          helperText={errors.discharge?.criteria?.message}
        />
      </Grid>
    </Grid>
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
    <TextField
      label="Health Check Rating"
      type="number"
      fullWidth
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
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="Employer Name"
          fullWidth
          {...register('employerName', {
            required: 'Employer name is required',
          })}
          error={!!errors.employerName}
          helperText={errors.employerName?.message}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Sick Leave Start Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          {...register('sickLeave.startDate', {
            required: 'Sick leave start date is required',
          })}
          error={!!errors.sickLeave?.startDate}
          helperText={errors.sickLeave?.startDate?.message}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Sick Leave End Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          {...register('sickLeave.endDate', {
            required: 'Sick leave end date is required',
          })}
          error={!!errors.sickLeave?.endDate}
          helperText={errors.sickLeave?.endDate?.message}
        />
      </Grid>
    </Grid>
  );
};
