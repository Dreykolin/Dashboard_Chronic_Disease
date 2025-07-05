import React, { useState, useEffect } from 'react';
import WeatherImage from './WeatherImage';
import WeatherSummary from './WeatherSummary';
import WeatherDetails from './WeatherDetails';
import HealthCareTips from './HealthcareTips';
import ActivityRecommendation from './ActivityRecommendation';
//import RecommendationPagination from './PaginationRecommendation';
import { useSession } from "next-auth/react";

import styles from '@/styles/home/DailyRecommendation.module.css';

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.warn("Could not format date:", dateString);
    return dateString; 
  }
};

function DailyRecommendation({ weekDayName, dayData }) {
  if (!dayData) {
    return <p>Cargando datos diarios...</p>;
  }
  const {data:session} = useSession();

  const {
    condition: {icon},
    date,
    maxtemp_c,
    mintemp_c,
    avghumidity,
    avgtemp_c,
    uv,
    maxwind_kph,
    recommendations
  } = dayData;
  const totalRecommendations = recommendations ? recommendations.length : 0;

  recommendations.sort((a, b) => b.similarity - a.similarity);

  // Filtrar solo las recomendaciones con similitud mayor a 70%
  const filteredRecommendations = recommendations.filter(rec => rec.similarity * 100 > 70);

  // Tomar hasta 5 recomendaciones filtradas
  const selectedRecommendations = filteredRecommendations.slice(0, 5);

  let activityRecommendations = [];
  if (selectedRecommendations.length > 0 && session) {
    activityRecommendations = selectedRecommendations.map(recommendation => (
      <ActivityRecommendation 
        text={recommendation.name}
        similarity={recommendation.similarity}
      />
    ));
  }

  const healthTips = 'Mantente hidratado y usa protector solar. Considera las condiciones al planificar.';  //Placeholder
  const imageAlt = 'Representación del clima';

  return (
    <div className={styles.dailyRecWrapper}>
      <div className={styles.info_column}>
        <WeatherImage src={icon} alt={imageAlt} />
        <div className={styles.data_grid}>
          <WeatherSummary
            day={weekDayName}
            date={formatDate(date)}
            maxTemp={maxtemp_c}
            minTemp={mintemp_c}
            humidity={avghumidity}
          />
          <WeatherDetails
            feelsLike={Math.round((6.105*avghumidity/100)*(Math.exp(17.27*avgtemp_c/(237.7+avgtemp_c)))*100)/100}
            uvIndex={uv}
            shadeFeelsLike={Math.round(((6.105*avghumidity/100)*(Math.exp(17.27*avgtemp_c/(237.7+avgtemp_c)))-2)*100)/100}
            windSpeed={maxwind_kph}
          />
        </div>
        <HealthCareTips tips={healthTips} />
      </div>

      <div className={styles.recommendation_column}>
        {session && <h1 className={styles.recommendation_title}>Actividades Recomendadas</h1>}
        {!session && <h1 className={styles.recommendation_title}>Iniciar sesión para obtener recomendaciones</h1>}
        {totalRecommendations > 0 && session && activityRecommendations}
        {totalRecommendations == 0 && session &&
          <p>No existen recomendaciones disponibles en este momento!</p>
        }
      </div>
    </div>
  );
}

export default DailyRecommendation;