import diagnosesData from '../../data/diagnoses.json';
import { Diagnose } from '../types';

const diagnoses: Diagnose[] = diagnosesData as Diagnose[];

export const getDiagnoses = (): Diagnose[] => {
  return diagnoses;
};

export const addDiagnose = () => {
  return [];
};
