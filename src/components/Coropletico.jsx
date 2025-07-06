import React, { useState, memo } from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Tooltip } from 'react-tooltip';
import styles from '@/styles/Coropletico.module.css';

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const data = [
    { ISO3: "ARG", name: "Argentina", value: 45 }, { ISO3: "BRA", name: "Brazil", value: 88 },
    { ISO3: "USA", name: "United States", value: 95 }, { ISO3: "CAN", name: "Canada", value: 70 },
    { ISO3: "MEX", name: "Mexico", value: 65 }, { ISO3: "ESP", name: "Spain", value: 78 },
    { ISO3: "FRA", name: "France", value: 82 }, { ISO3: "DEU", name: "Germany", value: 85 },
    { ISO3: "CHN", name: "China", value: 92 }, { ISO3: "IND", name: "India", value: 50 },
    { ISO3: "RUS", name: "Russia", value: 60 }, { ISO3: "AUS", name: "Australia", value: 75 },
    { ISO3: "ZAF", name: "South Africa", value: 40 },
];

const colorScale = scaleLinear().domain([0, 100]).range(["#ffedea", "#ff5233"]);

const MapaCoropletico = ({ setTooltipContent }) => {
    return (
        <ComposableMap
            projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}
            className={styles.map}
            width={800}
            height={400}
            style={{ width: "100%", height: "auto" }}
        >
            <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
            <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
            <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                    geographies.map((geo) => {
                        const d = data.find((s) => s.name === geo.properties.name);

                        return (
                            <Geography
                                key={geo.rsmKey} geography={geo}
                                fill={d ? colorScale(d.value) : "#F5F4F6"}
                                stroke="#FFF" strokeWidth={0.5}
                                className={styles.geography}
                                onMouseEnter={() => {
                                    const { name } = geo.properties;
                                    const value = d ? `${d.value}%` : "Sin datos";
                                    setTooltipContent(`${name} — ${value}`);
                                }}
                                onMouseLeave={() => setTooltipContent("")}
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
            <div className={styles.mapContainer}>
                <MemoizedMapa setTooltipContent={setContent} />
                <Tooltip id="map-tooltip" content={content} className={styles.tooltip} />
            </div>
        </div>
    );
}