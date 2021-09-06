interface BmiValues {
  height: number;
  weight: number;
}

const parseArguments = (args: Array<string>): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const calculateBmi = (
  height: number,
  weight: number
): string => {
  const bmi = weight / (height / 100) ** 2;
  if (bmi < 18.5) return 'Thin ( Underweight)';
  if (bmi < 24.9) return 'Normal (healthy weight)';
  return 'Obese (Overweight)';
};

try {
  const { height, weight } = parseArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (e) {
  if (e instanceof Error) {
    console.log(e.message);
  }
}
