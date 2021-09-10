import { State } from './state';
import { Patient, Diagnosis } from '../types';

export type Action =
  | {
      type: 'SET_PATIENT_LIST';
      payload: Patient[];
    }
  | {
      type: 'ADD_PATIENT';
      payload: Patient;
    }
  | {
      type: 'UPDATE_PATIENT';
      payload: Patient;
    }
  | {
      type: 'SET_DIAGNOSIS_LIST';
      payload: Diagnosis[];
    };

export const updatePatient = (patient: Patient): Action => ({
  type: 'UPDATE_PATIENT',
  payload: patient,
});

export const setPatientList = (patientList: Patient[]): Action => ({
  type: 'SET_PATIENT_LIST',
  payload: patientList,
});

export const addPatient = (patient: Patient): Action => ({
  type: 'ADD_PATIENT',
  payload: patient,
});

export const setDiagnosisList = (
  diagnosisList: Diagnosis[]
): Action => ({
  type: 'SET_DIAGNOSIS_LIST',
  payload: diagnosisList,
});

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PATIENT_LIST':
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      };
    case 'ADD_PATIENT':
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case 'UPDATE_PATIENT': {
      const patient = state.patients[action.payload.id];
      if (patient) {
        return {
          ...state,
          patients: {
            ...state.patients,
            [action.payload.id]: action.payload,
          },
        };
      }
      return state;
    }
    case 'SET_DIAGNOSIS_LIST': {
      return {
        ...state,
        diagnosis: [...state.diagnosis, ...action.payload],
      };
    }
    default:
      return state;
  }
};
