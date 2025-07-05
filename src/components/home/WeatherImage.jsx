import React from 'react';
import styles from '@/styles/home/WeatherImage.module.css'

function WeatherImage({ src, alt }) {   //Receives image source and alt text.
  return (
    <img className={styles.weather_image} src={src} alt={alt} />
  );
}

export default WeatherImage;