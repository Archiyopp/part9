import patientData from '../../data/patients';
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

export const getPatientById = (id: string): Patient | null => {
  const patientById = patients.find((p) => p.id === id);
  if (patientById) {
    if (!patientById.entries) {
      patientById.entries = [];
    }
    return patientById;
  }
  return null;
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
