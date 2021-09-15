import React from 'react';
import { Icon } from 'semantic-ui-react';
import { Patient, Diagnosis } from '../types';
import { assertNever } from './index';

const PatientDetails = ({
  codes,
  patient,
}: {
  codes: { [name: string]: Diagnosis | null };
  patient: Patient;
}) => {
  return (
    <div>
      <h2>
        {patient.name}{' '}
        <Icon
          name={
            patient.gender === 'male'
              ? 'mars'
              : patient.gender === 'female'
              ? 'venus'
              : 'genderless'
          }
        />
      </h2>
      {patient.ssn && <p>ssn: {patient.ssn}</p>}
      <p>occupation: {patient.occupation}</p>
      <h3>entries</h3>
      {patient.entries &&
        patient.entries.map((entry) => {
          let entryDetails;
          let entryIcon;
          switch (entry.type) {
            case 'Hospital': {
              entryDetails = (
                <>
                  <div>Date of discharge: {entry.discharge.date}</div>
                  <div>Criteria: {entry.discharge.criteria}</div>
                </>
              );
              entryIcon = <Icon size="big" name="hospital" />;
              break;
            }
            case 'HealthCheck': {
              const rating = entry.healthCheckRating;
              entryDetails = (
                <div>
                  Health Check Rating: {rating}{' '}
                  <Icon
                    name="heart"
                    color={
                      rating === 0
                        ? 'green'
                        : rating === 1
                        ? 'yellow'
                        : rating === 2
                        ? 'orange'
                        : 'red'
                    }
                  />
                </div>
              );
              entryIcon = <Icon size="big" name="user doctor" />;
              break;
            }
            case 'OccupationalHealthcare': {
              entryIcon = <Icon size="big" name="briefcase" />;
              entryDetails = (
                <div>
                  <div>Employer: {entry.employerName}</div>
                  {entry.sickLeave && (
                    <ol>
                      Sick Leave
                      <li>Start: {entry.sickLeave.startDate}</li>
                      <li>End: {entry.sickLeave.endDate}</li>
                    </ol>
                  )}
                </div>
              );
              break;
            }
            default:
              assertNever(entry);
              break;
          }
          return (
            <div key={entry.id}>
              <p style={{ fontSize: '18px' }}>
                <strong>
                  {entry?.date} {entryIcon}
                </strong>
              </p>
              <p>{entry?.description}</p>
              <ul>
                {entry?.diagnosisCodes?.map((code) => {
                  const message = codes[code]?.name || '';
                  return (
                    <li key={code}>
                      {code}: {message}
                    </li>
                  );
                })}
              </ul>
              {entryDetails}
            </div>
          );
        })}
    </div>
  );
};

export default PatientDetails;
