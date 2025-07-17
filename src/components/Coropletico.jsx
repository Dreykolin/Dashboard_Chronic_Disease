import React, { useState, useEffect, memo } from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import ReactSlider from 'react-slider';
import styles from '@/styles/Coropletico.module.css';
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const JSON_URL = '/data/rawData.json';
const colorScale = scaleLinear().domain([10, 50]).range(["#ffedea", "#ff5233"]);
const indicatorMapping = {
    "ORAL_HEALTH_CANCER_LIPORALCAVITY_100K": "Tasa ajustada de incidencia de cáncer de labios y cavidad oral (por 100.000 hab.)",
    "SA_0000001419": "Años de vida ajustados por discapacidad (DALYs) por cáncer de mama",
    "SA_0000001420": "DALYs por cáncer de colon y recto (ajustados por edad)",
    "SA_0000001430": "DALYs por cáncer de esófago (ajustados por edad)",
    "SA_0000001438": "Tasa de mortalidad ajustada por cáncer de mama",
    "SA_0000001439": "Tasa de mortalidad ajustada por cáncer de colon y recto",
    "SA_0000001445": "Tasa de mortalidad ajustada por cáncer de hígado",
    "SA_0000001448": "Tasa de mortalidad ajustada por cáncer orofaríngeoo",
    "NCDMORT3070": "Probabilidad(%) de morir entre los 30 y 70 años por ENT(CVD, cáncer, diabetes, respiratorias)",
    "NCD_DIABETES_PREVALENCE_AGESTD": "Prevalencia ajustada por edad de diabetes en adultos",
    "NCD_DIABETES_TREATMENT_AGESTD": "Porcentaje de personas con diabetes que reciben tratamiento (ajustado por edad)",
    "NCD_HYP_CONTROL_A": "Porcentaje de hipertensos con presión arterial controlada",
    "NCD_HYP_DIAGNOSIS_A": "Porcentaje de personas hipertensas que han sido diagnosticadas",
    "NCD_HYP_PREVALENCE_A": "Prevalencia de hipertensión arterial en adultos",
    "NCD_HYP_TREATMENT_A": "Porcentaje de personas hipertensas que reciben tratamiento",
    "NCD_BMI_30A": "Prevalencia ajustada por edad de obesidad (IMC ≥ 30)"
};
const indicatorLabels = {
    "ORAL_HEALTH_CANCER_LIPORALCAVITY_100K": "Cáncer oral/labial",
    "SA_0000001419": "DALYs - cáncer de mama",
    "SA_0000001420": "DALYs - cáncer colorrectal",
    "SA_0000001430": "DALYs - cáncer de esófago",
    "SA_0000001438": "Mortalidad - cáncer de mama",
    "SA_0000001439": "Mortalidad - cáncer colorrectal",
    "SA_0000001445": "Mortalidad - cáncer de hígado",
    "SA_0000001448": "Mortalidad - cáncer orofaríngeo",
    "NCDMORT3070": "Probabilidad de morir 30-70 años (ENT)",
    "NCD_DIABETES_PREVALENCE_AGESTD": "Prevalencia de diabetes",
    "NCD_DIABETES_TREATMENT_AGESTD": "Tratamiento de diabetes",
    "NCD_HYP_CONTROL_A": "Hipertensión controlada",
    "NCD_HYP_DIAGNOSIS_A": "Hipertensión diagnosticada",
    "NCD_HYP_PREVALENCE_A": "Prevalencia de hipertensión",
    "NCD_HYP_TREATMENT_A": "Tratamiento de hipertensión",
    "NCD_BMI_30A": "Obesidad (IMC ≥ 30)"
};
const sexLabels = {
    "SEX_FMLE": "Mujeres",
    "SEX_MLE": "Hombres",
    "SEX_BTSX": "Ambos sexos"
};
const MapaCoropletico = ({ filters, setFilters, setTooltipContent }) => {
    const [fullData, setFullData] = useState([]);
    const [mapData, setMapData] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [availableSexes, setAvailableSexes] = useState([]);
    const [availableIndicators, setAvailableIndicators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtersOpen, setFiltersOpen] = useState(true);
    useEffect(() => {
        if (fullData.length === 0 || !filters.indicator) return;

        // Filtrar por indicador y sexo
        const filteredData = fullData.filter(
            row =>
                row.indicator === filters.indicator &&
                row.sex === filters.sex
        );

        // Obtener años disponibles SOLO para este indicador
        const years = [...new Set(filteredData.map(row => row.year))]
            .filter(Boolean)
            .sort();

        setAvailableYears(years); // 🔥 Este setea los años dinámicamente

        // Transformar los datos
        const transformedData = filteredData.map(row => ({
            name: row.country,
            value: parseFloat(row.value)
        })).filter(d => d.name && !isNaN(d.value));

        setMapData(transformedData);

        // Si el año actual ya no está disponible, seleccionar el más reciente
        if (!years.includes(filters.year)) {
            setFilters(prev => ({ ...prev, year: years[years.length - 1] }));
        }

    }, [filters.indicator, filters.sex, fullData]);
    useEffect(() => {
        fetch(JSON_URL)
            .then(res => res.json())
            .then(data => {
                setFullData(data);
                const years = [...new Set(data.map(row => row.year))].filter(Boolean).sort();
                const sexes = [...new Set(data.map(row => row.sex))].filter(Boolean).sort();
                const indicators = [...new Set(data.map(row => row.indicator))].filter(Boolean).sort();
                setAvailableYears(years);
                setAvailableSexes(sexes);
                setAvailableIndicators(indicators);

                // Inicializar con el primer indicador si no hay uno ya seleccionado
                setFilters(prev => ({
                    ...prev,
                    indicator: prev.indicator || indicators[0],
                }));

                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching the data: ", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (fullData.length === 0) return;

        const filteredData = fullData.filter(
            row =>
                String(row.year) === String(filters.year) &&
                row.sex === filters.sex &&
                row.indicator === filters.indicator
        );

        const transformedData = filteredData.map(row => ({
            name: row.country,
            value: parseFloat(row.value)
        })).filter(d => d.name && !isNaN(d.value));

        setMapData(transformedData);
    }, [filters, fullData]);

    if (loading) {
        return <p style={{ textAlign: 'center' }}>Cargando mapa...</p>;
    }

    return (
        <div>
            <h2 className={styles.title}>
                {indicatorMapping[filters.indicator] || filters.indicator} ({sexLabels[filters.sex] || filters.sex}, {filters.year})
            </h2>
            <button
                className={styles.toggleButton}
                onClick={() => setFiltersOpen(!filtersOpen)}
            >
                Filtros{" "}
                <span className={`${styles.arrow} ${filtersOpen ? styles.rotate : ''}`}>
                    ▼
                </span>
            </button>
            {filtersOpen && (
            <div className={styles.sliderContainer}>
                <label className={styles.label}>Indicador:</label>
                <select
                    className={styles.select}
                    value={filters.indicator}
                    onChange={(e) => setFilters(prev => ({ ...prev, indicator: e.target.value }))}
                >
                    {availableIndicators.map(ind => (
                        <option key={ind} value={ind}>
                            {indicatorLabels[ind] || ind}
                        </option>
                    ))}
                </select>

                <label className={styles.label}>Año: <strong>{filters.year}</strong></label>

                <ReactSlider
                    className={styles.slider}
                    thumbClassName={styles.thumb}
                    trackClassName={styles.track}
                    min={availableYears.length > 0 ? Math.min(...availableYears.map(y => parseInt(y))) : 0}
                    max={availableYears.length > 0 ? Math.max(...availableYears.map(y => parseInt(y))) : 0}
                    step={1}
                    value={parseInt(filters.year)}
                    onAfterChange={(val) => setFilters(prev => ({ ...prev, year: val.toString() }))}
                    marks={availableYears.map(y => parseInt(y))}
                    renderMark={(props) => {
                        const year = props.key;
                        const showLabel = availableYears.includes(year.toString()) && year % 2 === 0;
                        if (!showLabel) return null;
                        return (
                            <span {...props} className={styles.mark}>
                                {year}
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
                        <option key={sex} value={sex}>
                            {sexLabels[sex] || sex}
                        </option>
                    ))}
                </select>
                </div>)}

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
                    <g>
                        <text x="50%" y="50%" textAnchor="middle" fill="#666">
                            No hay datos disponibles para la selección actual.
                        </text>
                    </g>
                )}
            </ComposableMap>
        </div>
    );
};

export default memo(MapaCoropletico);