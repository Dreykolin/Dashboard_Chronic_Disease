const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const happinessData = [
  { country: 'Finland', score: 7.8 },
  { country: 'Denmark', score: 7.6 },
  { country: 'Iceland', score: 7.5 },
  { country: 'Norway', score: 7.4 },
];

app.get('/api/happiness', (req, res) => {
  res.json(happinessData);
});

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});