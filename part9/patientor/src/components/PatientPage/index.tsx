import { useParams } from 'react-router-dom';
import { Gender, Patient } from '../../types';
import { useEffect, useState } from 'react';

import patientService from '../../services/patients';
import { Female, Male, Transgender } from '@mui/icons-material';
import { EntryDetails } from './EntryDetails';

const PatientPage = () => {
  const id = useParams().id;

  const [patientData, setPatientData] = useState<Patient | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchPatientData = async () => {
      const patientData = await patientService.getById(id);
      setPatientData(patientData);
    };
    void fetchPatientData();
  }, [id]);

  if (!patientData) {
    return <p>Loading...</p>;
  }

  const getGenderIcon = (gender: Gender) => {
    switch (gender) {
      case Gender.Male:
        return Male;
      case Gender.Female:
        return Female;
      default:
        return Transgender;
    }
  };
  const GenderIcon = getGenderIcon(patientData.gender);

  return (
    <div>
      <h2>Patient Page</h2>
      <h1>
        {patientData.name} <GenderIcon />
      </h1>
      <p>SSN: {patientData.ssn}</p>
      <p>Occupation: {patientData.occupation}</p>
      <p>Date of Birth: {patientData.dateOfBirth}</p>
      <h3>Entries:</h3>
      {patientData.entries.length === 0 ? (
        <p>No entries</p>
      ) : (
        <>
          {patientData.entries.map((entry) => (
            <EntryDetails key={entry.id} entry={entry} />
          ))}
        </>
      )}
    </div>
  );
};

export default PatientPage;
