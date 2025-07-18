import React, { useState, useEffect } from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import Select from 'react-select';

const OBESITY_CODE = 'NCD_BMI_30A';
const CARDIO_CODE = 'NCDMORT3070';
const COLORS = [
    '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4',
    '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff',
    '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1',
    '#000075', '#808080', '#ffffff', '#000000'
];
export default function ScatterPlot({ rawData }) {
    // Defino directamente los años comunes del 2021 al 2000
    const commonYears = [];
    for (let y = 2021; y >= 2000; y--) {
        commonYears.push(String(y));
    }

    const [scatterData, setScatterData] = useState([]);
    const [scatterYear, setScatterYear] = useState(commonYears[0]); // Por defecto el 2021

    useEffect(() => {
        if (!rawData || rawData.length === 0) return;
        if (!scatterYear) return;

        const dataForYear = rawData.filter(d => String(d.year) === scatterYear);

        const dataByCountry = dataForYear.reduce((acc, row) => {
            const country = row.country;
            if (!acc[country]) acc[country] = { country };

            if (row.indicator === OBESITY_CODE) {
                acc[country].obesity = parseFloat(row.value);
            } else if (row.indicator === CARDIO_CODE) {
                acc[country].cardio = parseFloat(row.value);
            }
            return acc;
        }, {});

        const finalData = Object.values(dataByCountry).filter(
            d => d.obesity !== undefined && d.cardio !== undefined
        );

        setScatterData(finalData);
    }, [rawData, scatterYear]);

    return (
        <div style={{ padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <h2>Correlación: Obesidad vs. Mortalidad Cardiovascular</h2>

            <div style={{ marginBottom: '1.5rem', maxWidth: '200px' }}>
                <label htmlFor="year-select" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
                    Selecciona un Año:
                </label>
                <Select
                    id="year-select"
                    value={scatterYear ? { value: scatterYear, label: scatterYear } : null}
                    options={commonYears.map((y) => ({ value: y, label: y }))}
                    onChange={(selected) => setScatterYear(selected.value)}
                    placeholder="Selecciona un año disponible..."
                />
            </div>

            <ResponsiveContainer width="100%" height={450}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        dataKey="obesity"
                        name="Prevalencia de Obesidad"
                        unit="%"
                        domain={[0, 100]}
                        tickCount={6} // Para ticks en 0,20,40,60,80,100
                        label={{ value: 'Prevalencia de Obesidad (%)', position: 'insideBottom', offset: -15 }}
                    />
                    <YAxis
                        type="number"
                        dataKey="cardio"
                        name="Mortalidad Cardiovascular"
                        unit="%"
                        domain={[0, 100]}
                        tickCount={5} // Para ticks en 0,25,50,75,100
                        label={{ value: 'Mortalidad Cardiovascular (%)', angle: -90, position: 'insideBottomLeft', offset: 0 }}
                    />
                    <Tooltip
                        formatter={(value) => `${value}%`}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                    <div style={{ background: "#fff", padding: "10px", border: "1px solid #ccc" }}>
                                        <strong>{d.country}</strong><br />
                                        Obesidad: {d.obesity}%<br />
                                        Mortalidad Cardiovascular: {d.cardio}%
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Scatter name="Países" data={scatterData} fill="#e74c3c" shape="circle" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
