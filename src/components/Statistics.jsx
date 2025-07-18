import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Select from "react-select";
import { ResponsiveWaffle } from "@nivo/waffle";
import styles from "@/styles/Statistics.module.css";
import ScatterPlot from './ScatterPlot'; // <-- AÑADE ESTA LÍNEA

const diseaseLabels = {
  NCD_BMI_30A: "Obesidad (IMC ≥ 30)",
  NCD_DIABETES_PREVALENCE_AGESTD: "Prevalencia de diabetes",
  NCD_DIABETES_TREATMENT_AGESTD: "Tratamiento de diabetes",
  NCD_HYP_PREVALENCE_A: "Prevalencia de hipertensión",
  NCD_HYP_DIAGNOSIS_A: "Hipertensión diagnosticada",
  NCD_HYP_TREATMENT_A: "Tratamiento de hipertensión",
  NCD_HYP_CONTROL_A: "Hipertensión controlada",
  NCDMORT3070: "Probabilidad de morir 30-70 años (ENT)",
  SA_0000001419: "DALYs - cáncer de mama",
  SA_0000001420: "DALYs - cáncer colorrectal",
  SA_0000001430: "DALYs - cáncer de esófago",
  SA_0000001438: "Mortalidad - cáncer de mama",
  SA_0000001439: "Mortalidad - cáncer colorrectal",
  SA_0000001445: "Mortalidad - cáncer de hígado",
  SA_0000001448: "Mortalidad - cáncer orofaríngeo",
  ORAL_HEALTH_CANCER_LIPORALCAVITY_100K: "Cáncer oral/labial",
};

const sexLabels = {
  SEX_FMLE: "Mujeres",
  SEX_MLE: "Hombres",
  SEX_BTSX: "Ambos sexos",
};

export default function Statistics() {
  const [rawData, setRawData] = useState([]);
  const [barYear, setBarYear] = useState("Todos");
  const [barSex, setBarSex] = useState("Todos");
  const [barDisease, setBarDisease] = useState("Seleccione Enfermedad");
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [lineDisease, setLineDisease] = useState("Seleccione Enfermedad");
  const [lineSex, setLineSex] = useState("Todos");

  const [waffleMode, setWaffleMode] = useState("Continent");
  const [waffleDisease, setWaffleDisease] = useState("Seleccione Enfermedad");
  const [waffleYear, setWaffleYear] = useState("2019");

  useEffect(() => {
    fetch("/data/rawData.json")
      .then((res) => res.json())
      .then((data) => setRawData(data));
  }, []);

  const uniqueYears = [...new Set(rawData.map((d) => d.year))].sort();
  const uniqueSexes = [...new Set(rawData.map((d) => d.sex))].sort();
  const uniqueDiseases = [...new Set(rawData.map((d) => d.disease))].sort();
  const uniqueCountries = [...new Set(rawData.map((d) => d.country))].sort();
  const uniqueRegions = [...new Set(rawData.map((d) => d.region).filter(Boolean))];
  const uniqueContinents = [...new Set(rawData.map((d) => d.continent).filter(Boolean))];

  const filteredBarData = rawData.filter(
    (d) =>
      (barYear === "Todos" || d.year == barYear) &&
      (barSex === "Todos" || d.sex === barSex) &&
      (barDisease === "Todos" || d.disease === barDisease)
  );

  const avgByCountry = Object.entries(
    filteredBarData.reduce((acc, d) => {
      if (!acc[d.country]) acc[d.country] = [];
      acc[d.country].push(d.value);
      return acc;
    }, {})
  )
    .map(([country, values]) => ({
      country,
      avg: parseFloat(
        (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2)
      ),
    }))
    .sort((a, b) => b.avg - a.avg);

  const filteredLineData = selectedCountries.map((country) => {
    const countryData = rawData.filter(
      (d) =>
        d.country === country &&
        d.disease === lineDisease &&
        (lineSex === "Todos" || d.sex === lineSex)
    );

    const grouped = Object.entries(
      countryData.reduce((acc, d) => {
        if (!acc[d.year]) acc[d.year] = [];
        acc[d.year].push(d.value);
        return acc;
      }, {})
    ).map(([year, values]) => ({
      year,
      value: parseFloat(
        (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2)
      ),
      country,
    }));

    return grouped;
  });

  const combinedLineData = {};
  filteredLineData.flat().forEach((entry) => {
    if (!combinedLineData[entry.year])
      combinedLineData[entry.year] = { year: entry.year };
    combinedLineData[entry.year][entry.country] = entry.value;
  });

  const lineChartData = Object.values(combinedLineData).sort(
    (a, b) => a.year - b.year
  );

  const waffleData = rawData
    .filter(
      (d) =>
        d.year == waffleYear &&
        d.disease === waffleDisease &&
        d[waffleMode]
    )
    .reduce((acc, d) => {
      const key = d[waffleMode];
      if (!acc[key]) acc[key] = [];
      acc[key].push(d.value);
      return acc;
    }, {});

  const waffleSummary = Object.entries(waffleData).map(([name, values]) => ({
    id: name,
    label: name,
    value: parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)),
  }));

  const handleCountryChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    if (values.length <= 5) {
      setSelectedCountries(values);
    }
  };

  return (
    <div className={styles.container}>
      {/* GRÁFICO DE BARRAS */}
      <h2>📊 Prevalencia promedio por país</h2>
      <div className={styles.filters}>
        <Select
          className={styles.reactSelect}
          value={{ value: barYear, label: barYear }}
          options={[{ value: "Todos", label: "Todos" }, ...uniqueYears.map((y) => ({ value: y, label: y }))]}
          onChange={(selected) => setBarYear(selected.value)}
        />
        <Select
          className={styles.reactSelect}
          value={{ value: barSex, label: sexLabels[barSex] || barSex }}
          options={[{ value: "Todos", label: "Todos" }, ...uniqueSexes.map((s) => ({ value: s, label: sexLabels[s] || s }))]}
          onChange={(selected) => setBarSex(selected.value)}
        />
        <Select
          className={styles.reactSelect}
          value={{ value: barDisease, label: diseaseLabels[barDisease] || barDisease }}
          options={uniqueDiseases.map((d) => ({ value: d, label: diseaseLabels[d] || d }))}
          onChange={(selected) => setBarDisease(selected.value)}
        />
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

      {/* GRÁFICO DE LÍNEAS */}
      <h2>📈 Evolución temporal por país</h2>
      <div className={styles.filters}>
        <Select
          isMulti
          options={uniqueCountries.map((c) => ({ value: c, label: c }))}
          value={selectedCountries.map((c) => ({ value: c, label: c }))}
          onChange={handleCountryChange}
          className={styles.reactSelect}
          placeholder="Selecciona hasta 5 países..."
          closeMenuOnSelect={false}
        />
        <Select
          className={styles.reactSelect}
          value={{ value: lineSex, label: sexLabels[lineSex] || lineSex }}
          options={[{ value: "Todos", label: "Todos" }, ...uniqueSexes.map((s) => ({ value: s, label: sexLabels[s] || s }))]}
          onChange={(selected) => setLineSex(selected.value)}
        />
        <Select
          className={styles.reactSelect}
          value={{ value: lineDisease, label: diseaseLabels[lineDisease] || lineDisease }}
          options={uniqueDiseases.map((d) => ({ value: d, label: diseaseLabels[d] || d }))}
          onChange={(selected) => setLineDisease(selected.value)}
        />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedCountries.map((country, index) => (
            <Line
              key={country}
              type="monotone"
              dataKey={country}
              stroke={`hsl(${index * 60}, 70%, 50%)`}
              name={country}
              dot={{ r: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* WAFFLE CHART */}
      <h2>🧇 Distribución por región o continente</h2>
      <div className={styles.filters}>
        <Select
          className={styles.reactSelect}
          value={{ value: waffleMode, label: waffleMode }}
          options={[
            { value: "continent", label: "Continent" },
            { value: "region", label: "Region" },
          ]}
          onChange={(selected) => setWaffleMode(selected.value)}
        />
        <Select
          className={styles.reactSelect}
          value={{ value: waffleYear, label: waffleYear }}
          options={uniqueYears.map((y) => ({ value: y, label: y }))}
          onChange={(selected) => setWaffleYear(selected.value)}
        />
        <Select
          className={styles.reactSelect}
          value={{ value: waffleDisease, label: diseaseLabels[waffleDisease] || waffleDisease }}
          options={uniqueDiseases.map((d) => ({ value: d, label: diseaseLabels[d] || d }))}
          onChange={(selected) => setWaffleDisease(selected.value)}
        />
      </div>

      <div style={{ height: 400 }}>
        <ResponsiveWaffle
          data={waffleSummary}
          total={100}
          rows={10}
          columns={10}
          // colors={{ scheme: "reds" }}
          borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          animate={true}
          motionStiffness={90}
          motionDamping={11}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              translateY: 50,
              itemWidth: 100,
              itemHeight: 20,
              symbolSize: 20,
            },
          ]}
        />
      </div>
          <div className={styles.container}>
              {/* ...tus otros gráficos... */}

              <hr style={{ margin: '4rem 0' }} />

              {/* ✅ Pasa rawData como prop al componente */}
              <ScatterPlot rawData={rawData} />
          </div> 
    </div>
  );
}
