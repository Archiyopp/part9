import patientData from '../../data/patients.json';
import { Patient, NonSensitivePatient } from '../types';

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

export const addPatient = () => {
  return [];
};
