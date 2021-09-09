import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { updatePatient, useStateValue } from '../state';
import { Icon } from 'semantic-ui-react';
import { Patient } from '../types';
import axios from 'axios';
import { apiBaseUrl } from '../constants';

const SinglePatient = () => {
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  const patientInState = patients[id];
  const [patient, setPatient] = useState<Patient | undefined>(
    patientInState
  );
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        if (patientInState.ssn) {
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
    </div>
  );
};

export default SinglePatient;
