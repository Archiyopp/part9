import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { Diagnosis } from '../types';

export const getAllDiagnosis = async () => {
  const { data: diagnosisList } = await axios.get<Diagnosis[]>(
    `${apiBaseUrl}/diagnoses`
  );
  return diagnosisList;
};
