import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
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

const indicatorLabels = {
    NCD_BMI_30A: "Obesidad (IMC ≥ 30)",
    NCD_DIABETES_PREVALENCE_AGESTD: "Prevalencia de diabetes",
    NCD_DIABETES_TREATMENT_AGESTD: "Tratamiento de diabetes",
    NCD_HYP_DIAGNOSIS_A: "Hipertensión diagnosticada",
    NCDMORT3070: "Probabilidad de morir 30-70 años (ENT)",
    SA_0000001438: "Mortalidad - cáncer de mama",
    SA_0000001439: "Mortalidad - cáncer colorrectal",
    SA_0000001445: "Mortalidad - cáncer de hígado",
    SA_0000001448: "Mortalidad - cáncer orofaríngeo",
    ORAL_HEALTH_CANCER_LIPORALCAVITY_100K: "Cáncer oral/labial",

};

const validIndicators = Object.keys(indicatorLabels);

const sexLabels = {
    SEX_FMLE: "Mujeres",
    SEX_MLE: "Hombres",
    SEX_BTSX: "Ambos sexos",
};

export default function StatisticsLand() {
    const [rawData, setRawData] = useState([]);
    const [barYear, setBarYear] = useState("Todos");
    const [barSex, setBarSex] = useState("Todos");
    const [barCountry, setBarCountry] = useState("Todos");

    const [waffleYear, setWaffleYear] = useState("Todos");
    const [waffleContinent, setWaffleContinent] = useState("Todos");

    useEffect(() => {
        fetch("/data/rawData.json")
            .then((res) => res.json())
            .then((data) => setRawData(data));
    }, []);

    const uniqueYears = [...new Set(rawData.map((d) => d.year))].sort();
    const uniqueSexes = [...new Set(rawData.map((d) => d.sex))].sort();
    const uniqueCountries = [...new Set(rawData.map((d) => d.country))].sort();
    const uniqueContinents = [...new Set(rawData.map((d) => d.continent))].sort();

    // Filtrado para gráfico de barras (con país y año)
    const filteredBarData = rawData.filter(
        (d) =>
            validIndicators.includes(d.indicator) &&
            (barYear === "Todos" || d.year == barYear) &&
            (barSex === "Todos" || d.sex === barSex) &&
            (barCountry === "Todos" || d.country === barCountry)
    );

    const avgByIndicator = Object.entries(
        filteredBarData.reduce((acc, d) => {
            if (!acc[d.indicator]) acc[d.indicator] = [];
            acc[d.indicator].push(d.value);
            return acc;
        }, {})
    ).map(([indicator, values]) => ({
        indicator,
        avg: parseFloat(
            (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2)
        ),
    })).sort((a, b) => b.avg - a.avg);

    // Filtrado para waffle chart solo por continente y año
    const waffleFilteredData = rawData.filter(
        (d) =>
            validIndicators.includes(d.indicator) &&
            (waffleContinent === "Todos" || d.continent === waffleContinent) &&
            (waffleYear === "Todos" || d.year == waffleYear)
    );

    const waffleData = waffleFilteredData.reduce((acc, d) => {
        const key = d.indicator;
        if (!acc[key]) acc[key] = 0;
        acc[key] += d.value;
        return acc;
    }, {});

    const totalWaffleValue = Object.values(waffleData).reduce((sum, val) => sum + val, 0);

    const waffleSummary = Object.entries(waffleData).map(([indicator, value]) => ({
        id: indicator,
        label: indicatorLabels[indicator] || indicator,
        value: Math.round((value / totalWaffleValue) * 100),
    })).filter((d) => d.value > 0);

    const renderCustomTick = ({ x, y, payload }) => {
        const label = indicatorLabels[payload.value] || payload.value;
        const words = label.split(" ");
        const firstLine = words.slice(0, 3).join(" ");
        const secondLine = words.slice(3).join(" ");
        return (
            <g transform={`translate(${x},${y + 10})`}>
                <text textAnchor="middle" fontSize={11}>
                    <tspan x={0} dy="0">{firstLine}</tspan>
                    {secondLine && <tspan x={0} dy="12">{secondLine}</tspan>}
                </text>
            </g>
        );
    };

    return (
        <div className={styles.container}>
            <h2>Indicadores de salud por país</h2>
            <div className={styles.filters}>
                <Select
                    className={styles.reactSelect}
                    value={{ value: barCountry, label: barCountry }}
                    options={uniqueCountries.map((c) => ({ value: c, label: c }))}
                    onChange={(selected) => setBarCountry(selected.value)}
                    placeholder="País"
                />
                <Select
                    className={styles.reactSelect}
                    value={{ value: barYear, label: barYear }}
                    options={[{ value: "Todos", label: "Todos" }, ...uniqueYears.map((y) => ({ value: y, label: y }))]}
                    onChange={(selected) => setBarYear(selected.value)}
                    placeholder="Año"
                />
                <Select
                    className={styles.reactSelect}
                    value={{ value: barSex, label: sexLabels[barSex] || barSex }}
                    options={[{ value: "Todos", label: "Todos" }, ...uniqueSexes.map((s) => ({ value: s, label: sexLabels[s] || s }))]}
                    onChange={(selected) => setBarSex(selected.value)}
                    placeholder="Sexo"
                />
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={avgByIndicator.slice(0, 20)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="indicator"
                        interval={0}
                        height={60}
                        tick={renderCustomTick}
                    />
                    <YAxis
                        tickFormatter={(value) => `${value}%`}
                        label={{
                            value: "Porcentaje",
                            angle: -90,
                            position: "insideLeft",
                            offset: +5,
                            style: { textAnchor: "middle", fontSize: 12 }
                        }}
                    />
                    <Tooltip formatter={(value, name, props) => [`${value}%`, indicatorLabels[props.payload.indicator] || props.payload.indicator]} />
                    <Legend />
                    <Bar dataKey="avg" fill="#e74c3c" name="Indicadores" />
                </BarChart>
            </ResponsiveContainer>

            <h2>Distribución de indicadores</h2>
            <div className={styles.filters}>
                <Select
                    className={styles.reactSelect}
                    value={{ value: waffleContinent, label: waffleContinent }}
                    options={[{ value: "Todos", label: "Todos" }, ...uniqueContinents.map((c) => ({ value: c, label: c }))]}
                    onChange={(selected) => setWaffleContinent(selected.value)}
                    placeholder="Continente"
                />
                <Select
                    className={styles.reactSelect}
                    value={{ value: waffleYear, label: waffleYear }}
                    options={[{ value: "Todos", label: "Todos" }, ...uniqueYears.map((y) => ({ value: y, label: y }))]}
                    onChange={(selected) => setWaffleYear(selected.value)}
                    placeholder="Año"
                />
            </div>
            <div style={{ height: 400 }}>
                <ResponsiveWaffle
                    data={waffleSummary}
                    total={100}
                    rows={10}
                    columns={10}
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
