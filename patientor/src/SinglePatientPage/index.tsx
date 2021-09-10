import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { updatePatient, useStateValue } from '../state';
import { Icon } from 'semantic-ui-react';
import { Patient, Diagnosis } from '../types';
import axios from 'axios';
import { apiBaseUrl } from '../constants';

const SinglePatient = () => {
  const [{ patients, diagnosis }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  const patientInState = patients[id];
  const [patient, setPatient] = useState<Patient | undefined>(
    patientInState
  );
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        if (patientInState.entries) {
          return;
        }

        const { data: PatientData } = await axios.get<Patient | null>(
          `${apiBaseUrl}/patients/${id}`
        );

        if (PatientData) {
          dispatch(updatePatient(PatientData));
          setPatient(PatientData);
        }
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    };
    void fetchPatient();
  }, [dispatch]);
  if (!patient) {
    return <p>No patient found</p>;
  }

  let codes: { [name: string]: Diagnosis | null };

  patient.entries &&
    patient?.entries.forEach((entry) => {
      entry.diagnosisCodes?.forEach((code) => {
        codes = {
          ...codes,
          [code]: diagnosis.find((d) => d.code === code) || null,
        };
      });
    });

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

export default SinglePatient;
