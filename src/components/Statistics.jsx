import React, { useState, useMemo, useEffect } from "react";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Select from "react-select";
import { ResponsiveWaffle } from "@nivo/waffle";
import styles from "@/styles/Statistics.module.css";

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

const diseaseGroups = {
  Diabetes: [
    "NCD_DIABETES_PREVALENCE_AGESTD",
    "NCD_DIABETES_TREATMENT_AGESTD",
  ],
  Hipertension: [
    "NCD_HYP_PREVALENCE_A",
    "NCD_HYP_DIAGNOSIS_A",
    "NCD_HYP_TREATMENT_A",
    "NCD_HYP_CONTROL_A",
  ],
  Cancer: [
    "SA_0000001419",
    "SA_0000001420",
    "SA_0000001430",
    "SA_0000001438",
    "SA_0000001439",
    "SA_0000001445",
    "SA_0000001448",
    "ORAL_HEALTH_CANCER_LIPORALCAVITY_100K",
  ],
  Obesidad: ["NCD_BMI_30A"],
  Mortalidad: ["NCDMORT3070"],
};

export default function Statistics() {
  const [rawData, setRawData] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null); // Filtro maestro
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSex, setSelectedSex] = useState(null);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedDiseaseGroup, setSelectedDiseaseGroup] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState(null);

  useEffect(() => {
    fetch("/data/rawData.json")
      .then((res) => res.json())
      .then((data) => setRawData(data));
  }, []);

  // Opciones dependientes del filtro maestro
  const diseaseOptions = useMemo(() => {
    const diseases = [...new Set(rawData.map((item) => item.disease))];
    return diseases.map((d) => ({
      value: d,
      label: diseaseLabels[d] || d,
    }));
  }, [rawData]);

  const dataForDisease = useMemo(() => {
    if (!selectedIndicator) return [];
    return rawData.filter((item) => item.indicator === selectedIndicator.value);
  }, [rawData, selectedIndicator]);

  const yearOptions = useMemo(() => {
    if (!dataForDisease.length) return [];
    const years = [...new Set(dataForDisease.map((item) => item.year))].sort(
      (a, b) => a - b
    );
    return years.map((y) => ({ value: y, label: y.toString() }));
  }, [dataForDisease]);

  const sexOptions = useMemo(() => {
    if (!dataForDisease.length) return [];
    const sexes = [...new Set(dataForDisease.map((item) => item.sex))];
    return sexes.map((s) => ({
      value: s,
      label: sexLabels[s] || s,
    }));
  }, [dataForDisease]);

  const countryOptions = useMemo(() => {
    if (!dataForDisease.length) return [];
    const countries = [...new Set(dataForDisease.map((item) => item.country))].sort();
    return countries.map((c) => ({ value: c, label: c }));
  }, [dataForDisease]);

  const diseaseGroupOptions = useMemo(() => {
    return Object.keys(diseaseGroups).map(group => ({
      value: group,
      label: group
    }));
  }, []);

  const indicatorOptions = useMemo(() => {
    if (!selectedDiseaseGroup) return [];
    const indicators = diseaseGroups[selectedDiseaseGroup.value] || [];
    return indicators.map(ind => ({
      value: ind,
      label: diseaseLabels[ind] || ind
    }));
  }, [selectedDiseaseGroup]);

  useEffect(() => {
    setSelectedIndicator(null);
    setSelectedYear(null);
    setSelectedSex(null);
    setSelectedCountries([]);
  }, [selectedDiseaseGroup]);

  useEffect(() => {
    setSelectedYear(null);
    setSelectedSex(null);
    setSelectedCountries([]);
  }, [selectedIndicator]);

  // Filtrado final
  const filteredData = useMemo(() => {
    let data = dataForDisease;
    if (selectedYear) {
      data = data.filter((item) => item.year === selectedYear.value);
    }
    if (selectedSex) {
      data = data.filter((item) => item.sex === selectedSex.value);
    }
    return data;
  }, [dataForDisease, selectedYear, selectedSex]);

  // BarChart: promedio por sexo
  const barData = useMemo(() => {
    const dataBySex = filteredData.reduce((acc, curr) => {
      const { sex, value } = curr;
      if (!acc[sex]) {
        acc[sex] = { name: sexLabels[sex] || sex, value: 0, count: 0 };
      }
      acc[sex].value += value;
      acc[sex].count++;
      return acc;
    }, {});
    return Object.values(dataBySex).map((d) => ({
      ...d,
      value: d.count > 0 ? Math.round((d.value / d.count) * 10) / 10 : 0, // redondear a 1 decimal
    }));
  }, [filteredData]);

  // LineChart: evolución por país
  const lineData = useMemo(() => {
    const selectedCountryValues = selectedCountries.map(c => c.value);
    const dataToProcess =
      selectedCountryValues.length > 0
        ? dataForDisease.filter((d) =>
            selectedCountryValues.includes(d.country)
          )
        : dataForDisease;
    const groupedData = dataToProcess.reduce((acc, curr) => {
      const { year, country, value } = curr;
      if (!acc[year]) acc[year] = { year };
      acc[year][country] = Math.round(value * 10) / 10; // redondear a 1 decimal
      return acc;
    }, {});
    return Object.values(groupedData).sort((a, b) => a.year - b.year);
  }, [dataForDisease, selectedCountries]);

  // Waffle: distribución por región
  const waffleData = useMemo(() => {
    const regionData = filteredData.reduce((acc, curr) => {
      const { region, value } = curr;
      if (!region) return acc;
      if (!acc[region]) {
        acc[region] = { id: region, label: region, value: 0, count: 0 };
      }
      acc[region].value += value;
      acc[region].count++;
      return acc;
    }, {});
    return Object.values(regionData).map((d) => ({
      ...d,
      value: d.count > 0 ? Math.round((d.value / d.count) * 10) / 10 : 0,
    }));
  }, [filteredData]);

  // Colores específicos para regiones
  const regionColors = [
    "#FF6B6B", // Eastern Mediterranean
    "#4ECDC4", // Americas
    "#45B7D1", // Western Pacific
    "#96CEB4", // South-East Asia
    "#FFEEAD", // Europe
    "#D4A5A5", // Africa
  ];

  // Datos del waffle con colores por región
  const waffleDataWithColor = waffleData.map((d, idx) => ({
    ...d,
    color: regionColors[idx % regionColors.length],
  }));

  const lineColors = {
    "Afghanistan": "#FF6384",
    "Albania": "#36A2EB",
    "Algeria": "#FFCE56",
    "Angola": "#4BC0C0",
    "Antigua and Barbuda": "#9966FF",
    // ...puedes agregar más países según necesites
  };

  // O alternativamente, puedes crear una función para generar colores dinámicamente
  const getLineColor = (index) => {
    const colors = [
      "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
      "#FF9F40", "#FF6384", "#4BC0C0", "#FF9F40", "#36A2EB"
    ];
    return colors[index % colors.length];
  };

  // Agregar después de los otros useMemo
  const statsResume = useMemo(() => {
    if (!filteredData.length) return null;

    // Valor promedio general
    const avgValue = Math.round(
      (filteredData.reduce((sum, item) => sum + item.value, 0) / filteredData.length) * 10
    ) / 10;

    // País con mayor y menor valor
    const byCountry = filteredData.reduce((acc, item) => {
      if (!acc[item.country]) {
        acc[item.country] = { sum: 0, count: 0 };
      }
      acc[item.country].sum += item.value;
      acc[item.country].count++;
      return acc;
    }, {});

    const countryStats = Object.entries(byCountry).map(([country, stats]) => ({
      country,
      average: stats.sum / stats.count
    }));

    const maxCountry = countryStats.reduce((max, curr) => 
      curr.average > max.average ? curr : max
    );

    const minCountry = countryStats.reduce((min, curr) => 
      curr.average < min.average ? curr : min
    );

    // Año con valor más alto
    const byYear = filteredData.reduce((acc, item) => {
      if (!acc[item.year]) {
        acc[item.year] = { sum: 0, count: 0 };
      }
      acc[item.year].sum += item.value;
      acc[item.year].count++;
      return acc;
    }, {});

    const yearStats = Object.entries(byYear).map(([year, stats]) => ({
      year: parseInt(year),
      average: stats.sum / stats.count
    }));

    const maxYear = yearStats.reduce((max, curr) => 
      curr.average > max.average ? curr : max
    );

    return {
      averageValue: avgValue,
      maxCountry: {
        name: maxCountry.country,
        value: Math.round(maxCountry.average * 10) / 10
      },
      minCountry: {
        name: minCountry.country,
        value: Math.round(minCountry.average * 10) / 10
      },
      maxYear: {
        year: maxYear.year,
        value: Math.round(maxYear.average * 10) / 10
      },
      totalRecords: filteredData.length
    };
  }, [filteredData]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Estadísticas de Enfermedades Crónicas</h1>

      <div className={styles.mainFilterContainer}>
        <div className={styles.filterGroup}>
          <label>Enfermedad:</label>
          <Select
            instanceId="disease-group-select"
            options={diseaseGroupOptions}
            value={selectedDiseaseGroup}
            onChange={(selected) => {
              setSelectedDiseaseGroup(selected);
              setSelectedIndicator(null);
            }}
            className={styles.reactSelect}
            placeholder="Seleccione Enfermedad..."
          />
        </div>
        
        <div className={styles.filterGroup}>
          <label>Indicador:</label>
          <Select
            instanceId="indicator-select"
            options={indicatorOptions}
            value={selectedIndicator}
            onChange={setSelectedIndicator}
            className={styles.reactSelect}
            placeholder="Seleccione Indicador..."
            isDisabled={!selectedDiseaseGroup}
          />
        </div>
      </div>

      {selectedIndicator && (
        <div className={styles.filters}>
          <Select
            instanceId="year-select"
            options={yearOptions}
            value={selectedYear}
            onChange={setSelectedYear}
            placeholder="Filtrar por año..."
            isClearable
            className={styles.reactSelect}
          />
          <Select
            instanceId="sex-select"
            options={sexOptions}
            value={selectedSex}
            onChange={setSelectedSex}
            placeholder="Filtrar por sexo..."
            isClearable
            className={styles.reactSelect}
          />
          <Select
            instanceId="country-select"
            isMulti
            options={countryOptions}
            value={selectedCountries}
            onChange={(selected) => {
              setSelectedCountries(selected || []);
            }}
            placeholder="Comparar países..."
            className={styles.reactSelect}
          />
        </div>
      )}

      {/* Mover el statsResume aquí, antes de los gráficos */}
      {selectedIndicator && statsResume && (
        <div className={styles.statsResume}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Valor Promedio General</div>
            <div className={styles.statValue}>{statsResume.averageValue}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>País con Mayor Valor</div>
            <div className={styles.statValue}>{statsResume.maxCountry.value}</div>
            <div className={styles.statSubtext}>{statsResume.maxCountry.name}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>País con Menor Valor</div>
            <div className={styles.statValue}>{statsResume.minCountry.value}</div>
            <div className={styles.statSubtext}>{statsResume.minCountry.name}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Año con Valor Más Alto</div>
            <div className={styles.statValue}>{statsResume.maxYear.value}</div>
            <div className={styles.statSubtext}>{statsResume.maxYear.year}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total de Registros</div>
            <div className={styles.statValue}>{statsResume.totalRecords}</div>
          </div>
        </div>
      )}

      <div className={styles.chartsGrid}>
        <div className={styles.row}>
          <div className={styles.chartContainer}>
            <h2>
              Distribución por Sexo{" "}
              {selectedYear ? `(${selectedYear.label})` : ""}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#e74c3c" name="Valor Promedio" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.chartContainer}>
            <h2>Evolución por País</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                {(selectedCountries.length > 0
                  ? selectedCountries
                  : countryOptions.slice(0, 5)
                ).map((country, index) => (
                  <Line
                    key={country.value}
                    type="monotone"
                    dataKey={country.value}
                    stroke={getLineColor(index)}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={styles.row}>
          <div className={`${styles.chartContainer} ${styles.waffleContainer}`}>
            <h2>Distribución por Región</h2>
            {waffleData.length > 0 ? (
              <div style={{ height: '250px' }}>
                <ResponsiveWaffle
                  data={waffleDataWithColor}
                  total={waffleDataWithColor.reduce((sum, item) => sum + item.value, 0)}
                  rows={10}           // Aumentado a 10 filas
                  columns={10}        // Aumentado a 10 columnas
                  padding={1}
                  margin={{ top: 10, right: 10, bottom: 10, left: 120 }}
                  colors={waffleDataWithColor.map(d => d.color)}
                  colorBy="id"
                  borderRadius={2}    // Reducido para cuadrados más pequeños
                  borderColor={{ from: "color", modifiers: [["darker", 0.3]] }}
                  animate={true}
                  motionStiffness={90}
                  motionDamping={11}
                  legends={[
                    {
                      anchor: "left",
                      direction: "column",
                      justify: false,
                      translateX: -100,
                      translateY: 0,
                      itemsSpacing: 4,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: "left-to-right",
                      itemOpacity: 1,
                      itemTextColor: "#777",
                      symbolSize: 20,
                    },
                  ]}
                />
              </div>
            ) : (
              <p>No hay datos para mostrar con los filtros aplicados.</p>
            )}
          </div>
          <div className={styles.chartContainer}>
            <h2>Distribución por Continente (Pie)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={waffleDataWithColor}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ label, percent }) =>
                    `${label}: ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {waffleDataWithColor.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
