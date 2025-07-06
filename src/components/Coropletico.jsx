import React, { useState, useEffect, memo } from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Tooltip } from 'react-tooltip';
import Papa from 'papaparse';
import styles from '@/styles/Coropletico.module.css';

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const CSV_URL = '/WHO-Cardiovascular Disease/NCDMORT3070_v2.csv';

const colorScale = scaleLinear().domain([10, 50]).range(["#ffedea", "#ff5233"]);

const MapaCoropletico = ({ setTooltipContent }) => {
    const [mapData, setMapData] = useState([]);
    //acá se cargan los csv, aún hay que ver como se filtra y eso
    useEffect(() => {
        Papa.parse(CSV_URL, {
            download: true,
            header: true,
            complete: (results) => {
                const filteredData = results.data.filter(
                    row => row.TimeDim === '2008' && row.Dim1 === 'SEX_MLE' //prueba
                );

                const transformedData = filteredData.map(row => ({ 
                    name: row.CountryName,
                    value: parseFloat(row.NumericValue)
                })).filter(d => d.name && !isNaN(d.value));

                setMapData(transformedData);
            }
        });
    }, []);










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
            {mapData.length > 0 && (
                <Geographies geography={GEO_URL}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            const d = mapData.find((s) => s.name === geo.properties.name);

                            return (
                                <Geography
                                    key={geo.rsmKey} geography={geo}
                                    fill={d ? colorScale(d.value) : "#F5F4F6"}
                                    stroke="#FFF" strokeWidth={0.5}
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
            )}
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