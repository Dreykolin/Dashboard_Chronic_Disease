import React from 'react';
import styles from '@/styles/home/WeatherDetails.module.css'

function WeatherDetails({ feelsLike, uvIndex, shadeFeelsLike, windSpeed }) {
  return (
    <div className={styles.weather_info}>
      <div className={styles.dataBox}><b>Sensaciónº: </b>{feelsLike ?? 'N/A'}</div>
      <div className={styles.dataBox}><b>índice UV: </b>{uvIndex ?? 'N/A'}</div>
      <div className={styles.dataBox}><b>Sensación en la sombraº: </b>{shadeFeelsLike ?? 'N/A'}</div>
      <div className={styles.dataBox}><b>Viento: </b>{windSpeed ?? 'N/A'} km/h</div>
    </div>
  );
}

export default WeatherDetails;