import express from 'express';
import {
  addPatient,
  getNonSensitivePatients,
  getPatientById,
} from '../services/patientService';
import {
  toNewPatientEntry,
  toNewEntryOfPatientEntries,
} from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(getNonSensitivePatients());
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  res.send(getPatientById(id));
});

router.post('/:id/entries', (req, res) => {
  try {
    const id = req.params.id;
    const patient = getPatientById(id);
    const newEntry = toNewEntryOfPatientEntries(req.body);
    patient?.entries.push(newEntry);
    res.send(patient);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send(e.message);
    } else {
      console.log(e);
    }
  }
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatientEntry(req.body);
    const addedPatient = addPatient(newPatient);
    res.json(addedPatient);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send(e.message);
    } else {
      console.log(e);
    }
  }
});

export default router;
