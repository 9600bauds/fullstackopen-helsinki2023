import { Tooltip } from '@mui/material';
import {
  Entry,
  HealthCheckEntry,
  HealthCheckRating,
  HealthCheckUIMetadata,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from '../../types';
import { assertNever } from '../../utils';
import BaseEntryDetails from './BaseEntryDetails';
import {
  MedicalInformation,
  MonitorHeart,
  Work,
  Favorite,
  HeartBroken,
} from '@mui/icons-material';
import React from 'react';

interface EntryDetailsProps {
  entry: Entry;
}
export const EntryDetails = ({ entry }: EntryDetailsProps) => {
  switch (entry.type) {
    case 'Hospital':
      return <HospitalEntryDetails entry={entry} />;
    case 'HealthCheck':
      return <HealthCheckEntryDetails entry={entry} />;
    case 'OccupationalHealthcare':
      return <OccupationalEntryDetails entry={entry} />;
    default:
      assertNever(entry);
      return null;
  }
};

interface HospitalEntryDetailsProps {
  entry: HospitalEntry;
}
export const HospitalEntryDetails = ({ entry }: HospitalEntryDetailsProps) => {
  const icon = MonitorHeart;
  return (
    <BaseEntryDetails entry={entry} icon={icon}>
      <div>
        Discharge:
        <ul>
          <li>Date: {entry.discharge.date}</li>
          <li>Criteria: {entry.discharge.criteria}</li>
        </ul>
      </div>
    </BaseEntryDetails>
  );
};

interface HealthCheckEntryDetailsProps {
  entry: HealthCheckEntry;
}
export const HealthCheckEntryDetails = ({
  entry,
}: HealthCheckEntryDetailsProps) => {
  const icon = MedicalInformation;

  const healthCheckMap: Record<HealthCheckRating, HealthCheckUIMetadata> = {
    [HealthCheckRating.Healthy]: {
      color: 'green',
      description: 'Healthy',
      icon: Favorite,
    },
    [HealthCheckRating.LowRisk]: {
      color: 'yellow',
      description: 'Low Risk',
      icon: Favorite,
    },
    [HealthCheckRating.HighRisk]: {
      color: 'orange',
      description: 'High Risk',
      icon: Favorite,
    },
    [HealthCheckRating.CriticalRisk]: {
      color: 'red',
      description: 'Critical Risk',
      icon: HeartBroken, //A bit flippant for a real app but I wanted to show off different icons
    },
  };
  const healthCheckIcon = React.createElement(
    healthCheckMap[entry.healthCheckRating].icon,
    {
      style: { color: healthCheckMap[entry.healthCheckRating].color },
    }
  );
  return (
    <BaseEntryDetails entry={entry} icon={icon}>
      <div>
        Health rating:{' '}
        <Tooltip title={healthCheckMap[entry.healthCheckRating].description}>
          {healthCheckIcon}
        </Tooltip>
      </div>
    </BaseEntryDetails>
  );
};

interface OccupationalEntryDetailsProps {
  entry: OccupationalHealthcareEntry;
}
export const OccupationalEntryDetails = ({
  entry,
}: OccupationalEntryDetailsProps) => {
  const icon = Work;
  return (
    <BaseEntryDetails entry={entry} icon={icon}>
      <div>Employer: {entry.employerName}</div>
      <div>
        Sick leave:{' '}
        {entry.sickLeave ? (
          <span>
            From {entry.sickLeave.startDate} to {entry.sickLeave.endDate}.
          </span>
        ) : (
          <span>None.</span>
        )}
      </div>
    </BaseEntryDetails>
  );
};
