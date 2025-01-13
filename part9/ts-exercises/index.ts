import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);
  if (isNaN(height) || isNaN(weight)) {
    res.status(400).send({ error: 'malformatted parameters' });
    return;
  }

  const bmi = calculateBmi(height, weight);
  res.send({ height, weight, bmi });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (daily_exercises === undefined || target === undefined) {
    res.status(400).send({ error: 'parameters missing' });
    return;
  }

  if (
    typeof target !== 'number' ||
    !Array.isArray(daily_exercises) ||
    !daily_exercises.every((val) => typeof val === 'number')
  ) {
    res.status(400).send({ error: 'malformatted parameters' });
    return;
  }

  const result = calculateExercises(target, daily_exercises);
  res.send({ result });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
