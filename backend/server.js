import express from 'express';
import cors from 'cors';
import automata from './api/automata.route.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/automata', automata);
app.use('*', (req, res) => {
  res.status(404).json({ error: 'not found' });
});

export default app;
