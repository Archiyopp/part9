import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { updatePatient, useStateValue } from '../state';
import { Patient, Diagnosis } from '../types';
import axios from 'axios';
import { apiBaseUrl } from '../constants';
import PatientDetails from './PatientDetails';
import EntryForm from './EntryForm';
import { Button } from 'semantic-ui-react';
import { EntryFormValues } from './EntryForm';

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const SinglePatient = () => {
  const [showForm, setShowForm] = useState(false);
  const [{ patients, diagnosis }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  const patientInState = patients[id];
  const [patient, setPatient] = useState<Patient | undefined>(
    patientInState
  );
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

  let codes: { [name: string]: Diagnosis | null } = {};

  patient.entries &&
    patient?.entries.forEach((entry) => {
      entry.diagnosisCodes?.forEach((code) => {
        codes = {
          ...codes,
          [code]: diagnosis.find((d) => d.code === code) || null,
        };
      });
    });

  const onCancel = () => setShowForm(!showForm);
  const submitEntries = async (values: EntryFormValues) => {
    try {
      const { data: newPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${patient.id}/entries`,
        values
      );
      dispatch(updatePatient(newPatient));
      setPatient(newPatient);
      setShowForm(false);
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      } else {
        console.error(e);
      }
    }
  };

  return (
    <div>
      <PatientDetails patient={patient} codes={codes} />
      <br />
      {showForm ? (
        <EntryForm onCancel={onCancel} onSubmit={submitEntries} />
      ) : (
        <Button onClick={() => setShowForm(!showForm)}>
          Add entries
        </Button>
      )}
    </div>
  );
};

export default SinglePatient;
