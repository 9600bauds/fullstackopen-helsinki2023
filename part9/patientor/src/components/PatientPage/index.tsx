import { useParams } from "react-router-dom";
import { Gender, Patient } from "../../types";
import { useEffect, useState } from "react";

import patientService from "../../services/patients";
import { Female, Male, Transgender } from "@mui/icons-material";

const PatientPage = () => {
  const id = useParams().id;

  const [patientData, setPatientData] = useState<Patient | null>(null);

  const gender2icon = (gender: Gender) => {
    switch (gender) {
      case Gender.Male:
        return Male;
      case Gender.Female:
        return Female;
      default:
        return Transgender;
    }
  };

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

  const GenderIcon = gender2icon(patientData.gender);

  return (
    <div>
      <h2>Patient Page</h2>
      <h1>
        {patientData.name} <GenderIcon />
      </h1>
      <p>SSN: {patientData.ssn}</p>
      <p>Occupation: {patientData.occupation}</p>
      <p>Date of Birth: {patientData.dateOfBirth}</p>
    </div>
  );
};

export default PatientPage;
