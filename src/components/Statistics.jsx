import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import styles from '@/styles/Statistics.module.css';

export default function Statistics() {
  const [rawData, setRawData] = useState([]);

  // Estado para gráfico de barras
  const [barYear, setBarYear] = useState('Todos');
  const [barSex, setBarSex] = useState('Todos');
  const [barDisease, setBarDisease] = useState('Diabetes');

  // Estado para gráfico de líneas
  const [lineCountry, setLineCountry] = useState('United States of America');
  const [lineDisease, setLineDisease] = useState('Diabetes');
  const [lineSex, setLineSex] = useState('Todos');

  useEffect(() => {
    fetch('/data/rawData.json')
      .then(res => res.json())
      .then(data => setRawData(data));
  }, []);

  // Gráfico de barras
  const filteredBarData = rawData.filter(d => {
    return (barYear === 'Todos' || d.TimeDim == barYear) &&
           (barSex === 'Todos' || d.Dim1 === barSex) &&
           (barDisease === 'Todos' || d.Disease === barDisease);
  });

  const avgByCountry = Object.entries(filteredBarData.reduce((acc, d) => {
    if (!acc[d.CountryName]) acc[d.CountryName] = [];
    acc[d.CountryName].push(d.NumericValue);
    return acc;
  }, {})).map(([country, values]) => ({
    country,
    avg: parseFloat((values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2))
  })).sort((a, b) => b.avg - a.avg);

  const uniqueYears = [...new Set(rawData.map(d => d.TimeDim))].sort();
  const uniqueSexes = [...new Set(rawData.map(d => d.Dim1))].sort();
  const uniqueDiseases = [...new Set(rawData.map(d => d.Disease))].sort();
  const uniqueCountries = [...new Set(rawData.map(d => d.CountryName))].sort();

  // Gráfico de líneas con filtro por sexo y agrupado por año
  const filteredLineData = Object.entries(
    rawData.filter(d =>
      d.CountryName === lineCountry &&
      d.Disease === lineDisease &&
      (lineSex === 'Todos' || d.Dim1 === lineSex)
    ).reduce((acc, d) => {
      if (!acc[d.TimeDim]) acc[d.TimeDim] = [];
      acc[d.TimeDim].push(d.NumericValue);
      return acc;
    }, {})
  ).map(([year, values]) => ({
    year,
    value: parseFloat((values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2))
  })).sort((a, b) => a.year - b.year);

  return (
    <div className={styles.container}>
      <h2>📊 Prevalencia promedio por país</h2>
      <div className={styles.filters}>
        <select value={barYear} onChange={e => setBarYear(e.target.value)}>
          <option value="Todos">Todos</option>
          {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={barSex} onChange={e => setBarSex(e.target.value)}>
          <option value="Todos">Todos</option>
          {uniqueSexes.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={barDisease} onChange={e => setBarDisease(e.target.value)}>
          {uniqueDiseases.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={avgByCountry.slice(0, 20)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="country" angle={-45} textAnchor="end" interval={0} height={100} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="avg" fill="#e74c3c" name="Prevalencia promedio (%)" />
        </BarChart>
      </ResponsiveContainer>

      <h2>📈 Evolución temporal por país</h2>
      <div className={styles.filters}>
        <select value={lineCountry} onChange={e => setLineCountry(e.target.value)}>
          {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={lineDisease} onChange={e => setLineDisease(e.target.value)}>
          {uniqueDiseases.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={lineSex} onChange={e => setLineSex(e.target.value)}>
          <option value="Todos">Todos</option>
          {uniqueSexes.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredLineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#3498db" name="Prevalencia (%)" dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
