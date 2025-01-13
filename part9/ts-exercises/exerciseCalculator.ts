interface ExerciseInputs {
  target: number;
  periods: number[];
}

const parseArguments = (args: string[]): ExerciseInputs => {
  if (args.length < 4) throw new Error('Not enough arguments');
  const target = Number(args[2]);
  if (isNaN(target)) {
    throw new Error('Target value was not a number');
  }

  let periods: number[] = [];
  for (let i: number = 4; i < args.length; i++) {
    const thisPeriod = Number(args[i]);
    if (isNaN(thisPeriod)) {
      throw new Error(`Period ${args[i]} is not a number`);
    }
    periods = periods.concat(thisPeriod);
  }

  return {
    target,
    periods,
  };
};
interface ExerciseResults {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (
  target: number,
  periods: number[]
): ExerciseResults => {
  const periodLength = periods.length;
  const trainingDays = periods.reduce((count, thisPeriod) => {
    if (thisPeriod > 0) {
      count++;
    }
    return count;
  }, 0);
  const totalHours = periods.reduce(
    (accumulator, thisPeriod) => accumulator + thisPeriod,
    0
  );
  const average = totalHours / periodLength;

  const success = average >= target;

  let rating = 1;
  if (average >= target * 0.8) rating++;
  if (average >= target * 1.2) rating++;

  let ratingDescription: string;
  if (rating < 2) {
    ratingDescription = 'needs improvement';
  } else if (rating < 3) {
    ratingDescription = 'not too bad but could be better';
  } else {
    ratingDescription = 'good job';
  }

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
  const { target, periods } = parseArguments(process.argv);
  console.log(calculateExercises(target, periods));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: ';
  // here we can not use error.message
  if (error instanceof Error) {
    // the type is narrowed and we can refer to error.message
    errorMessage += error.message;
  }
  // here we can not use error.message

  console.log(errorMessage);
}

export default calculateExercises; //Turn this into a module so we don't have nasty scope voodoo
