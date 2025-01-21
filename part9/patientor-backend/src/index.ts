import express from 'express';
const app = express();
import cors from 'cors';
import diagnosesRouter from './routes/diagnosesRouter';
import patientsRouter from './routes/patientsRouter';

app.use(express.json());
app.use(cors());

const PORT = 3001;
const baseUrl = '/api';

app.get(`${baseUrl}/ping`, (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use(`${baseUrl}/diagnoses`, diagnosesRouter);
app.use(`${baseUrl}/patients`, patientsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
