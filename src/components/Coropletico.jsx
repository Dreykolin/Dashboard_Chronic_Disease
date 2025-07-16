import React, { useState, useEffect, memo } from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import Papa from 'papaparse';
import ReactSlider from 'react-slider';
import styles from '@/styles/Coropletico.module.css';

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const CSV_URL = '/WHO-Cardiovascular Disease/NCDMORT3070_v3.csv';
const colorScale = scaleLinear().domain([10, 50]).range(["#ffedea", "#ff5233"]);

const MapaCoropletico = ({ filters, setFilters, setTooltipContent }) => {
  const [mapData, setMapData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableSexes, setAvailableSexes] = useState([]);

  useEffect(() => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data;
        const years = [...new Set(data.map(row => row.TimeDim))].filter(Boolean).sort();
        const sexes = [...new Set(data.map(row => row.Dim1))].filter(Boolean).sort();
        setAvailableYears(years);
        setAvailableSexes(sexes);

        const filteredData = data.filter(
          row => row.TimeDim === filters.year && row.Dim1 === filters.sex
        );
        const transformedData = filteredData.map(row => ({
          name: row.CountryName,
          value: parseFloat(row.NumericValue)
        })).filter(d => d.name && !isNaN(d.value));

        setMapData(transformedData);
      }
    });
  }, [filters]);

  const marks = availableYears.map((year, index) => ({
    value: parseInt(year),
    label: index % 5 === 0 ? year : '' // etiquetas cada 5 años
  }));

  return (
    <div>
      <div className={styles.sliderContainer}>
        <label className={styles.label}>Año: <strong>{filters.year}</strong></label>
        

        <ReactSlider
  className={styles.slider}
  thumbClassName={styles.thumb}
  trackClassName={styles.track}
  min={Math.min(...availableYears)}
  max={Math.max(...availableYears)}
  step={1}
  value={parseInt(filters.year)}
  onAfterChange={(val) => setFilters(prev => ({ ...prev, year: val.toString() }))}
  marks
  renderMark={(props) => {
    const year = props.key;
    const showLabel = availableYears.includes(year.toString()) && year % 2 === 0;
    return (
      <span
        {...props}
        className={`${styles.mark} ${props.className}`}
      >
        {showLabel ? year : ''}
      </span>
    );
  }}
/>


        <label className={styles.label} htmlFor="sexSelect">Sexo:</label>
        <select
          id="sexSelect"
          className={styles.select}
          value={filters.sex}
          onChange={(e) => setFilters(prev => ({ ...prev, sex: e.target.value }))}
        >
          {availableSexes.map(sex => (
            <option key={sex} value={sex}>{sex}</option>
          ))}
        </select>
      </div>

      <ComposableMap
        projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}
        className={styles.map}
        width={800}
        height={400}
        style={{ width: "100%", height: "auto" }}
      >
        <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
        <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
        {mapData.length > 0 ? (
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const d = mapData.find((s) => s.name === geo.properties.name);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={d ? colorScale(d.value) : "#F5F4F6"}
                    stroke="#FFF"
                    strokeWidth={0.5}
                    className={styles.geography}
                    onMouseEnter={() => {
                      const { name } = geo.properties;
                      const value = d ? `${d.value.toFixed(2)}%` : "Sin datos";
                      setTooltipContent(`${name} — ${value}`);
                    }}
                    onMouseLeave={() => setTooltipContent("")}
                    data-tooltip-id="map-tooltip"
                  />
                );
              })
            }
          </Geographies>
        ) : (
          <p style={{ textAlign: 'center' }}>Cargando datos o no hay resultados...</p>
        )}
      </ComposableMap>
    </div>
  );
};

export default memo(MapaCoropletico);
