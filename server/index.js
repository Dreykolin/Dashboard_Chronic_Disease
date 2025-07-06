// index.js

const express = require('express');
const cors = require('cors');

const app = express();

// DEFINE EL PUERTO AQUÍ
const PORT = 3000; // O el número que prefieras

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

const mapData = [
  { ISO3: "ARG", name: "Argentina", value: 45 }, { ISO3: "BRA", name: "Brazil", value: 88 },
  { ISO3: "USA", name: "United States", value: 95 }, { ISO3: "CAN", name: "Canada", value: 70 },
  { ISO3: "MEX", name: "Mexico", value: 65 }, { ISO3: "ESP", name: "Spain", value: 78 },
  { ISO3: "FRA", name: "France", value: 82 }, { ISO3: "DEU", name: "Germany", value: 85 },
  { ISO3: "CHN", name: "China", value: 92 }, { ISO3: "IND", name: "India", value: 50 },
  { ISO3: "RUS", name: "Russia", value: 60 }, { ISO3: "AUS", name: "Australia", value: 75 },
  { ISO3: "ZAF", name: "South Africa", value: 40 },
];

app.get('/api/map-data', (req, res) => {
  res.json(mapData);
});

// USA UNA SOLA LLAMADA A APP.LISTEN AL FINAL
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});