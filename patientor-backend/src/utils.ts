import { Gender, NewPatient } from './types';
type NewPatientFields = {
  name: unknown;
  dateOfBirth: unknown;
  gender: unknown;
  occupation: unknown;
  ssn: unknown;
};

export const toNewPatientEntry = ({
  name,
  dateOfBirth,
  gender,
  occupation,
  ssn,
}: NewPatientFields): NewPatient => {
  const newPatientEntry: NewPatient = {
    name: parseString(name, 'name'),
    dateOfBirth: parseDate(dateOfBirth),
    gender: parseGender(gender),
    occupation: parseString(occupation, 'occupation'),
    ssn: parseString(ssn, 'ssn'),
    entries: [],
  };

  return newPatientEntry;
};

const parseString = (entry: unknown, parameter: string): string => {
  if (!entry || !isString(entry)) {
    throw new Error(
      `Incorrect or missing parameter ${parameter}: ` + entry
    );
  }
  return entry;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing parameter date: ' + date);
  }
  return date;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error(
      'Incorrect or missing parameter gender: ' + gender
    );
  }
  return gender;
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};
