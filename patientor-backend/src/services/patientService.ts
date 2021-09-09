import patientData from '../../data/patients.json';
import { Patient, NonSensitivePatient, NewPatient } from '../types';
import { v1 } from 'uuid';

const patients: Patient[] = patientData as Patient[];

export const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(
    ({ id, name, dateOfBirth, gender, occupation }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
    })
  );
};

export const addPatient = (patient: NewPatient) => {
  const id = v1();

  const newPatient: Patient = {
    ...patient,
    id,
  };

  patients.push(newPatient);
  return newPatient;
};
