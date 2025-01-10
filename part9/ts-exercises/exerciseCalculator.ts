interface ExerciseResults { 
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

const calculateExercises = (target: number, periods: number[]) : ExerciseResults => {
  const periodLength = periods.length;
  const trainingDays = periods.reduce(
    (count, thisPeriod) => {
      if(thisPeriod > 0){
        count++
      }
      return count;
    },
    0
  );
  const totalHours = periods.reduce(
    (accumulator, thisPeriod) => accumulator + thisPeriod,
    0
  )
  const average = totalHours / periodLength;

  const success = average >= target;

  let rating = 1;
  if(average >= target * 0.8) rating++;
  if(average >= target * 1.2) rating++;

  let ratingDescription : string;
  if(rating < 2){
    ratingDescription = "needs improvement";
  }
  else if(rating < 3){
    ratingDescription = "not too bad but could be better";
  }
  else if(rating < 4){
    ratingDescription = "good job";
  }

  return { 
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  }
}

try {
  console.log(calculateExercises(2, [3, 0, 2, 4.5, 0, 3, 1]))
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: '
  // here we can not use error.message
  if (error instanceof Error) {
    // the type is narrowed and we can refer to error.message
    errorMessage += error.message;  
  }
  // here we can not use error.message

  console.log(errorMessage);
}