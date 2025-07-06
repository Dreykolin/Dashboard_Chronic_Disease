import React, { useState, memo } from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Tooltip } from 'react-tooltip';
import styles from './ChoroplethMap.module.css'; // <- ÚNICO CAMBIO: Ruta relativa de los estilos

// URL del mapa del mundo (no cambia)
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Tus datos de ejemplo. Más abajo te explico cómo traerlos desde Node.js
const mapData = [
  { ISO3: "ARG", name: "Argentina", value: 45 }, { ISO3: "BRA", name: "Brazil", value: 88 },
  { ISO3: "USA", name: "United States", value: 95 }, { ISO3: "CAN", name: "Canada", value: 70 },
  { ISO3: "MEX", name: "Mexico", value: 65 }, { ISO3: "ESP", name: "Spain", value: 78 },
  { ISO3: "FRA", name: "France", value: 82 }, { ISO3: "DEU", name: "Germany", value: 85 },
  { ISO3: "CHN", name: "China", value: 92 }, { ISO3: "IND", name: "India", value: 50 },
  { ISO3: "RUS", name: "Russia", value: 60 }, { ISO3: "AUS", name: "Australia", value: 75 },
  { ISO3: "ZAF", name: "South Africa", value: 40 },
];

// Escala de colores (no cambia)
const colorScale = scaleLinear().domain([0, 100]).range(["#ffedea", "#ff5233"]);

const ChoroplethMap = () => {
  const [tooltipContent, setTooltipContent] = useState("");

  return (
    <div className={styles.mapContainer}>
      <ComposableMap
        projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}
        width={800}
        height={400}
        style={{ width: "100%", height: "auto" }}
      >
        <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
        <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              // La corrección clave sigue aquí: ISO_A3 en mayúsculas
              const countryData = mapData.find(
                (s) => s.ISO3 === geo.properties.ISO_A3
              );

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={countryData ? colorScale(countryData.value) : "#F5F4F6"}
                  stroke="#FFF"
                  strokeWidth={0.5}
                  className={styles.geography}
                  data-tooltip-id="map-tooltip"
                  onMouseEnter={() => {
                    const { name } = geo.properties;
                    const value = countryData ? `${countryData.value}%` : "Sin datos";
                    setTooltipContent(`${name} — ${value}`);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <Tooltip id="map-tooltip" content={tooltipContent} />
    </div>
  );
};

export default memo(ChoroplethMap);