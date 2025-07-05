// --- START OF FILE Coropletico.jsx ---

import React, { useState, memo } from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Tooltip } from 'react-tooltip';
import styles from '@/styles/Coropletico.module.css';

// URL al archivo TopoJSON con la geometría del mundo
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Datos de ejemplo. En una aplicación real, esto vendría de una API.
// El 'ISO_A3' es el código de 3 letras que une los datos con la geografía del mapa.
const data = [
  { ISO3: "ARG", name: "Argentina", value: 45 },
  { ISO3: "BRA", name: "Brazil", value: 88 },
  { ISO3: "USA", name: "United States", value: 95 },
  { ISO3: "CAN", name: "Canada", value: 70 },
  { ISO3: "MEX", name: "Mexico", value: 65 },
  { ISO3: "ESP", name: "Spain", value: 78 },
  { ISO3: "FRA", name: "France", value: 82 },
  { ISO3: "DEU", name: "Germany", value: 85 },
  { ISO3: "CHN", name: "China", value: 92 },
  { ISO3: "IND", name: "India", value: 50 },
  { ISO3: "RUS", name: "Russia", value: 60 },
  { ISO3: "AUS", name: "Australia", value: 75 },
  { ISO3: "ZAF", name: "South Africa", value: 40 },
];

// Creamos una escala de color. Mapea un dominio (nuestros datos de 0 a 100) a un rango (colores).
const colorScale = scaleLinear()
  .domain([0, 100])
  .range(["#ffedea", "#ff5233"]); // De un color claro a uno más intenso y moderno

const MapaCoropletico = ({ setTooltipContent }) => {
  return (
    <ComposableMap
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 147
      }}
      className={styles.map}
    >
      <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
      <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const d = data.find((s) => s.ISO3 === geo.properties.ISO_A3);
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={d ? colorScale(d.value) : "#F5F4F6"} // Color según datos o gris si no hay datos
                stroke="#FFF"
                strokeWidth={0.5}
                className={styles.geography}
                onMouseEnter={() => {
                  const { NAME } = geo.properties;
                  const value = d ? `${d.value}%` : "Sin datos";
                  setTooltipContent(`${NAME} — ${value}`);
                }}
                onMouseLeave={() => {
                  setTooltipContent("");
                }}
                data-tooltip-id="map-tooltip"
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
};

const MemoizedMapa = memo(MapaCoropletico);

export default function RecommendationWrapper() {
  const [content, setContent] = useState("");
  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Dashboard de Actividad Global</h1>
      <div className={styles.mapContainer}>
        <MemoizedMapa setTooltipContent={setContent} />
        <Tooltip id="map-tooltip" content={content} className={styles.tooltip} />
      </div>
    </div>
  );
}