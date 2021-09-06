export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export interface ExercisesValues {
  daily_exercises: Array<number>;
  target: number;
}

const parseExercises = (args: Array<string>): ExercisesValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  const targetString = args[2];
  const hoursString = args.slice(3, args.length);

  const daily_exercises = hoursString.map((hours) => {
    if (!isNaN(Number(hours))) return Number(hours);
    throw new Error('Provided values must all be numbers');
  });
  if (isNaN(Number(targetString))) {
    throw new Error('Provided values must all be numbers');
  }

  return { daily_exercises, target: Number(targetString) };
};

export const calculateExercises = (
  daily_exercises: Array<number>,
  target: number
): Result => {
  const periodLength = daily_exercises.length;
  const average =
    daily_exercises.reduce((sum, num) => (sum += num), 0) /
    periodLength;
  const success = average / periodLength > target;
  const trainingDays = daily_exercises.filter(
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
  const { daily_exercises, target } = parseExercises(process.argv);
  console.log(calculateExercises(daily_exercises, target));
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  }
}
