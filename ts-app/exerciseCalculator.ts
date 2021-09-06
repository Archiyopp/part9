interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExercisesValues {
  exerciseHours: Array<number>;
  target: number;
}

const parseExercises = (args: Array<string>): ExercisesValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  const targetString = args[2];
  const hoursString = args.slice(3, args.length);

  const exerciseHours = hoursString.map((hours) => {
    if (!isNaN(Number(hours))) return Number(hours);
    throw new Error('Provided values must all be numbers');
  });
  if (isNaN(Number(targetString))) {
    throw new Error('Provided values must all be numbers');
  }

  return { exerciseHours, target: Number(targetString) };
};

const calculateExercises = (
  exerciseHours: Array<number>,
  target: number
): Result => {
  const periodLength = exerciseHours.length;
  const average =
    exerciseHours.reduce((sum, num) => (sum += num), 0) /
    periodLength;
  const success = average / periodLength > target;
  const trainingDays = exerciseHours.filter(
    (hours) => hours > 0
  ).length;
  let rating = 1;
  if (average + 1 > target) rating++;
  if (success) rating++;
  const ratingDescription =
    rating === 1
      ? 'too bad, need more training'
      : rating === 2
      ? 'not too bad but could be better'
      : 'excellent results, keep it up';

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
  const { exerciseHours, target } = parseExercises(process.argv);
  console.log(calculateExercises(exerciseHours, target));
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  }
}
