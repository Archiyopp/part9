import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;
  if (isNaN(Number(height)) || isNaN(Number(weight))) {
    res.json({ error: 'malformatted parameters' });
  }
  const bmiobject = {
    weight: Number(weight),
    height: Number(height),
    bmi: calculateBmi(Number(height), Number(weight)),
  };
  res.json(bmiobject);
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  if (!daily_exercises || !target) {
    res.json({ error: 'parameters missing' });
  }
  if (
    typeof target !== 'number' ||
    !(daily_exercises instanceof Array)
  ) {
    res.json({ error: 'malformatted parameters' });
  }
  try {
    res.json(calculateExercises(daily_exercises, target));
  } catch (e) {
    if (e instanceof Error)
      res.json({ error: 'malformatted parameters' });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
