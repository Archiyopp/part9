import {
  Diagnose,
  Entry,
  Gender,
  NewPatient,
  HealthCheckRating,
  Discharge,
  SickLeave,
} from './types';

type NewPatientFields = {
  name: unknown;
  dateOfBirth: unknown;
  gender: unknown;
  occupation: unknown;
  ssn: unknown;
};

type NewEntriesFields = {
  id: unknown;
  name: unknown;
  type: unknown;
  description: unknown;
  specialist: unknown;
  healthCheckRating: unknown;
  date: unknown;
  employerName: unknown;
  sickLeave?: { startDate: unknown; endDate: unknown };
  diagnosisCodes: unknown;
  discharge: unknown;
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

export const toNewEntryOfPatientEntries = (
  entry: NewEntriesFields
): Entry => {
  const type = parseEntryType(entry.type);
  const id = parseString(entry.id, 'id');
  const date = parseDate(entry.date);
  const specialist = parseString(entry.specialist, 'specialist');
  const description = parseString(entry.description, 'description');
  const diagnosisCodes = parseDiagnosisCodes(entry.diagnosisCodes);
  const newEntry = {
    id,
    date,
    specialist,
    description,
    diagnosisCodes: diagnosisCodes || [],
  };
  switch (type) {
    case 'HealthCheck': {
      const healthCheckRating = parseHealthRating(
        entry.healthCheckRating
      );
      return { ...newEntry, healthCheckRating, type };
    }
    case 'Hospital': {
      const discharge = parseDischarge(entry.discharge);
      return { ...newEntry, type, discharge };
    }
    case 'OccupationalHealthcare': {
      const employerName = parseString(
        entry.employerName,
        'employer name'
      );
      if (entry.sickLeave) {
        const sickLeave = parseSickLeave(entry.sickLeave);
        return { ...newEntry, type, employerName, sickLeave };
      }
      return { ...newEntry, type, employerName };
    }
    default:
      throw new Error('Incorrect parameters for Entry');
  }
};

// * Parsers

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

const parseEntryType = (
  type: unknown
): 'Hospital' | 'HealthCheck' | 'OccupationalHealthcare' => {
  if (!type || !isString(type) || !isType(type)) {
    throw new Error('Incorrect or missing parameter type: ' + type);
  }
  return type;
};

const parseDiagnosisCodes = (
  diagnosisCodes: unknown
): Array<Diagnose['code']> => {
  if (!diagnosisCodes) {
    return [];
  }
  if (!Array.isArray(diagnosisCodes)) {
    throw new Error('Incorrect diagnosis codes: ' + diagnosisCodes);
  }
  const returnDiagnosis = diagnosisCodes.map((code) => {
    if (!isString(code)) {
      throw new Error('Incorrect diagnosis codes: ' + diagnosisCodes);
    }
    return code;
  });

  return returnDiagnosis;
};

const parseHealthRating = (
  healthRating: unknown
): HealthCheckRating => {
  if (!healthRating || !isHealthRating(healthRating)) {
    throw new Error('Incorrect health check rating: ' + healthRating);
  }
  return healthRating;
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (!discharge || !isDischarge(discharge)) {
    throw new Error('Incorrect discharge parameter: ' + discharge);
  }
  return discharge;
};

const parseSickLeave = (sickLeave: {
  startDate: unknown;
  endDate: unknown;
}): SickLeave => {
  const startDate = sickLeave.startDate;
  const endDate = sickLeave.endDate;
  if (
    !startDate ||
    !endDate ||
    !isString(endDate) ||
    !isString(startDate) ||
    !isDate(startDate) ||
    !isDate(endDate)
  ) {
    throw new Error('Incorrect sick leave dates');
  }
  return { startDate, endDate };
};

// * type coercers

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

const isType = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  param: any
): param is 'Hospital' | 'HealthCheck' | 'OccupationalHealthcare' => {
  return [
    'Hospital',
    'HealthCheck',
    'OccupationalHealthcare',
  ].includes(param);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDischarge = (param: any): param is Discharge => {
  return (
    isString(param.date) &&
    isDate(param.date) &&
    isString(param.criteria)
  );
};
