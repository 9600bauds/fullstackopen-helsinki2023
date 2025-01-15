import express from 'express';
const app = express();
import cors from 'cors';

app.use(express.json());
app.use(cors());

const PORT = 3001;
const baseUrl = '/api';

app.get(`${baseUrl}/ping`, (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
