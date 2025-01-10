const calculateBmi = (cms: number, kgs: number) : string => {
  const meters = cms / 100;
  const bmi = kgs / Math.pow(meters, 2);
  if(!bmi || isNaN(bmi) || bmi <= 0){
    throw new Error("Could not calculate BMI, or calculated a BMI <= 0")
  }
  if (bmi <= 16.0) {
    return "Underweight (Severe thinness)";
  } else if (bmi <= 16.9) {
    return "Underweight (Moderate thinness)";
  } else if (bmi <= 18.4) {
    return "Underweight (Mild thinness)";
  } else if (bmi <= 24.9) {
    return "Normal range";
  } else if (bmi <= 29.9) {
    return "Overweight (Pre-obese)";
  } else if (bmi <= 34.9) {
    return "Obese (Class I)";
  } else if (bmi <= 39.9) {
    return "Obese (Class II)";
  } else if (bmi >= 40.0) {
    return "Obese (Class III)";
  } else{
    throw new Error("BMI was outside expected range")
  }
}

try {
  console.log(calculateBmi(180, 74))
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